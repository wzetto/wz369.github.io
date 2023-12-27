import cv2
import datetime
import time

path_save = '/media/wz/a7ee6d50-691d-431a-8efb-b93adc04896d/Github/wz369.github.io/images/yuyake/now.png'
cap = cv2.VideoCapture(-1)
flag = cap.isOpened()
for i in range(10):
    time.sleep(1)
    ret, frame = cap.read()
cv2.imwrite(path_save, frame)
cap.release()
