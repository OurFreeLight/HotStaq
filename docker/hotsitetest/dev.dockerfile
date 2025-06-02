FROM node:20-bullseye AS builder

ARG HOTSTAQ_VERSION

# Install build dependencies
RUN apt update && apt upgrade -y && \
	apt install -y git && \
	npm install -g typescript@4.9.4 hotstaq@${HOTSTAQ_VERSION} && \
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

FROM node:20-bullseye-slim

RUN apt update && apt upgrade -y

RUN mkdir -p /app/build/

COPY --from=builder /tmp/app/build/ /app/build/
COPY --from=builder /tmp/app/public/ /app/public/
COPY --from=builder /tmp/app/node_modules/ /app/node_modules/
COPY --from=builder /tmp/app/HotSite.json /app/HotSite.json
COPY --from=builder /tmp/app/package.json /app/package.json
COPY --from=builder /tmp/app/package-lock.json /app/package-lock.json
COPY ./docker/hotsitetest/app/start.sh /app/docker/hotsitetest/app/start.sh
COPY ./docker/hotsitetest/app/healthcheck.sh /app/docker/hotsitetest/app/healthcheck.sh

RUN chmod 500 /app/docker/hotsitetest/app/*.sh

RUN npm install -g hotstaq@${HOTSTAQ_VERSION}

ARG HTTP_PORT=5000
	ENV HTTP_PORT=${HTTP_PORT}
	EXPOSE ${HTTP_PORT}

ARG NODEJS_START_ARGS=""
ENV NODEJS_START_ARGS=${NODEJS_START_ARGS}

ARG HOT_RUN_ARGS=""
ENV HOT_RUN_ARGS=${HOT_RUN_ARGS}

ARG SERVER_TYPE="web-api"
ENV SERVER_TYPE=${SERVER_TYPE}

ARG LOG_LEVEL="all"
ENV LOG_LEVEL=${LOG_LEVEL}

ENV HOTSITE_PATH=/app/HotSite.json

ENV HARDENED_IMAGE=0

WORKDIR /app
ENTRYPOINT [ "/app/docker/hotsitetest/app/start.sh" ]

