#!/usr/bin/env sh

NAMESPACE="${NAMESPACE}"
HOTSITE_NAME="${HOTSITE_NAME}"
VERSION="$(cat ./package.json | jq -r .version)"

WEB_IMAGE="$NAMESPACE/$HOTSITE_NAME"
API_IMAGE="$NAMESPACE/$HOTSITE_NAME-api"

docker build -t $WEB_IMAGE:$VERSION -f ./docker/$HOTSITE_NAME/Dockerfile .
docker tag $WEB_IMAGE:$VERSION $WEB_IMAGE:latest

docker tag $WEB_IMAGE:$VERSION $API_IMAGE:$VERSION
docker tag $API_IMAGE:$VERSION $API_IMAGE:latest