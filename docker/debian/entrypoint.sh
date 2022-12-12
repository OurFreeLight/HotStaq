#!/usr/bin/env bash

API_PORTS=""

if [ "$SERVER_TYPE" == "api" ]; then
    API_PORTS="--api-http-port ${API_HTTP_PORT} --api-https-port ${API_HTTPS_PORT}";
fi

node ${NODEJS_START_ARGS} /usr/lib/node_modules/hotstaq/build/src/index.js run ${HOTSTAQ_RUN_ARGS} \
    --hotsite $(pwd)/HotSite.json \
    --server-type ${SERVER_TYPE} \
    --web-base-url "${WEB_BASE_URL}" \
    --web-http-port ${WEB_HTTP_PORT} --web-https-port "${WEB_HTTPS_PORT}" \
    ${API_PORTS} \
    --web-route "${WEB_ROUTE}"