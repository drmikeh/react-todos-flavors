#!/bin/bash

declare -a clients=(
    "set-state"
    "unstated"
    "hooks"
    "hooks-crud-hook"
    "hooks-crud-hook-fade"
    "redux"
#    "mobx"
#    "mobx-decorators"
)

for client in "${clients[@]}"
do
  echo "=== Starting RTL Integration Tests for ${client} ==="
  cd "${client}"
  yarn ci-test
  echo "=== Completed RTL Integration Tests for ${client} ==="
  cd ..
done
