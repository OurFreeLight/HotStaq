#!/usr/bin/env bash

VERSION="3"

docker rm -f selenium-hotstaq-tests 2>/dev/null || true

docker run --name selenium-hotstaq-tests -d -p 4444:4444 --shm-size="2g" selenium/standalone-chrome:$VERSION