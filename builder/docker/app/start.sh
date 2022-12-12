#!/bin/sh

# Start the application
node ${NODEJS_START_ARGS} $(pwd)/build/cli.js run ${HOT_RUN_ARGS}\
    --hotsite $(pwd)/HotSite.json --server-type ${SERVER_TYPE} \
    --log-level ${LOG_LEVEL} --web-base-url "${BASE_URL}" \
    --web-http-port ${HTTP_PORT} --web-https-port ${HTTPS_PORT} \
    --web-route "/=$(pwd)/public"