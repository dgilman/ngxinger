import sqlite3

from flask import Flask, g, jsonify, Blueprint

app = Flask(__name__)
api_bp = Blueprint(f"api", __name__)


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


@api_bp.route('/mostwanted-map', methods=('GET',))
def get_mostwanted_map():
    g.cur.execute('''
    SELECT
          p.id
        , p.lat
        , p.lng
        , obs.team
        , obs.level
    FROM portal_obs obs
    JOIN portals p ON obs.portal = p.id
    WHERE obs_time = (SELECT MAX(obs_time) FROM portal_obs)
    ORDER BY p.id
    ''')

    return jsonify([
        {
            "portal_id": row["id"],
            "lat": row["lat"],
            "lng": row["lng"],
            "team": row["team"],
            "level": row["level"],
        }
        for row in g.cur
    ])


# Must be last - routes are hooked up at registration time
app.register_blueprint(api_bp, url_prefix='/api')
