#!/usr/bin/env bash

if [ ! -f "./.env" ]; then
    echo ".env file missing"

    exit;
fi

source ./.env

docker compose --env-file ./.env up -d
