@echo off

if not exist ".\.env" (
    echo "Missing .env file! Did you copy env-skeleton to .env?"

    Exit /B 1
)

docker compose --env-file ./.env up -d