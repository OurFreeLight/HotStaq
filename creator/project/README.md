# ${APPNAME}
This application was bootstrapped with [HotStaq](https://www.github.com/OurFreeLight/HotStaq)

## Getting Started
Navigate to the project's directory then enter:
${BUILDSTEPS}
	npm run dev

This will launch the web server in development mode. Open a web browser and navigate to https://127.0.0.1:8080 to see the example page!

## Docker
To build the docker images navigate to the project's directory and enter:
```console
	hotstaq build
```

This will build the Dockerfile. After which you can navigate into your output directory and enter:
```console
	./build.sh
```