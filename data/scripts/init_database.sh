#!/bin/bash

set -e

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)

echo -n "Database user: " && read DB_SUPERUSER_NAME
echo -n "Database password: " && read -s DB_SUPERUSER_PASSWORD && echo

function get_config_value ()
{
    local __path=$1
    local __resultvar=$2
    local __value=$(cat /etc/darwin/config.yml | shyaml get-value ${__path})
    eval $__resultvar="'$__value'"
}

get_config_value 'db_connections.main.host'      DB_HOST
get_config_value 'db_connections.main.port'      DB_PORT
get_config_value 'db_connections.main.database'  DB_NAME
get_config_value 'db_connections.main.user'      DB_USER
get_config_value 'db_connections.main.password'  DB_PASSWORD

export PGUSER=${DB_SUPERUSER_NAME}
export PGPASSWORD=${DB_SUPERUSER_PASSWORD}
export PGHOST=${DB_HOST}
export PGPORT=${DB_PORT}

psql -tqc "UPDATE pg_database SET datallowconn='false' WHERE datname='${DB_NAME}'"
psql -tqc "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${DB_NAME}'"

dropdb --if-exists ${DB_NAME}

dropuser ${DB_USER} || true

dropuser darwin_user || true
dropuser darwin_backend_user || true

createuser --no-adduser --no-createdb --no-login darwin_user
createuser --no-adduser --no-createdb --no-login --inherit --role=darwin_user darwin_backend_user

createuser --no-adduser --no-createdb --inherit --role=darwin_backend_user ${DB_USER}
psql -tqc "ALTER USER ${DB_USER} PASSWORD '${DB_PASSWORD}'"

createdb --encoding=UNICODE --owner=darwin_user -T template0 ${DB_NAME}

psql -d ${DB_NAME} -c 'CREATE EXTENSION "postgis"'
psql -d ${DB_NAME} -c 'CREATE EXTENSION "pgcrypto"'
psql -d ${DB_NAME} -c 'CREATE EXTENSION "uuid-ossp"'

unset PGUSER PGPASSWORD PGHOST