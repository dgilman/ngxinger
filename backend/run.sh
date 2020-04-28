#!/usr/bin/env bash

(env $(cat .env | xargs) FLASK_APP=ngxinger flask run)
