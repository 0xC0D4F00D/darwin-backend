#!/bin/bash

set -e

function get_config_value ()
{
    local __path=$1
    local __resultvar=$2
    local __value=$(cat '/etc/darwin/config.yml' | shyaml get-value ${__path})
    eval $__resultvar="'$__value'"
}

# Read configuration
get_config_value 'db_connections.main.host'      DB_HOST
get_config_value 'db_connections.main.port'      DB_PORT
get_config_value 'db_connections.main.database'  DB_NAME

# Make corrections in /epelan/flyway.conf
sed -i -e "s/db_host_to_replace/$DB_HOST/g;" \
       -e "s/db_port_to_replace/$DB_PORT/g;" \
       -e "s/db_name_to_replace/$DB_NAME/g;" \
       "/darwin/flyway.conf"

# Run the passed in command
exec "$@"