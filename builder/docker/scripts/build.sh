#!/usr/bin/env sh

if [ ! -f "./.env" ]; then
    echo "Missing .env file! Did you copy env-skeleton to .env?"

    exit 1
fi

export $(cat .env | xargs)

VERSION="$(cat ./package.json | jq -r .version)"

docker build -t $WEB_IMAGE:$WEB_IMAGE_VERSION --build-arg HOTSTAQ_VERSION=$HOTSTAQ_VERSION -f ./docker/$HOTSITE_NAME/Dockerfile .

if [ ! -x "$(command -v docker-slim)" ]; then
  echo "This build script will automatically use docker slim. It's recommended to use docker-slim to compress your image and secure it further. You can install docker-slim from: https://github.com/slimtoolkit/slim";
  echo "Press enter to continue"
  read REPLY;
else
  docker-slim build \
      --compose-file ./docker-compose.yaml \
      --compose-env-file ./.env \
      $WEB_IMAGE:$WEB_IMAGE_VERSION
  docker tag $WEB_IMAGE.slim:latest $WEB_IMAGE:$WEB_IMAGE_VERSION 2>/dev/null
  docker tag $API_IMAGE.slim:latest $WEB_IMAGE:$WEB_IMAGE_VERSION 2>/dev/null
  docker-compose -f ./docker-compose.yaml down 2>/dev/null;
fi

if docker --help | grep -q scan; then
  docker scan $WEB_IMAGE:$WEB_IMAGE_VERSION;
else
  echo 'This build script will automatically scan the built image using synk found in "docker scan". Its recommended to use docker scan find any additional vulnerabilities and secure it further. On Ubuntu you can install the docker scan plugin from: sudo apt install docker-scan-plugin';
  echo "Press enter to continue"
  read REPLY;
fi

docker tag $WEB_IMAGE:$WEB_IMAGE_VERSION $WEB_IMAGE:latest

docker tag $WEB_IMAGE:$WEB_IMAGE_VERSION $API_IMAGE:$API_IMAGE_VERSION
docker tag $API_IMAGE:$API_IMAGE_VERSION $API_IMAGE:latest