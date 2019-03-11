#!/bin/bash

declare -a clients=(
    "set-state"
    "unstated"
    "hooks"
    "hooks-crud-hook"
    "hooks-crud-hook-fade"
    "redux"
    "mobx"
    "mobx-decorators"
)

for client in "${clients[@]}"
do
  echo "=== Starting Cypress Tests for ${client} ==="
  cd "${client}"
  yarn cypress:cicd
  echo "=== Completed Cypress Tests for ${client} ==="
  open mochawesome-report/mochawesome.html
  cd ..
done
