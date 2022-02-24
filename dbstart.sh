#!/usr/bin/env bash

RUN_DAEMON="-d"
MARIADB_DB_PORT=3310
INFLUX_DB_PORT=8091

RUN_DAEMON_OPT=$1

if [ "$RUN_DAEMON_OPT" == "no-daemon" ]; then
    RUN_DAEMON=""
fi

docker rm -f mariadb-hotstaq-tests 2>/dev/null || true
docker rm -f influxdb-hotstaq-tests 2>/dev/null || true

docker run ${RUN_DAEMON} --name="mariadb-hotstaq-tests" -p ${MARIADB_DB_PORT}:3306 -e MYSQL_ROOT_PASSWORD=cdO1KjwiC8ksOqCV1s0 -e MYSQL_DATABASE=hotstaq -e MYSQL_USER=5NKVBAt7OrzrumQyQVs -e MYSQL_PASSWORD=1BBrZbKYRUM7oiMA5oY mariadb:10.6

docker run ${RUN_DAEMON} --name="influxdb-hotstaq-tests" -p ${INFLUX_DB_PORT}:8086 -e DOCKER_INFLUXDB_INIT_MODE=setup -e DOCKER_INFLUXDB_INIT_ORG=freelight -e DOCKER_INFLUXDB_INIT_BUCKET=hotstaq -e DOCKER_INFLUXDB_INIT_USERNAME=5NKVBAt7OrzrumQyQVs -e DOCKER_INFLUXDB_INIT_PASSWORD=1BBrZbKYRUM7oiMA5oY -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=Ife0HerzHrloa32PsE4yg4ixA6j7tZFSMRhvBg7akUK2e influxdb:2.0
sleep 5
