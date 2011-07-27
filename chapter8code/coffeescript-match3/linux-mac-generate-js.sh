#!/bin/sh

rm -rf gen-js/*.js
coffee -o gen-js/ -c coffee/*.coffee 
