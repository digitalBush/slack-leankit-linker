#!/usr/bin/env sh
set -ex

apk upgrade
apk update

apk --no-cache add tini

rm -rf /tmp/*
