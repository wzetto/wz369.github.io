#!/bin/bash
# source /home/wz/anaconda3/bin/python3
cd /media/wz/a7ee6d50-691d-431a-8efb-b93adc04896d/Github/wz369.github.io/images/yuyake
git pull
/home/wz/anaconda3/bin/python3 setime_cap.py
d=`date "+%F"`
echo $d
git add now.png
git commit -m $d
git push