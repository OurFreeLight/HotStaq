# HotStaq
Need something similar to PHP in Node.js? We got you barely covered then ;)

HotStaq is a server-side or client-side HTML preprocessor. In order to keep Node.js running efficiently, it's best to have HotStaq execute hott scripts client-side in the client's web browser. Unfortunately, ES6 is currently required in the client's web browser in order to execute. This of course will be fixed eventually, so Internet Explorer 11 will be able to execute as well. Gross, yes, I know.

It's important to keep the number of dependencies required for HotStaq down to a minimum, so as it can be used in secure environments.

HotStaq is capable of processing code server-side and client-side.

This project started off originally as just a simple HTML preprocessor, but has grown into something much much more.

[Hott Reference](./docs/modules/hot.md)

[Server Reference](./docs/modules.md)

## Getting started
First you gotta install like so:
```console
npm -g install hotstaq
```

Now you can create your project by entering:
```console
hotstaq create app
```



Then you can create your first hott script! Create a file called ```HelloWorld.hott```, inside it, enter your HTML:

	<!DOCTYPE html>
	<html>

	<head>
		<title>Hello World Page</title>
	</head>
	
	<body>
	<*
		Hot.echo ("Hello");
	*>
	<*
		Hot.echo ("World!");
	*>
	</body>
	
	</html>

Save the file as index.hott, then start serving the current directory by using:

	import { HotHTTPServer } from "hotstaq";

	HotHTTPServer.startServer ();

## Web browser processing example
When used in a browser, HotStaq is meant to replace the entire page it's on, and continue to control the navigation of the pages. To use it, create a new HTML file and enter:

	<!DOCTYPE html>
	<html>

	<head>
		<title>Page</title>

		<script type = "text/javascript" src = "./HotStaq.js"></script>

		<script type = "text/javascript">
			var HotStaq = HotStaqWeb.HotStaq;
			HotStaq.displayUrl ("./HelloWorld.hott");
		</script>
	</head>

	<body>
	</body>

	</html>

You can find a pre-built ```HotStaq.js``` in ```node_modules/hotstaq/build-web/HotStaq.js```

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
npm -g install typescript webpack-cli typedoc
```

To run browser tests, you'll need to have the correct version of [chromedriver](https://chromedriver.chromium.org/) installed for the version of Chrome you are running on your machine.

## Possible Future Compiler
I'd like to create a CLI tool that compresses the entire public html directory into a zip file which can be downloaded and unzipped during runtime by the client's web browser then display the pages. During the compilation phase it would look for vulnerabilities and report them; for example when embedding JS files, if integrity hashes are missing, it would complain.