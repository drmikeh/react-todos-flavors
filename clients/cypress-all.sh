#!/bin/bash

declare -a clients=(
    "set-state"
    "unstated"
    "hooks"
    "hooks-crud-hook"
    "hooks-crud-hook-fade"
    "redux",
    "mobx",
    "mobx-decorators"
)

for client in "${clients[@]}"
do
  echo "=== ${client} ==="
  cd "${client}"
  yarn cypress:cicd
  cd ..
done

