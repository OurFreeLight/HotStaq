@echo off

set NAMESPACE="${NAMESPACE}"
set HOTSITE_NAME="${HOTSITE_NAME}"

set WEB_IMAGE=%NAMESPACE%/%HOTSITE_NAME%

docker rm -f %HOTSITE_NAME%

docker run --name %HOTSITE_NAME% -d -p ${HTTP_PORT}:${HTTP_PORT} -p 9229:9229 -e SERVER_TYPE=web-api %WEB_IMAGE%:latest