#!/usr/bin/env bash

(env $(cat .env | xargs) flask run)
