FROM python:3.11-alpine

WORKDIR /usr/src/app

COPY . .
RUN apk update && apk add gcc musl-dev libffi-dev
RUN pip install -r requirements.txt