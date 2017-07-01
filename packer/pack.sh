#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)
OUT_DIR=${SCRIPT_DIR}/out
PAYLOAD_PATH=${OUT_DIR}/payload.tar

TAR_OPT="-hrv"
SOURCE_DIR=$(cd "${SCRIPT_DIR}/.."; pwd)

# Recreate output directory
rm -rfv ${OUT_DIR}
mkdir -pv ${OUT_DIR}

# Go to the source dir
cd ${SOURCE_DIR}

export COPYFILE_DISABLE=true

# app
tar $TAR_OPT  \
  --exclude .idea \
  --exclude node_modules \
  --exclude NOTES.txt \
  -f ${PAYLOAD_PATH} app

# config
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} config

# data
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} data

# database
tar $TAR_OPT  \
  --exclude data \
  -f ${PAYLOAD_PATH} database

# facade
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} facade

# web
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} web

# attach-to-app.sh
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} attach-to-app.sh

# start-data.sh
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} start-data.sh

# docker-compose.yml
tar $TAR_OPT  \
  -f ${PAYLOAD_PATH} docker-compose.yml

# Compress the payload.tar
gzip --best --suffix .gz ${PAYLOAD_PATH}
PAYLOAD_PATH=${PAYLOAD_PATH}.gz

TIMESTAMP=$(TZ=Europe/Moscow stat -f "%Sm" -t "%Y-%m-%d-%H%M.%S" ${PAYLOAD_PATH})
echo "TIMESTAMP = ${TIMESTAMP}"
NEW_PATH=${OUT_DIR}/darwin-package-${TIMESTAMP}.tar.gz
mv ${PAYLOAD_PATH} ${NEW_PATH}
PAYLOAD_PATH=${NEW_PATH}