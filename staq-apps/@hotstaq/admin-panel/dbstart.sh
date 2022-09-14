#!/usr/bin/env bash

RUN_DAEMON="-d"
MARIADB_DB_PORT=3320

RUN_DAEMON_OPT=$1

if [ "$RUN_DAEMON_OPT" == "no-daemon" ]; then
    RUN_DAEMON=""
fi

docker rm -f mariadb-staqapp-tests 2>/dev/null || true

docker run ${RUN_DAEMON} --name="mariadb-staqapp-tests" -p ${MARIADB_DB_PORT}:3306 -e MYSQL_ROOT_PASSWORD=cdO1KjwiC8ksOqCV1s0 -e MYSQL_DATABASE=staqapp -e MYSQL_USER=5NKVBAt7OrzrumQyQVs -e MYSQL_PASSWORD=1BBrZbKYRUM7oiMA5oY mariadb:10.6
