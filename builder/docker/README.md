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

## Container Environment Variables
These environment variables are specific to running containers.

* HOTSTAQ_VERSION
    * Description: The global version of HotStaq to install.
    * Type: string
    * Default:
* HOTSITE_NAME
    * Description: The name of the hotsite to use.
    * Type: string
    * Default:
* WEB_IMAGE
    * Description: The image name of the docker image to be built.
    * Type: string
    * Default:
* WEB_IMAGE_VERSION
    * Description: The image version of the docker image to be built.
    * Type: string
    * Default:
* API_IMAGE
    * Description: The image name of the docker image to be built.
    * Type: string
    * Default:
* API_IMAGE_VERSION
    * Description: The image version of the docker image to be built.
    * Type: string
    * Default:
* NODEJS_START_ARGS
    * Description: The start arguments to pass to NodeJS when starting the app. Hardened images do not have this option.
    * Type: string
    * Default:
* HOT_RUN_ARGS
    * Description: The start arguments to pass to HotStaq when starting the app.
    * Type: string
    * Default:
* LOG_LEVEL
    * Description: Set the logging level. Can be:
        * info
        * warning
        * error
        * verbose
        * all
        * none
    * Type: string
    * Default: all
* BASE_URL
    * Description: The base url to use for the web server.
    * Type: string
    * Default:
* BASE_API_URL
    * Description: The base url to use for the api server.
    * Type: string
    * Default:
* HTTP_PORT
    * Description: The web http port to listen on.
    * Type: number
    * Default: 5000
* HTTPS_PORT
    * Description: The web https port to listen on.
    * Type: number
    * Default: 443
* API_HTTP_PORT
    * Description: The api http port to listen on.
    * Type: number
    * Default: 
* API_HTTPS_PORT
    * Description: The api https port to listen on.
    * Type: number
    * Default: 