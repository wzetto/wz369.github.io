---
title: 'Log 2022.01-03'
---
2022.01.05
<hr style="width:50px;text-align:left;margin-left:0">
无论是经验模型，还是ab-initio建模，对FCC固溶体相的SFE计算并不是很难。<br>
AIM（axial interaction model)经验模型：<br>
基础还是Ising model下的cluster expansion，既然是能量，那自然是CE的老本行。将Excess free energy转化为FCC， HCP， dHCP的formation energy，利用ECI的关系进行转换计算。<br>
Ab initio:<br>
原子排列依然是基于随机考量，这点跟MSAD建模类似。不过是基于（111）层堆积。后弛豫。对intrinsic fault：对N层进行沿a/6<112bar>的移动：获得堆垛序列。随后，以SF区域A的面积正规化前后二结构能量差（formation energy)。同理extrinsic fault。<br>
最后到达Energy barrier for twin-boundary formation.这个择日研究吧，先把SFE数值整完。

2022.01.24
<hr style="width:50px;text-align:left;margin-left:0">
计算量比想象中大很多，可能引入权重已经是迫在眉睫的事了。

2022.01.28
<hr style="width:50px;text-align:left;margin-left:0">
上热力学做sampling吧。

2022.02.06
<hr style="width:50px;text-align:left;margin-left:0">
Insert vacuum bro.

2022.02.14
<hr style="width:50px;text-align:left;margin-left:0">
1.如果是SQS-based的话，对于interface这个环节，要单独考量随机程度。<br>
2.同样，对于interface，应该需要单独弛豫，在体系构成原子non-sufficient的情况下。

2022.02.27
<hr style="width:50px;text-align:left;margin-left:0">
1.基本上与池田等人的结果相似；但与nat commu上差距甚远。<br>
2.尝试对C层，面心原子进行修正。

2022.03.02
<hr style="width:50px;text-align:left;margin-left:0">
做出学会数据后做一下结构周期性条件修正。

2022.03.05
<hr style="width:50px;text-align:left;margin-left:0">
采样时循环调整不同层的权重似乎能有效收敛。

2022.03.11
<hr style="width:50px;text-align:left;margin-left:0">
应用权重进行类似的层层采样，有一定效果。但没有常规超胞有效。<br>
将晶胞扩充至正常尺寸后进行采样，然后缩放提交计算。

2022.03.21
<hr style="width:50px;text-align:left;margin-left:0">
这样一来，遗传算法得到的结构就很有可能变成高维空间的簇。这样可能失去一定的完备性？

#### [< back](https://wzetto.github.io/wz369.github.io/Research_etc/SFE/SFE_home.html)
