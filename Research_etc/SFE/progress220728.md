---
title: 'Log 2022.07-'
---

2022.07.28
<hr style="width:50px;text-align:left;margin-left:0">
GSFE 有三种算法：

1. ab initio，即粗暴构建SQS。

2. NEB，即在几个中间态间插值，而中间态的计算为ab initio.
<h5>HOW TO?</h5>

\> Interpolating POSCARs of the initial and final configurations, after geometrical relaxation. Localize the new interpolated POSCAR
file into the main directory, along with excutable files, INCAR POTCAR KPOINTS, note that some extra parameters should be covered in INCAR file for NEB.

\> Transition states, e.g. usf, isf, utf configurations, could be settled as 'anchor points' during NEB calculation. Those additional
configurations should be stored into sub directory, indexed between the ini- and fin-structures. Calculation will be undergone
within main directory.

\> Potential energy surfaces will then be approximated during the calculation & interpolation process. Thus those saddle points and energy barriers, 'optimized' trajectory, could be
obtained from results.

3. EMTO-CPA，不太了解。计算量相对较小，因为不采用大体系晶胞，而是选择构建描述格子, e.g.八面体。

#### [< back](https://wzetto.github.io/wz369.github.io/Research_etc/SFE/SFE_home.html)
