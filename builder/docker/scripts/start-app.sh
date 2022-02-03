#!/usr/bin/env sh

NAMESPACE="${NAMESPACE}"
HOTSITE_NAME="${HOTSITE_NAME}"

WEB_IMAGE="$NAMESPACE/$HOTSITE_NAME"

docker rm -f $HOTSITE_NAME 2>/dev/null || true

docker run --name $HOTSITE_NAME -d -p ${HTTP_PORT}:${HTTP_PORT} -p 9229:9229 $WEB_IMAGE:latest