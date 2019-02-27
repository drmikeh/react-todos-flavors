#!/bin/bash

echo "RESET"
http --print b DELETE localhost:3002/api/todos/reset

echo "INDEX"
http --print b GET localhost:3002/api/todos

echo "GET"
http --print b GET localhost:3002/api/todos/2

echo "CREATE"
http --print b POST localhost:3002/api/todos title="buy milk" completed:=true

echo "INDEX"
http --print b GET localhost:3002/api/todos

echo "UPDATE"
http --print b PUT localhost:3002/api/todos/4 title="buy ice-cream" completed:=true

echo "INDEX"
http --print b GET localhost:3002/api/todos
