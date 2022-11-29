#!/usr/bin/env bash

NODE_VERSION=${1:-"16"}
LATEST=${2:-"0"}
HOTSTAQ_VERSION=${3:-$(cat ./package.json | jq -r .version)}

FULL_NAME="hotstaq"

# Build the debian slim images first
TAG="$HOTSTAQ_VERSION-debian-slim-node$NODE_VERSION"

docker push ${FULL_NAME}:${TAG}
docker push ${FULL_NAME}:${HOTSTAQ_VERSION}-node${NODE_VERSION}
docker push ${FULL_NAME}:${HOTSTAQ_VERSION}

if [ "$LATEST" == "1" ]; then
    docker push ${FULL_NAME}:latest;
fi