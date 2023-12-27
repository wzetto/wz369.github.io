---
filename: ssos
title: Efficient Ab initio Modeling of Random Multicomponent Alloys
layout: paper_default
papercomment: true
tags:
- mat/SQS
- mat/HEA
- journal/PRL
highlight: false
author: Jiang et al.
mainpoint: 一种基于SQS的随机构型生成方法，对低随机度的构型赋权达到与高随机度构型相同的物理量预测。
doi: 10.1103/PhysRevLett.116.105501
---

#### Method

文章的优化目标大概就是这个：

<p align="center">

$\sum_{\alpha}\sum_{s}(\sum_i w_i\bar{\Phi_{\alpha}}(\sigma_i^{SSOS})-<\bar{\Phi_{\alpha}}>_{SQS})^2 = min$

</p>

也许是简单粗暴而异常高效，虽完全没有证明过程（启发过程是标量物理量的加权和），但宛若接触古神前刹那收手的感觉。

<blockquote style="border-left:5px solid #0f0b85">Among all enumerated candidate sets, the best SSOS isthe one with the lowest periodicity error.</blockquote>

<br>


### [< BACK](https://wzetto.github.io/wz369.github.io/Research_etc/PaperCollect/main.html)