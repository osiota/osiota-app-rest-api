#!/bin/bash

curl -v http://localhost:8081/test
echo

curl -v -H "Content-Type: application/json" \
	-d '[1, 2, 3, 4]' \
	http://localhost:8081/test\?method=test
echo

curl -v http://localhost:8081/non
echo

curl -v -H "Content-Type: application/json" \
	-d '[1, 2, 3, 4]' \
	http://localhost:8081/test\?method=non
echo
