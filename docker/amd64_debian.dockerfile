FROM debian:bullseye-slim

ARG NODE_VERSION
ARG HOTSTAQ_VERSION

# Update components and install curl
RUN apt update && \
    apt install -y curl git

# Install NodeJS
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt install -y nodejs

# Build HotStaq
RUN npm install --global hotstaq@${HOTSTAQ_VERSION}

# Create example application
RUN mkdir /app

ENV SERVER_TYPE="web-api"
ENV WEB_HTTP_PORT="5000"
ENV WEB_HTTPS_PORT="443"
ENV API_HTTP_PORT="5001"
ENV API_HTTPS_PORT="444"
ENV WEB_ROUTE="/=\$(pwd)/public"
ENV WEB_BASE_URL="http://localhost:$WEB_HTTP_PORT"

COPY ./docker/debian/entrypoint.sh /entrypoint.sh

WORKDIR "/app"

ENTRYPOINT [ "/entrypoint.sh" ]