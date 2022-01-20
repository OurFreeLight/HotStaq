@echo off

set HOTSITE_NAME="${HOTSITE_NAME}"

docker rm -f %HOTSITE_NAME%

docker run --name %HOTSITE_NAME% -d -p ${HTTP_PORT}:${HTTP_PORT} -p 9229:9229 %HOTSITE_NAME%:latest