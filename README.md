# HotStaq
<p align = "center">
	<img src = "https://www.hotstaq.com/img/hotstaq-logo.png" />
</p>

[![CircleCI](https://circleci.com/gh/OurFreeLight/HotStaq.svg?style=shield)](https://app.circleci.com/pipelines/github/OurFreeLight/HotStaq)

HotStaq is a powerful frontend and backend web framework designed to streamline and secure web development for developers and small teams. With seamless integration with Docker and Kubernetes, HotStaq enables efficient development, testing, and deployment of modern web applications while focusing on quality and security throughout the entire application lifecycle.

## Key Features
* Familiar development experience for both the frontend and backend
* Embedded test cases for enhanced security and maintainability of your app
* Automatic generation of HTTP API documentation (using OpenAPI 3.0.0)
* Seamless integration with Docker and Kubernetes for easy deployment
* Optimized for startups and small development teams

For more information, please visit: [HotStaq](https://hotstaq.com)

Give HotStaq a try and simplify your web development process while maintaining a strong focus on ease of development, security, and quality.

Happy coding!

## Getting started
Prerequisites:
* NodeJS 12.x.x or higher.

Create your first project named `my-app` by entering:
```console
npx hotstaq create my-app
```

Navigate into the newly created `my-app` directory, and run the development web server:
```console
cd my-app
npm start
```

Your site starts at `http://localhost:5000`. Open a web browser to that location, and you can see the welcome page.

In your `my-app` directory, open `public/index.hott` and change your landing page. Refresh your browser to see your changes immediately.

That's it!

## Documentation
Detailed documentation can be found in the docs folder or at [HotStaq.com](https://hotstaq.com).

## Environment Variables
You can configure how HotStaq starts by using the following environment variables:
* DATABASE_TYPE
	* Type: string
	* Description: The type of database to use.
	* Accepted values:
		* mysql
		* influx
		* postgres
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
		* Postgres example: 127.0.0.1
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
* RATE_LIMITER_REDIS_HOST
	* Type: string
	* Description: The Redis host to use for the rate limiter.
	* Accepted values:
* RATE_LIMITER_REDIS_PORT
	* Type: string
	* Description: The Redis port to use for the rate limiter.
	* Accepted values:
		* Any string.
* RATE_LIMITER_REDIS_USERNAME
	* Type: string
	* Description: The Redis username to use for the rate limiter.
	* Accepted values:
		* Any string.
* RATE_LIMITER_REDIS_PASSWORD
	* Type: string
	* Description: The Redis password to use for the rate limiter.
	* Accepted values:
		* Any string.

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

## License
HotStaq is released under the MIT License.

## Support & Community
Join our community on [Discord](https://discord.gg/KwKc4QNczd) to stay updated, ask questions, and engage with other developers.

## Contributing
We welcome contributions to the HotStaq project! Please review our CONTRIBUTING.md file for guidelines on how to contribute.

To get started developing you'll need to install:
```console
npm -g install typescript webpack-cli typedoc
```

To run browser tests, you'll need to have the correct version of [chromedriver](https://chromedriver.chromium.org/) installed for the version of Chrome you are running on your machine.

Alternatively, you can use `./start-dev.sh` to start a local selenium grid that will run tests for you. The issue is it's hard to debug any frontend issues as the Chrome tests are executed inside of a container.

## Running database tests
Make sure you have Docker installed, then do:
```console
./start-dev.sh
```

This will launch the temporary MariaDB and InfluxDB databases.

After testing/debugging you can stop them by entering:
```console
./stop-dev.sh
```

## Possible Future Compiler
I'd like to create a CLI tool that compresses the entire public html directory into a zip file which can be downloaded and unzipped during runtime by the client's web browser then display the pages. During the compilation phase it would look for vulnerabilities and report them; for example when embedding JS files, if integrity hashes are missing, it would complain.
