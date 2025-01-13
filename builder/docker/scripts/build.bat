@echo off

if not exist .\.env (
    echo Missing .env file! Did you copy env-skeleton to .env?
    exit /b 1
)

where jq >nul 2>nul || (
    echo jq is required to build. You can install it from: https://stedolan.github.io/jq/download/
    exit /b 1
)

set PROD=%1
if "%PROD%"=="" set PROD=1

for /f "usebackq delims=" %%i in (".env") do set %%i

set /p VERSION=< ./package.json
for /f "usebackq delims=" %%i in (`echo %VERSION% ^| jq -r .version`) do set VERSION=%%i

set DOCKERFILE=dev.dockerfile
if "%PROD%"=="1" set DOCKERFILE=prod.dockerfile

docker build -t %WEB_IMAGE%:%WEB_IMAGE_VERSION% --build-arg HOTSTAQ_VERSION=%HOTSTAQ_VERSION% -f .\docker\%HOTSITE_NAME%\%DOCKERFILE% .

if "%PROD%"=="1" (
    where docker-slim >nul 2>nul || (
        echo This build script will automatically use docker slim. It's recommended to use docker-slim to compress your image and secure it further. You can install docker-slim from: https://github.com/slimtoolkit/slim
        pause
    )

    docker-slim build ^
        --include-path-file /etc/os-release ^
        --include-path-file /usr/lib/os-release ^
        --include-path /app/public ^
        --compose-file .\docker-compose.yaml ^
        --compose-env-file .\.env ^
        %WEB_IMAGE%:%WEB_IMAGE_VERSION%

    docker tag %WEB_IMAGE%.slim:latest %WEB_IMAGE%:%WEB_IMAGE_VERSION% >nul 2>nul
    docker tag %API_IMAGE%.slim:latest %WEB_IMAGE%:%WEB_IMAGE_VERSION% >nul 2>nul
    docker compose -f .\docker-compose.yaml down >nul 2>nul

    docker --help | findstr /c:"scan" >nul && (
        docker scan %WEB_IMAGE%:%WEB_IMAGE_VERSION%
    ) || (
        echo This build script will automatically scan the built image using synk found in "docker scan". Its recommended to use docker scan find any additional vulnerabilities and secure it further. On Ubuntu you can install the docker scan plugin from: sudo apt install docker-scan-plugin
        pause
    )
)

docker tag %WEB_IMAGE%:%WEB_IMAGE_VERSION% %WEB_IMAGE%:latest

docker tag %WEB_IMAGE%:%WEB_IMAGE_VERSION% %API_IMAGE%:%API_IMAGE_VERSION%
docker tag %API_IMAGE%:%API_IMAGE_VERSION% %API_IMAGE%:latest

echo "Finished building web image %WEB_IMAGE%:%WEB_IMAGE_VERSION%"
echo "Finished building api image %API_IMAGE%:%API_IMAGE_VERSION%"