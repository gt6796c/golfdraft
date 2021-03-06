#!/bin/bash

cd ~/
source config.sh

date=`date +%Y%m%d%H%M%S`

logdir=/var/log/golfdraft
logfile="${logdir}/log.${date}.log"

cd golfdraft
git checkout master
git pull origin master
npm install
/usr/bin/node ./scores_sync/runUpdateScore.js > $logfile 2>&1

echo "DONE!"
