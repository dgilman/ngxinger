# Overview
Players are on two teams, green and blue.

Players compete to capture portals (individual points, Pokemon Go gyms).

Two portals can be joined together in a straight line called a link

A triangle of linked portals becomes a field

## Data model
The data set used here is extracted from a game called Ingress, made by the company that made Pokemon Go. The schema is in backend/schema.sql but the database was built years ago for a different project not sharing any code with this one so there's a lot of extra tables and indexes that aren't used by this codebase but are still hanging around.

# Backend
Unremarkable Flask REST API app with tests.

# Frontend
Built in AngularJS 9.

## Most Wanted
This page has an interactive map of the game space and also tables with high priority targets. Click on one to view the portal on the map.

## Neighborhood Watch
Draw an arbitrary polygon on the map and the charts below will show you gameplay statistics calculated over the area you've selected.

# Local development
backend/run.sh starts the Flask server, ng serve starts the FE server.

# Build and CD
make produces a file backend/ngxinger.pex , which is a self-contained executable with all of the dependencies.

# Running
You can run ngxinger.pex as you would with gunicorn, e.g. ./ngxinger.pex ngxinger:app -k gthread -w 1 --threads 10
