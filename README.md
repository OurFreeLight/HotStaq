# HotStaq
HotStaq is a client-side HTML preprocessor, with a design similar to that of PHP. Tech stacks have grown in size significantly over the years, and it can be hard for small teams to efficiently utilize all the different tech stacks properly. HotStaq helps reduce the headache of maintaining all the various tech while ensuring the application's security and quality.

Developers can quickly create their frontend and backends securely while adding their unit tests along the way in code During development, HotStaq developers know they can generate Dockerfiles to easily deploy their application to Kubernetes or Docker Swarm.

For more information, please visit: [HotStaq](https://hotstaq.com)

## Getting started
First you gotta install like so:
```console
npm -g install hotstaq
```

Now you can create your project by entering:
```console
hotstaq create my-app
```

Run the development web server:

```console
cd my-app

hotstaq start
```

Your site starts at `http://localhost:8080`.

Open `public/index.hott` and change your landing page. Refresh your browser to see your changes immediately.

That's it!

## Running database tests
Make sure you have Docker installed, then do:
```console
./dbstart.sh
```

This will launch the temporary MariaDB and InfluxDB databases.

After testing/debugging you can stop them by entering:
```console
./dbstop.sh
```

## Environment Variables
You can configure how HotStaq starts by using:
* DATABASE_TYPE
	* Type: string
	* Description: The type of database to use.
	* Accepted values:
		* mysql
		* influx
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
* SELENIUM_REMOTE_SERVER
	* Type: string
	* Description: The remote selenium server to do web browser tests with.
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

## Developing
To get started developing you'll need to install:
```console
npm -g install typescript webpack-cli@4 typedoc
```

To run browser tests, you'll need to have the correct version of [chromedriver](https://chromedriver.chromium.org/) installed for the version of Chrome you are running on your machine.

## Possible Future Compiler
I'd like to create a CLI tool that compresses the entire public html directory into a zip file which can be downloaded and unzipped during runtime by the client's web browser then display the pages. During the compilation phase it would look for vulnerabilities and report them; for example when embedding JS files, if integrity hashes are missing, it would complain.
