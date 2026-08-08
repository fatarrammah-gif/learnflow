#!/bin/sh
# Replace __PORT__ placeholder with the actual PORT value Railway injects
sed -i "s/__PORT__/$PORT/g" /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'
