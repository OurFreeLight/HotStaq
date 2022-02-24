#!/bin/sh

# Start the application
node ${NODEJS_START_ARGS} $(pwd)/node_modules/hotstaq/bin/hotstaq run ${HOT_RUN_ARGS}\
    --hotsite $(pwd)/HotSite.json --server-type ${SERVER_TYPE} \
    --web-base-url "${BASE_URL}" \
    --web-http-port ${HTTP_PORT} --web-https-port ${HTTPS_PORT} \
    --web-route "/=$(pwd)/public"