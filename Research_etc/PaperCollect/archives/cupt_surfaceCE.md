---
filename: cupt_surfaceCE
title: Ordering and segregtion of a Cu25Pt25 (111) surface -  A first-principles cluster expansion study
layout: paper_default
papercomment: true
tags:
- mat/CE
- mat/gamma-surface
- journal/PRB
highlight: false
author: K. Yuge et al
mainpoint: 对于随机度要求较低的二元长程有序构造，应用了比较系统的CE方法研究。对于层错能的经典CE应用可参考此篇。
doi: 10.1103/PhysRevB.76.045407
---

#### Method

- Canonical and **Grand-canonical** MC to study the effect of a finite temperature on the atomic configuration.

- Details for CE:
  - surface-ECI and bulk-ECI (which is applied to deep layers) are seperated in slab model.
  - ECIs could be used to construct the ground-state lines.
  - Implement CE-predict ground states into new DFT calculation.
  - Return ***optimal configuration sets.***

<br>
<img src="https://journals.aps.org/prb/article/10.1103/PhysRevB.76.045407/figures/6/medium" width="400px">
<hr style="width:50px;text-align:left;margin-left:0">

这个分解大体系的方法当然可以拓展到一些fancy的东西上，只是总感觉现在还不能想当然的莽，不然就看低了上世纪统力学者。


### [< BACK](https://wzetto.github.io/wz369.github.io/Research_etc/PaperCollect/main.html)