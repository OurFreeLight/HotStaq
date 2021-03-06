@echo off

set NAMESPACE="${NAMESPACE}"
set HOTSITE_NAME="${HOTSITE_NAME}"
set VERSION="1.0.0"

set WEB_IMAGE=%NAMESPACE%/%HOTSITE_NAME%
set API_IMAGE=%NAMESPACE%/%HOTSITE_NAME%-api

docker build -t %WEB_IMAGE%:%VERSION% -f ./docker/%HOTSITE_NAME%/Dockerfile .
docker tag %WEB_IMAGE%:%VERSION% %WEB_IMAGE%:latest

docker tag %WEB_IMAGE%:%VERSION% %API_IMAGE%:%VERSION%
docker tag %API_IMAGE%:%VERSION% %API_IMAGE%:latest