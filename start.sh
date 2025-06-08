#!/usr/bin/env bash

if [ ! -f "./.env" ]; then
    echo "Missing .env file! Did you copy env-skeleton to .env?"

    exit 1
fi

docker compose --env-file ./.env up -d

sleep 5