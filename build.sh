#!/usr/bin/env bash

NODE_VERSION=${1:-"16"}
LATEST=${2:-"0"}
HOTSTAQ_VERSION=${3:-$(cat ./package.json | jq -r .version)}

FULL_NAME="ourfreelight/hotstaq"

# Build the debian slim images first
TAG="$HOTSTAQ_VERSION-debian-slim-node$NODE_VERSION"

# Tag ex: hotstaq:0.6.31-debian-slim-node16
docker build -t ${FULL_NAME}:${TAG} --build-arg="NODE_VERSION=$NODE_VERSION" --build-arg="HOTSTAQ_VERSION=$HOTSTAQ_VERSION" -f ./docker/amd64_debian.dockerfile .
docker tag ${FULL_NAME}:${TAG} ${FULL_NAME}:${HOTSTAQ_VERSION}-node${NODE_VERSION} # ex: hotstaq:0.6.31-node16
docker tag ${FULL_NAME}:${TAG} ${FULL_NAME}:${HOTSTAQ_VERSION} # ex: hotstaq:0.6.31

if [ "$LATEST" == "1" ]; then
    docker tag ${FULL_NAME}:${TAG} ${FULL_NAME}:latest; # ex: hotstaq:latest
fi