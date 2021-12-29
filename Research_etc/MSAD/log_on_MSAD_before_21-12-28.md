---
title: 'Log till 2021.12.28'
description: 前情提要：在2021年，进行DFT计算，竟然是用CPU？！ 为避免退学危机，wz站了出来——さあ——用CPU攻下三元系高熵合金吧！好不容易计算出来的我，竟面对新的敌人——四元系？一个结构居然算要5天？！ 次回！怎么办，还是只好退学了吧——
permalink: /Research_etc/MSAD/log_on_MSAD_before_21-12-28.html
---

2021.12.28

## 那就总结一下
从流程上看，目前是： 对任意N元固溶相， 最小化1-6NN的cor-function， 以及1NN-2NN的cor-func——从统计力学角度讲， 这是对单一cor-func的’moment‘的统计。 从Ising model的角度讲， 其实就是对triplets做了一点约束。
从后续验证中， 也确实有奇效。

第三， 则是minimize deviation of number of **triplets cluster**, 对各个cluster作简单的回归以及dominance analysis,
可以发现符合‘直觉’的， Cr-Cr-Cr 与 Co-Co-Ni 具有决定性的功能。

获得’SQS‘后， 这个结构就能广泛运用了。后续采用简单的MC sampling， 获得一些其他伪随机结构， 可以基本认为是’effective configuration
for MSAD'。

**但细思极恐**的是， SQS真的能代表MSAD么？ 

所以对于后续的工作， 有两座难以翻越的高山。

## 那就展望一下

1. 一座是大雪塘， 需要精巧设计， 并且存在暴毙可能——毕竟是Yuge先生推脱给我的差事，必不可能好搞。

**Optimized Original Configuration**

传统DFT分析中， 用波函数对应能量并迭代至基态， 然后将迭代到的能量对应的configuration作为评价MSAD的标准。
但其缺陷在于， 求解Kohn-Sham方程过程中并未考虑寻常原子间作用， 那么在进行泛函分析之前就必须有‘考虑了初始作用’的优化结构。

理论上， 通过巧妙的Cluster Expansion， 构建团簇级别的optimized-origin config之间的
<p align="left">
  <img src="https://latex.codecogs.com/svg.image?V_{\alpha,&space;MSAD}&space;\mapsto&space;V_{\alpha^{'},&space;MSAD}" title="V_{\alpha, MSAD} \mapsto V_{\alpha^{'}, MSAD}">
</p>
, 能够用一些迭代手段， 例如传统的退火算法等等实现‘优化结构’的构建。但在离散系统中一旦上升到3个维度，就很难考量。

那就瞎算？比如说，随便平移下单单单元晶胞随便做下映射，那确实可以， 并且还做了点验证。但这工作就成功从费力不讨好再次降级到瞎jr搞。下一步就是跑路了。为何每天都想着跑路？那自然是警钟长鸣喽。研究每天搞，时刻准备跑（不

2. 另一座山是那个枪岳，在小领域内闻名遐迩，并且攀登相对前者容易。但对于如今的我确实十分虚无缥缈的东西。

例如，Yuge搞了个Projection Site来代替SQS， 但毕竟也是一系列configuration， 是否要有权重？

这么一想就永无止境了。可以计算三元系的CDOS——指例如15个主团簇，然后整出个概率。然后呢， N元系呢？ 甚至于各种config在非线性空间中的考量呢？
靶心是SQS， 8环是PS， 7环有SRO， 再外面是LP， 要是真那么简单就好了。

所以本文后半段的展望贡献价值达到了惊人的0， 适合毕业论文致辞（就是跑路的时候


#### [< back](https://wzetto.github.io/wz369.github.io/Research_etc/MSAD/research_on_MSAD.html)
