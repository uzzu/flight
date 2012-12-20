#!/bin/sh
# use jsdoc3(https://github.com/jsdoc3/jsdoc)
rm -rf .tmp
mkdir .tmp
mkdir .tmp/flight
cp -r lib/flight .tmp/
(
    cd .tmp/flight
    jsfl_files=`find ./ -name "*.jsfl"`
    for fname in $jsfl_files; do
        mv $fname $fname.js
    done
    jsdoc -r -d ../../docs/ ./
)
rm -rf .tmp
