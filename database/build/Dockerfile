FROM postgres:9.6.2

MAINTAINER Serge N. Markin <serge@geoicon.com>

RUN apt-get update \
    && apt-get install --no-install-recommends -y postgresql-9.6-postgis-2.3 postgresql-9.6-postgis-2.3-scripts \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*