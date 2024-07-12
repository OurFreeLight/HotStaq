# ${APPNAME}
This application was bootstrapped with [HotStaq](https://www.github.com/OurFreeLight/HotStaq)

## Requirements
* NodeJS 20.x

## Getting Started
Navigate to the project's directory then enter:
${BUILDSTEPS}
	npm run dev

This will launch the web server in development mode. Open a web browser and navigate to https://127.0.0.1:5000 to see the example page!

## Docker
To generate Dockerfiles that will build images for deployment, navigate to the project's directory and enter:
```console
npx hotstaq build
```

This will build the Dockerfiles. After which you can navigate into your output directory and enter:
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

You can configure how HotStaq starts by using the following environment variables:
* DATABASE_TYPE
	* Type: string
	* Description: The type of database to use.
	* Accepted values:
		* mysql
		* influx
* DATABASE_DISABLE
	* Type: number
	* Description: If set to 0, the database will not be used.
	* Accepted values:
		* 0
		* 1
* DATABASE_SERVER
	* Type: string
	* Description: The url to the database server to connect to.
	* Accepted values:
		* MySql example: 127.0.0.1
		* Influx example: http://127.0.0.1:8086
* DATABASE_PORT
	* Type: number
	* Description: The database port to use.
	* Accepted values:
		* Any integer.
* DATABASE_USERNAME
	* Type: string
	* Description: The database username to use.
	* Accepted values:
		* Any string.
* DATABASE_PASSWORD
	* Type: string
	* Description: The database password to use.
	* Accepted values:
		* Any string.
* DATABASE_ORG
	* Type: string
	* Description: The organization that contains the database. For Influx use.
	* Accepted values:
		* Any string.
* DATABASE_TOKEN
	* Type: string
	* Description: The database token to use. For Influx use.
	* Accepted values:
		* Any string.
* DATABASE_SCHEMA
	* Type: string
	* Description: The database schema (or bucket) to use.
	* Accepted values:
		* Any string.
* DATABASE_CONNECTIONS_LIMIT
	* Type: number
	* Description: The max number of database connections to maintain.
	* Default: 10
	* Accepted values:
		* Any integer.
* JSON_LIMIT
	* Type: string
	* Description: The maximum amount of JSON that can be uploaded.
	* Default: 1mb
	* Accepted values:
		* Any string.
* LOGGING_LEVEL
	* Type: string
	* Description: The logging level to use.
	* Accepted values:
		* info
		* warning
		* error
		* verbose
		* all
		* none

## HotStaq Development Specific Environment Variables
The following environment variables are only used during development and testing of HotStaq. These are not meant to be used for HotStaq applications:
* SELENIUM_REMOTE_SERVER
	* Type: string
	* Description: The remote selenium server to do web browser tests with. This will also ensure that the server is being used headless.
	* Example: http://localhost:4444
	* Accepted values:
		* Any valid url.
* SELENIUM_WINDOW_WIDTH
	* Type: number
	* Description: The width of the new browser window.
	* Accepted values:
		* Any integer.
* SELENIUM_WINDOW_HEIGHT
	* Type: number
	* Description: The height of the new browser window.
	* Accepted values:
		* Any integer.
* TESTING_DEVTOOLS
	* Type: number
	* Description: Set to 1 if you want chrome to open the dev tools as browser tests start. This is only for testing.
	* Accepted values:
		* 0
		* 1
* TESTING_REMOTE_SERVER
	* Type: string
	* Description: The remote server to use during browser tests.
	* Accepted values:
		* Any valid url.
* TESTING_RUN_HEADLESS
	* Type: string
	* Description: If set to any value, the launched chrome browser will run headless.
	* Accepted values:
		* Any