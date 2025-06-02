#!/usr/bin/env bash

cd /app/

APP_EXEC="node ./build/cli.js"

if [ "$HARDENED_IMAGE" == "1" ]; then
  echo "Running in production..."
  APP_EXEC="./hotapp";
else
  echo "Running in dev..."
fi

# Start the application
exec $APP_EXEC healthcheck $@