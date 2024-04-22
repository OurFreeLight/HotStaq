# ${APPNAME}
This application was bootstrapped with [HotStaq](https://www.github.com/OurFreeLight/HotStaq)

## Getting Started
Navigate to the project's directory then enter:
${BUILDSTEPS}
	npm run dev

This will launch the web server in development mode. Open a web browser and navigate to https://127.0.0.1:5000 to see the example page!

## Docker
To build the docker images navigate to the project's directory and enter:
```console
hotstaq build
```

This will build the Dockerfile. After which you can navigate into your output directory and enter:
```console
./build.sh
```

To start the docker image, run:
```console
./start-app.sh
```

## API Generation
To generate a web client for use on a website enter:
```console
npm run build-web
```

To generate the OpenAPI 3.0.0 YAML documentation enter:
```console
npm run build-doc
```

## Environment Variables
HotStaq can be configured in a variety of ways, and as such has a lot of environment variables that can be used.

## Server Environment Variables
* LOGGING_LEVEL
    * Description: Set the logging level. Can be:
        * info
        * warning
        * error
        * verbose
        * all
        * none
    * Type: string
    * Default: all
* SERVER_TYPE
    * Description: The type of server to start. Can be:
        * web
        * api
        * web-api
    * Type: string
    * Default: web-api
* USE_HTTP
    * Description: Forces the use of HTTP.
    * Type: string
    * Default: 1
* HTTP_PORT
    * Description: The http port to listen on.
    * Type: number
    * Default: 5000
* HTTPS_PORT
    * Description: The https port to listen on.
    * Type: number
    * Default: 
* HTTPS_SSL_CERT
    * Description: Sets the path to the TLS certificate to use when using HTTPS_PORT.
    * Type: string
    * Default: 
* HTTPS_SSL_KEY
    * Description: Sets the path to the TLS private key to use when using HTTPS_PORT.
    * Type: string
    * Default: 
* HTTPS_SSL_CA
    * Description: Sets the path to the TLS CA key to use when using HTTPS_PORT.
    * Type: string
    * Default: 
* LISTEN_ADDR
    * Description: The listen address to use.
    * Type: string
    * Default: 0.0.0.0
* JSON_LIMIT
    * Description: Sets the max JSON limit. Uses the npm bytes library for parsing.
    * Type: string
    * Default: 1mb
* TEMP_UPLOAD_DIR
    * Description: Sets the path to the temporary upload directory to use when a file is uploaded.
    * Type: string
    * Default: ./temp/
* TEMP_UPLOAD_DIR
    * Description: Sets the path to the temporary upload directory to use when a file is uploaded.
    * Type: string
    * Default: ./temp/

## Database Environment Variables
* DATABASE_DISABLE
    * Description: If set to 1, no database connection will be initiated.
    * Type: string
    * Default: 0
* DATABASE_TYPE
    * Description: The type of database to connect to. Can be:
		* none
		* mysql
		* influx
    * Type: mysql
    * Default: none
* DATABASE_SERVER
    * Description: The database server address to connect to.
    * Type: string
    * Default: 
* DATABASE_PORT
    * Description: The database port to use to connect to the server.
    * Type: string
    * Default: 
* DATABASE_USERNAME
    * Description: The database username to use to connect to the server.
    * Type: string
    * Default: 
* DATABASE_PASSWORD
    * Description: The database password to use to connect to the server.
    * Type: string
    * Default: 
* DATABASE_ORG
    * Description: The database org to use to connect to the server.
    * Type: string
    * Default: 
* DATABASE_TOKEN
    * Description: The database token to use to connect to the server.
    * Type: string
    * Default: 
* DATABASE_SCHEMA
    * Description: The database schema to use.
    * Type: string
    * Default: 
* DATABASE_CONNECTIONS_LIMIT
    * Description: The database schema to use.
    * Type: number
    * Default: 10

## Testing Environment Variables
* SELENIUM_REMOTE_SERVER
    * Description: The remote selenium server to connect to.
    * Type: string
    * Default: 
* SELENIUM_WINDOW_WIDTH
    * Description: The window width to use.
    * Type: string
    * Default: 
* SELENIUM_WINDOW_HEIGHT
    * Description: The window height to use.
    * Type: string
    * Default: 
* USER_DATA_DIR
    * Description: The data directory to use for the selected web browser.
    * Type: string
    * Default: 
* TESTING_DEVTOOLS
    * Description: When the web browser starts, the dev tools will open automatically.
    * Type: number
    * Default: 0
* TESTING_REMOTE_SERVER
* TESTING_RUN_HEADLESS
    * Description: Configures testing for a remote server.
    * Type: string
    * Default: 0
* TESTER_LISTEN_ADDR
    * Description: The listen address to use for testers.
    * Type: string
    * Default: 0.0.0.0
* TESTER_USE_HTTP
    * Description: Forces the use of HTTP for testers.
    * Type: string
    * Default: 1
* TESTER_HTTP_PORT
    * Description: The http port to listen on for testers.
    * Type: number
    * Default: 5000
* TESTER_HTTPS_PORT
    * Description: The https port to listen on for testers.
    * Type: number
    * Default: 