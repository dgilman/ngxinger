CREATE TABLE tiles (
   id INTEGER PRIMARY KEY,
   quadkey TEXT NOT NULL UNIQUE
   );
CREATE TABLE portals (
   id INTEGER PRIMARY KEY,
   guid TEXT NOT NULL UNIQUE,
   title TEXT NOT NULL,
   lat INTEGER NOT NULL,
   lng INTEGER NOT NULL,
   tile INTEGER,
   first_obs unix,
   FOREIGN KEY (tile) REFERENCES tiles(id)
   );
CREATE TABLE portal_obs (
   id INTEGER PRIMARY KEY,
   portal INTEGER,
   obs_time unix NOT NULL,
   team INTEGER,
   level INTEGER,
   health INTEGER,

   FOREIGN KEY (portal) REFERENCES portals(id)
   );
CREATE TABLE link_obs (
   id INTEGER PRIMARY KEY,
   portal_head INTEGER,
   portal_tail INTEGER,
   FOREIGN KEY (portal_head) REFERENCES portal_obs(id),
   FOREIGN KEY (portal_tail) REFERENCES portal_obs(id),
   UNIQUE (portal_head, portal_tail)
   );
CREATE TABLE field_obs (
   id INTEGER PRIMARY KEY,
   portal1 INTEGER,
   portal2 INTEGER,
   portal3 INTEGER,
   FOREIGN KEY (portal1) REFERENCES portal_obs(id),
   FOREIGN KEY (portal2) REFERENCES portal_obs(id),
   FOREIGN KEY (portal3) REFERENCES portal_obs(id),
   UNIQUE (portal1, portal2, portal3)
   );
CREATE TABLE scrape_info (
   scrape_time unix PRIMARY KEY,
   missed_portals text,
   not_seen text
   , neut_dist text, enl_dist text, res_dist text, enl_structs text, res_structs text, last_plext integer, db_size integer, plext_db_size integer, oldest_plext integer);
CREATE TABLE stats_longest_held (
   scrape_time unix,
   faction integer,
   portal_id integer,
   td timedelta
   );
CREATE TABLE stats_most_active (
   scrape_time unix,
   portal_id integer,
   average_td timedelta,
   flip_count integer
   );
CREATE TABLE stats_weakest_by_link (
   scrape_time unix,
   faction integer,
   portal_id integer,
   health integer,
   level integer,
   links integer
   );
CREATE TABLE stats_most_links (
   scrape_time unix,
   faction integer,
   portal_id integer,
   links integer
   );
CREATE TABLE stats_weakest_by_age (
   scrape_time unix,
   faction integer,
   portal_id integer,
   current_held_time timedelta,
   health integer
   );
CREATE TABLE portal_history (
   id INTEGER PRIMARY KEY,
   portal INTEGER REFERENCES portals(id),
   latE6 INTEGER,
   lngE6 INTEGER,
   title TEXT
   );
CREATE TABLE neighborhoods (
   id INTEGER PRIMARY KEY,
   name TEXT UNIQUE,
   x1 INTEGER,
   y1 INTEGER,
   x2 INTEGER,
   y2 INTEGER
   );
CREATE TABLE stats_field_mu (
   scrape_time unix,
   faction integer,
   portal_id integer,
   mu integer
   );
CREATE TABLE stats_plext_owner (
   scrape_time unix,
   portal_id integer,
   player_id integer
   );
CREATE TABLE stats_player_captures (   player_id integer, portal_id integer,    PRIMARY KEY (player_id, portal_id) );
CREATE TABLE players (
   id INTEGER PRIMARY KEY,
   name TEXT,
   faction INTEGER,
   realname TEXT UNIQUE,
   googplus TEXT,
   vehicle TEXT,
   other TEXT,
   completed_training integer,
   first_portal integer,
   first_control_field integer,
   first_link integer
   );
CREATE TABLE chat (
   id INTEGER PRIMARY KEY,
   timestampMs INTEGER,
   faction INTEGER,
   player INTEGER REFERENCES players(id),
   chat text
   );
CREATE TABLE chat_mentions (
   chat INTEGER REFERENCES chat(id),
   player INTEGER REFERENCES players(id)
   );
CREATE TABLE link_plexts (
   timestampMs INTEGER,
   p1 INTEGER REFERENCES portals(id),
   p2 INTEGER REFERENCES portals(id),
   player INTEGER REFERENCES players(id),
   destroyed BOOLEAN
   );
CREATE TABLE field_plexts (
   timestampMs INTEGER,
   player INTEGER REFERENCES players(id),
   p1 INTEGER REFERENCES portals(id),
   mu INTEGER,
   destroyed BOOLEAN
   );
CREATE TABLE resonator_plexts (
   timestampMs INTEGER,
   player INTEGER REFERENCES players(id),
   portal INTEGER REFERENCES portals(id),
   level INTEGER,
   destroyed BOOLEAN
   );
CREATE TABLE captured_plexts (
   timestampMs INTEGER,
   player INTEGER REFERENCES players(id),
   portal INTEGER REFERENCES portals(id)
   );
CREATE TABLE fracks (
   timestampMs INTEGER,
   player INTEGER REFERENCES players(id),
   portal INTEGER REFERENCES portals(id)
   );

-- These indexes were created for other queries and are probably useless

CREATE INDEX portals_first_obs ON portals (first_obs DESC);
CREATE INDEX portal_obs_portal_obs_time ON portal_obs (portal, obs_time);
CREATE INDEX link_obs_portal_tail ON link_obs (portal_tail);
CREATE INDEX field_obs_portal2 ON field_obs (portal2);
CREATE INDEX field_obs_portal3 ON field_obs (portal3);
CREATE INDEX stats_longest_held_scrape_time ON stats_longest_held (scrape_time);
CREATE INDEX stats_most_active_scrape_time ON stats_most_active (scrape_time);
CREATE INDEX stats_weakest_by_link_scrape_time ON stats_weakest_by_link (scrape_time);
CREATE INDEX stats_most_links_scrape_time ON stats_most_links (scrape_time);
CREATE INDEX stats_weakest_by_age_scrape_time ON stats_weakest_by_age (scrape_time);
CREATE INDEX stats_field_mu_scrape_time ON stats_field_mu (scrape_time);
CREATE INDEX stats_plext_owner_scrape_time ON stats_plext_owner (scrape_time);
CREATE INDEX players_faction ON players (faction);
CREATE INDEX chat_faction_timestampMs ON chat (faction, timestampMs);
CREATE INDEX chat_mentions_chat ON chat_mentions (chat);
CREATE INDEX link_plexts_player_timestampMs ON link_plexts(player, timestampMs);
CREATE INDEX field_plexts_player_timestampMs ON field_plexts(player, timestampMs);
CREATE INDEX resonator_plexts_player_timestampMs ON resonator_plexts(player, timestampMs);
CREATE INDEX captured_plexts_player_timestampMs ON captured_plexts (player, timestampMs);
CREATE INDEX fracks_player_timestampMs ON fracks (player, timestampMs);
CREATE INDEX fracks_portal ON fracks (portal);

-- ngxinger indexes
create index portals_lat on portals (lat);
create index portals_lng on portals (lng);
create index resonator_plexts_portal on resonator_plexts (portal);

