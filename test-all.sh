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

echo "=== set-state Client ==="
cd set-state
yarn ci-test
cd ..

echo "=== All Done ==="

