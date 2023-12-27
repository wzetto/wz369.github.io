---
title: Low_temp_lift
---

2022.02
<中\|Eng><sub>α</sub><br>
<hr style="width:50px;text-align:left;margin-left:0">
液氮实验中稳定液面保持304钢温度恒定的小升降装置。

液面识别-步进电机升降（raspi, L298N）

<h2>Part 1. Intensity recog.</h2>
<hr style="width:50px;text-align:left;margin-left:0">
i.e.照射目标区域液面(暂时粗暴涂红）：<br>
<img src="https://drive.google.com/thumbnail?id=127VWd-vnxhi0wrtk5MzlzTWEZ6Duw1wo&sz=w400" />
<hr style="width:50px;text-align:left;margin-left:0">
卷积平滑识别纵intensity（理论上Savitzky-Golay平滑更准确，将就），将等时间间隔图像采样得到曲线统合，生成下图：<br>
<img src="https://drive.google.com/thumbnail?id=123ltWfCXoMR4Limj9G2Xa38_qvE0D3Cp&sz=w800" />
<hr style="width:50px;text-align:left;margin-left:0">
可见找到~~梭梭板~~就找到了液面。求出系统/测量(system/measurement)方差后试验kalman filter (linear):<br>
<img src="https://drive.google.com/thumbnail?id=121vf01r0jRDanZBCnN7obI5iYM669HaI&sz=w800" />
<hr style="width:50px;text-align:left;margin-left:0">
这块搞定。<br>
（这noise，能用就行.jpg<br>
（一个电池盖能拖十天才到。<br>
(一块板子又拖了十天？！

#### [< back](https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html)
