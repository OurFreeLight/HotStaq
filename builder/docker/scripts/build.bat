@echo off

set NAMESPACE="${NAMESPACE}"
set HOTSITE_NAME="${HOTSITE_NAME}"
set VERSION="1.0.0"

docker build -t %NAMESPACE%/%HOTSITE_NAME%:%VERSION% -f ./docker/%HOTSITE_NAME%/Dockerfile .
docker tag %HOTSITE_NAME%:%VERSION% %HOTSITE_NAME%:latest

docker tag %HOTSITE_NAME%:%VERSION% %HOTSITE_NAME%-api:%VERSION%
docker tag %HOTSITE_NAME%-api:%VERSION% %HOTSITE_NAME%-api:latest