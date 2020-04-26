import sqlite3
import itertools
from typing import Dict, List

# XXX black

from flask import Flask, g, jsonify, Blueprint, request
import pyproj

app = Flask(__name__)
api_bp = Blueprint(f"api", __name__)

# see https://epsg.io/4326 https://epsg.io/3857
# Note that database coords are stored as integer wgs84
wgs_84_to_slippy = pyproj.Transformer.from_crs(4326, 3857)

Coordinate = List[float]
LineString = List[Coordinate]
Polygon = List[LineString]


@api_bp.before_request
def before_request():
    try:
        conn = sqlite3.connect(app.config['DSN'])
    except Exception as e:
        # XXX error handling
        raise
    conn.isolation_level = None  # autocommit
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    g.cur = cur


@api_bp.after_request
def after_request(resp):
    if hasattr(g, 'cur'):
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
    p1_slippy_lat, p1_slippy_lng = wgs_84_to_slippy.transform(row["p1_lat"], row["p1_lng"])
    p2_slippy_lat, p2_slippy_lng = wgs_84_to_slippy.transform(row["p2_lat"], row["p2_lng"])
    return [
        [p1_slippy_lat, p1_slippy_lng],
        [p2_slippy_lat, p2_slippy_lng],
    ]


def _row_to_field(row: sqlite3.Row) -> Polygon:
    p1_slippy_lat, p1_slippy_lng = wgs_84_to_slippy.transform(row["p1_lat"], row["p1_lng"])
    p2_slippy_lat, p2_slippy_lng = wgs_84_to_slippy.transform(row["p2_lat"], row["p2_lng"])
    p3_slippy_lat, p3_slippy_lng = wgs_84_to_slippy.transform(row["p3_lat"], row["p3_lng"])
    return [[
        [p1_slippy_lat, p1_slippy_lng],
        [p2_slippy_lat, p2_slippy_lng],
        [p3_slippy_lat, p3_slippy_lng],
        [p1_slippy_lat, p1_slippy_lng],
    ]]


# XXX marshmallow? this is typescript MapGeometry

@api_bp.route('/map-geometry', methods=('GET',))
def get_map_geometry():
    retval = {
        "portals": [],
        "links": [],
        "fields": [],
    }
    portals = request.args.get("portals", "y") == "y"
    links = request.args.get("links", "y") == "y"
    fields = request.args.get("fields", "y") == "y"

    g.cur.execute('''
    SELECT MAX(obs_time) FROM portal_obs
    ''')
    max_obs_time = g.cur.fetchall()[0][0]

    if portals:
        g.cur.execute('''
        SELECT
              p.lat / 1e6 AS lat
            , p.lng / 1e6 AS lng
            , obs.team
            , obs.level
        FROM portal_obs obs
        JOIN portals p ON obs.portal = p.id
        WHERE obs_time = ?
        ORDER BY obs.team
        ''', (max_obs_time,))
        retval["portals"] = [
            {
                "team": team,
                "portals": [_row_to_portal(portal) for portal in portals],
            }
            for team, portals
            in itertools.groupby(g.cur, key=_team_key)
        ]

    if links:
        g.cur.execute('''
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
        ''', (max_obs_time,))
        retval["links"] = [
            {
                "team": team,
                "geoms": [_row_to_link(link) for link in links],
            }
            for team, links
            in itertools.groupby(g.cur, key=_team_key)
        ]

    if fields:
        g.cur.execute('''
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
        ''', (max_obs_time,))
        retval["fields"] = [
            {
                "team": team,
                "geoms": [_row_to_field(field) for field in fields],
            }
            for team, fields
            in itertools.groupby(g.cur, key=_team_key)
        ]

    return jsonify(retval)


# Must be last - routes are hooked up at registration time
app.register_blueprint(api_bp, url_prefix='/api')
