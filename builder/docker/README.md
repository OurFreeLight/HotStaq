## Docker Getting Started
To execute the container run:
```console
./start.sh
```

To stop it enter:
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
    * Default: 6000
* HTTPS_PORT
    * Description: The https port to listen on.
    * Type: number
    * Default: 443