#!/bin/bash

echo "=== SERVERS ==="
cd servers

echo "=== RESTful Server ==="
cd rest
yarn test

echo "=== GraphQL Server ==="
cd ../graphql
yarn test
cd ..

echo "=== CLIENTS ==="
cd ../clients
./rtl-all.sh
cd ..

echo "=== All Done ==="

