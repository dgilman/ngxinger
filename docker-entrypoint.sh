#!/usr/bin/env bash
set -euo pipefail

export NGXINGER_DSN=nxginger_omaha.sqlite3
./ngxinger.pex ngxinger:app -k gthread -w 1 --threads 10 --bind unix:/run/ngxinger.socket &
sleep 5  # sure, why not
nginx &

tail -f /dev/null
