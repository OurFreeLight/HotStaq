## Docker Getting Started
Make sure to have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

First the docker image must be built. To do this, enter:
```console
./build.sh
```

Once the image has been built, you can execute the containers by running:
```console
./start.sh
```

To stop the container enter:
```console
./stop.sh
```

## Docker Environment Variables
* NODEJS_START_ARGS
    * Description: The start arguments to pass to NodeJS when starting the app.
    * Type: string
    * Default:
* HOT_RUN_ARGS
    * Description: The start arguments to pass to HotStaq when starting the app.
    * Type: string
    * Default:
* SERVER_TYPE
    * Description: The type of server to start. Can be:
        * web
        * api
        * web-api
    * Type: string
    * Default: web-api
* BASE_URL
    * Description: The base url to use for the web server.
    * Type: string
    * Default:
* HTTP_PORT
    * Description: The http port to listen on.
    * Type: number
    * Default: 5000
* HTTPS_PORT
    * Description: The https port to listen on.
    * Type: number
    * Default: 443