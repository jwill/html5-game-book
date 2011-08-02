#!/bin/sh

rm -rf gen-js/*.js
coffee -c coffee/*.coffee -o gen-js/
