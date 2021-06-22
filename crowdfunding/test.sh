#!/bin/sh -xe
../../../reach-lang/reach compile

sed -e '56s/ &default-app//' -e '35s/:/: \&default-app/' docker-compose.algo.yml > docker-compose.eth.yml
mv docker-compose.eth.yml docker-compose.yml

make build
make run-fundraiser | sed 's/\r//g' | tee funder.txt
export contract=$(grep "contract info" funder.txt | awk -F 'is ' '{print $2}')
export amount=4
for i in $(seq 1 5) ; do
  (sleep "${i}"; make run-contributor-auto) &
done
wait
