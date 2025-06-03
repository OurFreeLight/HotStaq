ARG NODEJS_VERSION="20"
FROM node:${NODEJS_VERSION}-bullseye AS builder

ARG HOTSTAQ_VERSION
ARG NODEJS_VERSION

# Install build dependencies
RUN apt update && apt upgrade -y && \
	apt install -y git && \
	npm install -g typescript@4.9.4 hotstaq@${HOTSTAQ_VERSION} pkg@5.8.0 && \
	mkdir -p /tmp/app

COPY ./tsconfig.json /tmp/app/tsconfig.json
COPY ./HotSite.json /tmp/app/HotSite.json
COPY ./package.json /tmp/app/package.json
COPY ./package-lock.json /tmp/app/package-lock.json

RUN cd /tmp/app && \
	npm install hotstaq@${HOTSTAQ_VERSION} && \
	npm ci

COPY ./src/ /tmp/app/src/
COPY ./public/ /tmp/app/public/

RUN cd /tmp/app && \
	npm run build && \
	npm run build-web

RUN cd /tmp/app && \
	pkg -c ./package.json -t node${NODEJS_VERSION}-linux-x64 -o ./build/hotapp ./build/pkg.js

FROM debian:bullseye-slim

COPY --from=builder /tmp/app/build/hotapp /app/hotapp
COPY --from=builder /tmp/app/public/ /app/public/
COPY --from=builder /tmp/app/HotSite.json /app/HotSite.json
COPY ./docker/hotsitetest/app/start-pkg.sh /app/docker/hotsitetest/app/start-pkg.sh
COPY ./docker/hotsitetest/app/healthcheck.sh /app/docker/hotsitetest/app/healthcheck.sh

RUN chmod 500 /app/docker/hotsitetest/app/*.sh

ARG HTTP_PORT=5000
	ENV HTTP_PORT=${HTTP_PORT}
	EXPOSE ${HTTP_PORT}

RUN apt clean autoclean && \
	apt autoremove -y && \
	rm -Rf /var/lib/{apt,dpkg,cache,log}/ && \
	rm -Rf /var/lib/apt/lists/*

ARG HOT_RUN_ARGS=""
ENV HOT_RUN_ARGS=${HOT_RUN_ARGS}

ARG SERVER_TYPE="web-api"
ENV SERVER_TYPE=${SERVER_TYPE}

ARG LOG_LEVEL="all"
ENV LOG_LEVEL=${LOG_LEVEL}

ENV HOTSITE_PATH=/app/HotSite.json

ENV HARDENED_IMAGE=1

WORKDIR /app
ENTRYPOINT [ "/app/docker/hotsitetest/app/start-pkg.sh" ]

