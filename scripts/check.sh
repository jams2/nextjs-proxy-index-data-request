#!/usr/bin/env bash
# Request the data files for `/index` and `/` from a running `next start` server, and print the path
# that Proxy received and the page that served the request.
set -euo pipefail
SITE=${SITE:-http://localhost:3000}
BUILD=$(cat .next/BUILD_ID)

for asset in index/index.json index.json; do
    echo "== /_next/data/$BUILD/$asset"
    curl -s -o /dev/null -D - -H 'x-nextjs-data: 1' "$SITE/_next/data/$BUILD/$asset" \
        | grep -iE '^(HTTP|x-proxy-pathname|x-nextjs-matched-path)'
    echo
done
