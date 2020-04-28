import tempfile
import sqlite3
import os

import pytest

from ngxinger import app, Teams


@pytest.fixture()
def temp_db():
    with tempfile.NamedTemporaryFile() as f:
        with sqlite3.connect(f.name) as conn:
            cur = conn.cursor()
            with open(os.path.dirname(__file__) + "/../schema.sql") as schema:
                cur.executescript(schema.read())
            cur.close()
        yield f.name


@pytest.fixture()
def client(temp_db):
    app.config.from_mapping({"DSN": temp_db})

    with app.test_client() as client:
        with app.app_context():
            yield client


TILE_ID = 1
PORTAL_1 = 1
PORTAL_1_LNG = round(-96.1 * 1e6)
PORTAL_1_LNG_SLIPPY = -10697803.06523359
PORTAL_1_LAT = round(41.1 * 1e6)
PORTAL_1_LAT_SLIPPY = 5027102.849122582
PORTAL_1_TIME_HELD = 60
PORTAL_2 = 2
PORTAL_2_LNG = round(-96.2 * 1e6)
PORTAL_2_LNG_SLIPPY = -10708935.014312917
PORTAL_2_LAT = round(41.2 * 1e6)
PORTAL_2_LAT_SLIPPY = 5041886.526155258
PORTAL_3 = 3
PORTAL_3_LNG = round(-96.3 * 1e6)
PORTAL_3_LNG_SLIPPY = -10720066.963392245
PORTAL_3_LAT = round(41.3 * 1e6)
PORTAL_3_LAT_SLIPPY = 5056692.808763346

NOW = 1588084793
VALID_BOUNDS = {"xmin": -10800000, "xmax": 0, "ymin": 0, "ymax": 6000000}
PLAYER_1_NAME = "Dr. Snowball Gilman"


@pytest.fixture(scope="function")
def test_data(temp_db):
    with sqlite3.connect(temp_db) as conn:
        cur = conn.cursor()
        cur.executescript(
            f"""
        INSERT INTO tiles
            (id, quadkey)
        VALUES
            ({TILE_ID}, 'tile1');
            
        INSERT INTO portals
            (id, guid, title, lat, lng, tile)
        VALUES
            ({PORTAL_1}, 'portal1', 'portal1', {PORTAL_1_LAT}, {PORTAL_1_LNG}, {TILE_ID}),
            ({PORTAL_2}, 'portal2', 'portal2', {PORTAL_2_LAT}, {PORTAL_2_LNG}, {TILE_ID}),
            ({PORTAL_3}, 'portal3', 'portal3', {PORTAL_3_LAT}, {PORTAL_3_LNG}, {TILE_ID});

        INSERT INTO portal_obs
            (id, portal, obs_time, team, level, health)
        VALUES
            ({PORTAL_1}, {PORTAL_1}, 10, {Teams.RESISTANCE}, 5, 100),
            ({PORTAL_2}, {PORTAL_2}, 10, {Teams.RESISTANCE}, 5, 100),
            ({PORTAL_3}, {PORTAL_3}, 10, {Teams.RESISTANCE}, 5, 100);

        INSERT INTO link_obs
            (id, portal_head, portal_tail)
        VALUES
            (1, {PORTAL_1}, {PORTAL_2}),
            (2, {PORTAL_2}, {PORTAL_3}),
            (3, {PORTAL_3}, {PORTAL_1});

        INSERT INTO field_obs
            (id, portal1, portal2, portal3)
        VALUES
            (1, {PORTAL_1}, {PORTAL_2}, {PORTAL_3});

        INSERT INTO stats_longest_held
            (faction, portal_id, td)
        VALUES
            ({Teams.RESISTANCE}, {PORTAL_1}, '0_{PORTAL_1_TIME_HELD}');

        INSERT INTO players
            (id, name, faction, realname)
        VALUES
            (1, '{PLAYER_1_NAME}', {Teams.RESISTANCE}, '{PLAYER_1_NAME}');
        
        INSERT INTO resonator_plexts
            (timestampMs, player, portal, destroyed)
        VALUES
            ({NOW}, 1, {PORTAL_1}, 0),
            ({NOW}, 1, {PORTAL_1}, 1);
        """
        )
    yield
    with sqlite3.connect(temp_db) as conn:
        cur = conn.cursor()
        cur.executescript(
            """
        DELETE FROM resonator_plexts;
        DELETE FROM players;
        DELETE FROM stats_longest_held;
        DELETE FROM field_obs;
        DELETE FROM link_obs;
        DELETE FROM portal_obs;
        DELETE FROM portals;
        DELETE FROM tiles;
        """
        )


def test_explode(client):
    get_response = client.get("/api/explode")
    assert get_response.status_code == 400
    assert get_response.json == {"error": "This always fails."}


def test_map_geometry_full_response(client, test_data):
    get_response = client.get("/api/map-geometry")
    assert get_response.status_code == 200
    data = get_response.json

    assert len(data["fields"]) == 1
    field = data["fields"][0]
    assert field["team"] == Teams.RESISTANCE
    assert len(field["geoms"][0]) == 1
    polygon = field["geoms"][0][0]
    assert len(polygon) == 4
    assert [PORTAL_1_LNG_SLIPPY, PORTAL_1_LAT_SLIPPY] in polygon
    assert [PORTAL_2_LNG_SLIPPY, PORTAL_2_LAT_SLIPPY] in polygon
    assert [PORTAL_3_LNG_SLIPPY, PORTAL_3_LAT_SLIPPY] in polygon

    assert len(data["links"]) == 1
    links = data["links"][0]
    assert links["team"] == Teams.RESISTANCE
    assert len(links["geoms"]) == 3

    assert len(data["portals"]) == 1
    portals = data["portals"][0]["portals"]
    assert len(portals) == 3
    assert (
        len(
            [
                p
                for p in portals
                if p["coord"] == [PORTAL_1_LNG_SLIPPY, PORTAL_1_LAT_SLIPPY]
            ]
        )
        == 1
    )
    assert (
        len(
            [
                p
                for p in portals
                if p["coord"] == [PORTAL_2_LNG_SLIPPY, PORTAL_2_LAT_SLIPPY]
            ]
        )
        == 1
    )
    assert (
        len(
            [
                p
                for p in portals
                if p["coord"] == [PORTAL_3_LNG_SLIPPY, PORTAL_3_LAT_SLIPPY]
            ]
        )
        == 1
    )


@pytest.mark.parametrize(
    "query_string,portal_len,link_len,field_len",
    [
        [{"portals": "y", "links": "n", "fields": "n"}, 1, 0, 0],
        [{"portals": "n", "links": "y", "fields": "n"}, 0, 1, 0],
        [{"portals": "n", "links": "n", "fields": "y"}, 0, 0, 1],
    ],
)
def test_map_geometry_querystring(
    client, test_data, query_string, portal_len, link_len, field_len
):
    get_response = client.get("/api/map-geometry", query_string=query_string)
    assert get_response.status_code == 200
    data = get_response.json

    assert len(data["portals"]) == portal_len
    assert len(data["links"]) == link_len
    assert len(data["fields"]) == field_len


def test_get_longest_held_full_response(client, test_data):
    get_response = client.get(
        "/api/longest-held", query_string={"team": Teams.RESISTANCE.value}
    )
    assert get_response.status_code == 200
    data = get_response.json

    assert len(data) == 1
    assert data[0]["held_length"] == PORTAL_1_TIME_HELD
    assert data[0]["lng"] == PORTAL_1_LAT_SLIPPY
    assert data[0]["lat"] == PORTAL_1_LNG_SLIPPY


def test_get_longest_held_invalid_team(client, test_data):
    get_response = client.get("/api/longest-held", query_string={"team": 100})
    assert get_response.status_code == 400
    assert get_response.json["error"] == "Invalid team parameter"


# Although I could unit test _validate_neighborhood_queryparams
# this is going to give me a lot of bang for my buck
@pytest.mark.parametrize(
    "route,query_string,error_msg",
    [
        [
            "/api/neighborhood-hourly",
            {"xmax": 0, "ymin": 0, "ymax": 0},
            "Required parameter xmin missing",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": 0, "ymin": 0, "ymax": 0},
            "Required parameter xmax missing",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": 0, "xmax": 0, "ymax": 0},
            "Required parameter ymin missing",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": 0, "xmax": 0, "ymin": 0},
            "Required parameter ymax missing",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": "x", "xmax": 0, "ymin": 0, "ymax": 0},
            "Unable to parse xmin as float",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": 0, "xmax": "x", "ymin": 0, "ymax": 0},
            "Unable to parse xmax as float",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": 0, "xmax": 0, "ymin": "x", "ymax": 0},
            "Unable to parse ymin as float",
        ],
        [
            "/api/neighborhood-hourly",
            {"xmin": 0, "xmax": 0, "ymin": 0, "ymax": "x"},
            "Unable to parse ymax as float",
        ],
        [
            "/api/neighborhood-players",
            {"xmax": 0, "ymin": 0, "ymax": 0},
            "Required parameter xmin missing",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": 0, "ymin": 0, "ymax": 0},
            "Required parameter xmax missing",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": 0, "xmax": 0, "ymax": 0},
            "Required parameter ymin missing",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": 0, "xmax": 0, "ymin": 0},
            "Required parameter ymax missing",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": "x", "xmax": 0, "ymin": 0, "ymax": 0},
            "Unable to parse xmin as float",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": 0, "xmax": "x", "ymin": 0, "ymax": 0},
            "Unable to parse xmax as float",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": 0, "xmax": 0, "ymin": "x", "ymax": 0},
            "Unable to parse ymin as float",
        ],
        [
            "/api/neighborhood-players",
            {"xmin": 0, "xmax": 0, "ymin": 0, "ymax": "x"},
            "Unable to parse ymax as float",
        ],
    ],
)
def test_get_neighborhood_routes_invalid_params(
    client, test_data, route, query_string, error_msg
):
    get_response = client.get(route, query_string=query_string)
    assert get_response.status_code == 400
    assert get_response.json["error"] == error_msg


def test_get_neighborhood_hourly_is_sorted(client, test_data):
    # Arrange: a request
    get_response = client.get("/api/neighborhood-hourly", query_string=VALID_BOUNDS)
    assert get_response.status_code == 200
    data = get_response.json

    # Act: give row ids to each row in the input
    orig = list(enumerate(data))
    resorted = sorted(orig, key=lambda x: x[1]["hour"])
    orig_row_ids = [x[0] for x in orig]
    resorted_row_ids = [x[0] for x in resorted]

    # Assert that the response was already sorted (the enumerate keys are in the same order)
    assert orig_row_ids == resorted_row_ids


def test_get_neighborhood_hourly(client, test_data):
    get_response = client.get("/api/neighborhood-hourly", query_string=VALID_BOUNDS)
    assert get_response.status_code == 200
    data = get_response.json

    # Assert that all 24 hours hava a destroyed and created field
    # This has got to be O(n**500000) but it runs fast
    for hour in range(23):
        for destroyed in (0, 1):
            our_row = [
                x for x in data if x["hour"] == hour and x["destroyed"] == destroyed
            ]
            assert len(our_row) == 1
            our_row = our_row[0]

            # Assert on the actual data in the table
            if hour == 3:
                assert our_row["action_count"] == 1
            else:
                assert our_row["action_count"] == 0


def test_get_neighborhood_players(client, test_data):
    get_response = client.get("/api/neighborhood-players", query_string=VALID_BOUNDS)
    assert get_response.status_code == 200
    data = get_response.json

    assert len(data) == 1
    assert data[0] == {"built_count": 1, "destroyed_count": 1, "name": PLAYER_1_NAME}
