#!/bin/sh
python manage.py migrate
daphne starshipbattle.asgi:application --bind 0.0.0.0 -p 8000
