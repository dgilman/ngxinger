import sqlite3
import itertools
from typing import Dict, List

# XXX black
# XXX top-level error handler

from flask import Flask, g, jsonify, Blueprint, request
import pyproj

app = Flask(__name__)
api_bp = Blueprint(f"api", __name__)

# see https://epsg.io/4326 https://epsg.io/3857
# Note that database coords are stored as integer wgs84
wgs_84_to_slippy = pyproj.Transformer.from_crs(4326, 3857)
slippy_to_wgs_84 = pyproj.Transformer.from_crs(3857, 4326)

Coordinate = List[float]
LineString = List[Coordinate]
Polygon = List[LineString]


@api_bp.before_request
def before_request():
    try:
        conn = sqlite3.connect(app.config["DSN"])
    except Exception as e:
        # XXX error handling
        raise
    conn.isolation_level = None  # autocommit
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    g.cur = cur


@api_bp.after_request
def after_request(resp):
    if hasattr(g, "cur"):
        conn = g.cur.connection
        g.cur.close()
        conn.close()
    return resp


def _team_key(row):
    return row["team"]


def _row_to_portal(row: sqlite3.Row) -> Dict:
    slippy_lat, slippy_lng = wgs_84_to_slippy.transform(row["lat"], row["lng"])
    return {
        "coord": [slippy_lat, slippy_lng],
        "level": row["level"],
    }


def _row_to_link(row: sqlite3.Row) -> LineString:
    p1_slippy_lat, p1_slippy_lng = wgs_84_to_slippy.transform(
        row["p1_lat"], row["p1_lng"]
    )
    p2_slippy_lat, p2_slippy_lng = wgs_84_to_slippy.transform(
        row["p2_lat"], row["p2_lng"]
    )
    return [
        [p1_slippy_lat, p1_slippy_lng],
        [p2_slippy_lat, p2_slippy_lng],
    ]


def _row_to_field(row: sqlite3.Row) -> Polygon:
    p1_slippy_lat, p1_slippy_lng = wgs_84_to_slippy.transform(
        row["p1_lat"], row["p1_lng"]
    )
    p2_slippy_lat, p2_slippy_lng = wgs_84_to_slippy.transform(
        row["p2_lat"], row["p2_lng"]
    )
    p3_slippy_lat, p3_slippy_lng = wgs_84_to_slippy.transform(
        row["p3_lat"], row["p3_lng"]
    )
    return [
        [
            [p1_slippy_lat, p1_slippy_lng],
            [p2_slippy_lat, p2_slippy_lng],
            [p3_slippy_lat, p3_slippy_lng],
            [p1_slippy_lat, p1_slippy_lng],
        ]
    ]


# XXX marshmallow? this is typescript MapGeometry


@api_bp.route("/map-geometry", methods=("GET",))
def get_map_geometry():
    retval = {
        "portals": [],
        "links": [],
        "fields": [],
    }
    portals = request.args.get("portals", "y") == "y"
    links = request.args.get("links", "y") == "y"
    fields = request.args.get("fields", "y") == "y"

    g.cur.execute(
        """
    SELECT MAX(obs_time) FROM portal_obs
    """
    )
    max_obs_time = g.cur.fetchall()[0][0]

    if portals:
        g.cur.execute(
            """
        SELECT
              p.lat / 1e6 AS lat
            , p.lng / 1e6 AS lng
            , obs.team
            , obs.level
        FROM portal_obs obs
        JOIN portals p ON obs.portal = p.id
        WHERE obs_time = ?
        ORDER BY obs.team
        """,
            (max_obs_time,),
        )
        retval["portals"] = [
            {"team": team, "portals": [_row_to_portal(portal) for portal in portals],}
            for team, portals in itertools.groupby(g.cur, key=_team_key)
        ]

    if links:
        g.cur.execute(
            """
        SELECT
            p1_obs.team
            , p1.lat / 1e6 AS p1_lat
            , p1.lng / 1e6 AS p1_lng
            , p2.lat / 1e6 AS p2_lat
            , p2.lng / 1e6 AS p2_lng
        FROM link_obs
        JOIN portal_obs p1_obs ON link_obs.portal_head = p1_obs.id
        JOIN portal_obs p2_obs ON link_obs.portal_tail = p2_obs.id
        JOIN portals p1 ON p1_obs.portal = p1.id
        JOIN portals p2 ON p2_obs.portal = p2.id
        WHERE p1_obs.obs_time = ?
        ORDER BY p1_obs.team
        """,
            (max_obs_time,),
        )
        retval["links"] = [
            {"team": team, "geoms": [_row_to_link(link) for link in links],}
            for team, links in itertools.groupby(g.cur, key=_team_key)
        ]

    if fields:
        g.cur.execute(
            """
        SELECT
            p1_obs.team
            , p1.lat / 1e6 AS p1_lat
            , p1.lng / 1e6 AS p1_lng
            , p2.lat / 1e6 AS p2_lat
            , p2.lng / 1e6 AS p2_lng
            , p3.lat / 1e6 AS p3_lat
            , p3.lng / 1e6 AS p3_lng
        FROM field_obs
        JOIN portal_obs p1_obs ON field_obs.portal1 = p1_obs.id
        JOIN portal_obs p2_obs ON field_obs.portal2 = p2_obs.id
        JOIN portal_obs p3_obs ON field_obs.portal3 = p3_obs.id
        JOIN portals p1 ON p1_obs.portal = p1.id
        JOIN portals p2 ON p2_obs.portal = p2.id
        JOIN portals p3 ON p3_obs.portal = p3.id
        WHERE p1_obs.obs_time = ?
        ORDER BY p1_obs.team
        """,
            (max_obs_time,),
        )
        retval["fields"] = [
            {"team": team, "geoms": [_row_to_field(field) for field in fields],}
            for team, fields in itertools.groupby(g.cur, key=_team_key)
        ]

    return jsonify(retval)


SECONDS_PER_DAY = 24 * 60 * 60


def _db_td_to_human_string(db_td: str) -> int:
    # Time deltas are stored in the database as "days_seconds"
    days, seconds = db_td.split("_")
    return (int(days) * SECONDS_PER_DAY) + int(seconds)


def _row_to_longest_held(row: sqlite3.Row) -> Dict:
    slippy_lat, slippy_lon = wgs_84_to_slippy.transform(row["lat"], row["lng"])
    return {
        "lat": slippy_lat,
        "lng": slippy_lon,
        "title": row["title"],
        "held_length": _db_td_to_human_string(row["td"]),
    }


@api_bp.route("/longest-held")
def get_longest_held():
    team = int(request.args.get("team", 0))

    if team not in (0, 1, 2):
        raise Exception("Invalid team parameter")

    # Although not good database practice the original stats code
    # saved this table in descending order so a plain LIMIT works correctly.
    # You'll just have to trust me on this one, I guess that works in SQLite.
    g.cur.execute(
        """
    SELECT
        p.lat / 1e6 AS lat
        , p.lng / 1e6 AS lng
        , p.title
        , td
    FROM stats_longest_held s
    JOIN portals p ON s.portal_id = p.id
    WHERE s.faction = ?
    """,
        (team,),
    )
    return jsonify([_row_to_longest_held(row) for row in g.cur])


# A note on database indexes:
# It would be cool if this was a real spatial database
# with a 2d index type, then we could take the user's arbitrary polygon
# and throw it at the database for these queries.  Instead, we find the extremes and
# make a bounding box around it.

# All hope of fast queries are not lost, though. The bounding box SQL
# looks like this:
# WHERE lon BETWEEN xmin AND xmax
#   AND lat BETWEEN ymin AND ymax

# If we build a regular b-tree index on (lon, lat) only the first column
# in the index gets used.  Not so great.
# If we build an index on (lon) and one on (lat): in most databases you can really only use
# one index per table, and sqlite is one of those.
# But all hope is not lost: depending on the statistical distribution of the data
# in the table you may have one of those indexes be decently selective, and if
# your table's statistics are up-to-date hopefully the query planner will pick that one.
# Although this is not a viable solution for large databases my gut is that you'll still
# see good results from 1-dimensional indexes on a lot of data sets.


def _degree_to_db(degree: float) -> int:
    return round(degree * 1e6)


def _validate_neighborhood_queryparams():
    for arg in ("xmin", "xmax", "ymin", "ymax"):
        if arg not in request.args:
            raise Exception(f"Required parameter {arg} missing")
        try:
            float(request.args[arg])
        except ValueError:
            raise Exception(f"Unable to parse {arg} as float")

    xmin = float(request.args["xmin"])
    xmax = float(request.args["xmax"])
    ymin = float(request.args["ymin"])
    ymax = float(request.args["ymax"])

    lat_min, lng_min = slippy_to_wgs_84.transform(xmin, ymin)
    lat_max, lng_max = slippy_to_wgs_84.transform(xmax, ymax)

    return lat_min, lng_min, lat_max, lng_max


@api_bp.route("/neighborhood-hourly")
def get_neighborhood_hourly():
    lat_min, lng_min, lat_max, lng_max = _validate_neighborhood_queryparams()

    g.cur.execute(
        """
    WITH hours_in_day (hour) AS (
        VALUES 
            -- generate_series is not compiled into most sqlites
            (0), (1), (2), (3), (4), (5), (6),
            (7), (8), (9), (10), (11), (12), (13),
            (14), (15), (16), (17), (18), (19),
            (20), (21), (22), (23)
    ), base_values (hour, destroyed) AS (
        SELECT hour, 0 AS destroyed FROM hours_in_day
        UNION ALL
        SELECT hour, 1 AS destroyed FROM hours_in_day
    )
    SELECT
        base_values.hour
        , base_values.destroyed
        , coalesce(stats.action_count, 0) as action_count
    FROM base_values
    LEFT JOIN (
        SELECT
            hour
            , destroyed
            , COUNT(*) as action_count
        FROM (
            SELECT
                -- timestampMs is millisecond UTC since UNIX epoch.
                -- The relevant area is in CST, so we roughly estimate CST local time
                -- by subtracting 6 hours from it. Unfortunately SQLite doesn't give us
                -- anything more sophisticated.
                  cast(strftime('%H', timestampMs/1000 - 6*60*60, 'unixepoch') AS integer) AS hour
                , destroyed
            FROM resonator_plexts r
            JOIN (
                SELECT id
                FROM portals
                WHERE lat BETWEEN ? AND ?
                  AND lng BETWEEN ? AND ?
            ) p ON r.portal = p.id
        ) events
        GROUP BY hour, destroyed
    ) stats ON base_values.hour = stats.hour AND base_values.destroyed = stats.destroyed
    ORDER BY base_values.hour
    """,
        (
            _degree_to_db(lat_min),
            _degree_to_db(lat_max),
            _degree_to_db(lng_min),
            _degree_to_db(lng_max),
        ),
    )
    return jsonify([dict(row) for row in g.cur])


@api_bp.route("/neighborhood-players")
def get_neighborhood_players():
    lat_min, lng_min, lat_max, lng_max = _validate_neighborhood_queryparams()

    g.cur.execute(
        """
    SELECT
        name
        , built_count
        , destroyed_count
    FROM (
        SELECT
            players.name
            , COUNT(*) FILTER (WHERE destroyed = 0) AS built_count
            , COUNT(*) FILTER (WHERE destroyed = 1) AS destroyed_count
        FROM resonator_plexts r
        JOIN (
            SELECT id
            FROM portals
            WHERE lat BETWEEN ? AND ?
              AND lng BETWEEN ? AND ?
        ) p ON r.portal = p.id
        JOIN players ON r.player = players.id
        GROUP BY players.name
    ) inn
    ORDER BY built_count + destroyed_count DESC
    LIMIT 20
    """,
        (
            _degree_to_db(lat_min),
            _degree_to_db(lat_max),
            _degree_to_db(lng_min),
            _degree_to_db(lng_max),
        ),
    )
    return jsonify([dict(row) for row in g.cur])


# Must be last - routes are hooked up at registration time
app.register_blueprint(api_bp, url_prefix="/api")
