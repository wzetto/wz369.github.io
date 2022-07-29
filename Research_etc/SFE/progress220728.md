---
title: 'Log 2022.07-'
---

2022.07.28
<hr style="width:50px;text-align:left;margin-left:0">
GSFE 有三种算法：

1. ab initio，就是最简单粗暴的构建SQS。

2. NEB，就是在几个中间态间插值，而中间态的计算为ab initio.
<h5>HOW TO?</h5>

> Interpolating POSCARs for the initial and final configurations, after geometrical relaxation. Put the new interpolated POSCAR
file into main directory.

> Transition states, e.g. usf, isf, utf configurations, could be settled as 'anchor points' during NEB calculation. Those additional
configurations should be stored into sub directory, indexed between the ini- and fin-structures. Attention that calculation is undergone
within main directory.

> Potential energy surfaces will then be approximated during the calculation process. Thus saddle points and energy barrier could be
obtained from results.

3. EMTO-CPA，不太了解。计算量相对较小，因为不采用大体系晶胞，而是选择构建描述格子, e.g.八面体。

#### [< back](https://wzetto.github.io/wz369.github.io/Research_etc/SFE/SFE_home.html)
