#!/usr/bin/env bash

API_PORTS=""

if [ "$SERVER_TYPE" == "api" ]; then
    API_PORTS="--api-http-port ${API_HTTP_PORT} --api-https-port ${API_HTTPS_PORT}";
fi

# Start the application
exec $(pwd)/hotapp run ${HOT_RUN_ARGS} \
    --hotsite $(pwd)/HotSite.json --server-type ${SERVER_TYPE} \
    --dont-load-apis-from-hotsite \
    --log-level ${LOG_LEVEL} --web-base-url "${BASE_URL}" \
    --web-http-port ${HTTP_PORT} --web-https-port ${HTTPS_PORT} \
    --api-base-url "${BASE_API_URL}" \
    ${API_PORTS} \
    --web-route "/=$(pwd)/public"