#!/usr/bin/env bash

VERSION=${1:-"latest"}

docker rm -f selenium-hotstaq-tests 2>/dev/null || true

docker run --name selenium-hotstaq-tests -d -p 4444:4444 -p 7900:7900 -e SE_NODE_MAX_SESSIONS=5 --shm-size="2g" selenium/standalone-chrome:$VERSION