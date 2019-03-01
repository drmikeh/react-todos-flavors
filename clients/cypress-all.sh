#!/bin/bash

echo "=== set-state ==="
cd set-state
yarn cypress:cicd

echo "=== unstated ==="
cd ../unstated
yarn cypress:cicd

echo "=== hooks ==="
cd ../hooks
yarn cypress:cicd

echo "=== hooks-crud-hook ==="
cd ../hooks-crud-hook
yarn cypress:cicd

cd ..

