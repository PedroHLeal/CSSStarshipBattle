FROM python:3.11-alpine

WORKDIR /usr/src/app

COPY . .
RUN apk update
RUN apk add gcc musl-dev libffi-dev 
RUN apk add libpq-dev
RUN apk add python3-dev
RUN pip install -r requirements.txt

RUN chmod 777 ./serve.sh