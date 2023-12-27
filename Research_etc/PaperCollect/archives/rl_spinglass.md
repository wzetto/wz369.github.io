---
filename: rl_spinglass
title: Searching for spin glass ground states through deep reinforcement learning
layout: paper_default
papercomment: true
tags:
- mat/SQS
- rl/NP-hard
- journal/NC
highlight: false
author: Fan et al.
mainpoint: 自旋玻璃基态的rl搜寻。
doi: 10.1038/s41467-023-36363-w
---

GNN + Q-learning 对二维Ising模型基态构型的成功搜寻。

#### Action

$a^{i}$ represents flipping spin i.

#### Reward

<p align="center">
$r(s,a^{i},s')=2\sum_{j\in \partial i} j_{ij}\sigma_i \sigma_j$
</p>

as simple 2-dimension spin.

#### Training

##### Encoding

Edge-centric + Node-centric update based on GNN.




<br>


### [< BACK](https://wzetto.github.io/wz369.github.io/Research_etc/PaperCollect/main.html)