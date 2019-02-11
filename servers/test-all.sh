#!/bin/bash

cd rest
yarn test
cd ../graphql
yarn test
cd ..
