FROM debian:jessie

MAINTAINER Serge N. Markin <serge@geoicon.com>

ENV DEBIAN_FRONTEND=noninteractive

# Install apt-utils
RUN apt-get update && \
    apt-get install -y --no-install-recommends apt-utils && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Install flyway
RUN FLYWAY_VERSION="4.1.2" \
    FLYWAY_BUILD_DEPENDENCIES="curl" && \
    apt-get update && \
    apt-get install --no-install-recommends -y ${FLYWAY_BUILD_DEPENDENCIES} && \
    cd /opt && \
    curl -o flyway.tar.gz -k -s -SL "https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${FLYWAY_VERSION}/flyway-commandline-${FLYWAY_VERSION}-linux-x64.tar.gz" && \
    tar -xzf flyway.tar.gz && \
    ln -s /opt/flyway-${FLYWAY_VERSION}/flyway /usr/local/bin/flyway && \
    rm -rf flyway.tar.gz && \
    cd / && \
    apt-get clean && \
    apt-get remove -y ${FLYWAY_BUILD_DEPENDENCIES} && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Install shyaml
RUN apt-get update && \
    apt-get install --no-install-recommends -y python python-pip && \
    pip install shyaml && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Install psql
RUN apt-get update && \
    apt-get install --no-install-recommends -y postgresql-client && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Install requirements for legacy data loader
RUN apt-get update && \
    apt-get install --no-install-recommends -y build-essential python-dev libpq-dev && \
    pip install psycopg2 && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Install postgis to have shp2pgsql
RUN apt-get update && \
    apt-get install --no-install-recommends -y postgis && \
    apt-get clean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# TODO: Remove build essential
# TODO: Install python related packages as single step

RUN mkdir /darwin

COPY migrations /darwin/migrations
COPY flyway/flyway.conf /darwin/flyway.conf
COPY scripts /darwin/scripts

COPY entrypoint.sh /

WORKDIR /darwin

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/bin/true"]