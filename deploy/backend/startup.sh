#!/bin/sh
set -e

if [ ! -z "$DATA_PRELOAD" ] && [ "$DATA_PRELOAD" = "1" ]; then
    node ts-built/demo-db-preload.js
fi

node ts-built/index.js