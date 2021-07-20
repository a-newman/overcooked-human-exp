#!/bin/bash

# export FLASK_ENV=development
export PORT=8000
export CERTPATH=""

cd server
python3 -u app.py
