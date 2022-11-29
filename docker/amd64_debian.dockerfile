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
RUN mkdir /app && \
    hotstaq create --output /app app

WORKDIR "/app"

ENTRYPOINT [ "hotstaq", "start" ]