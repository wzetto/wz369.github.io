#!/bin/bash
cd /media/wz/a7ee6d50-691d-431a-8efb-b93adc04896d/Github/wz369.github.io/images/yuyake
git pull
d=`date "+%F"`
echo $d
git add outside.gif
git commit -m $d
git push