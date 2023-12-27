---
title: pyMD
layout: formal_default
---

[\<code\>](https://github.com/wzetto/pyMD)

自行编写分子动力学模拟（不解薛）的尝试。由于目前刚刚起步，还处于经典<span class="heimu" title="">土味</span>算法阶段，无法应用到科研工作中。故将之放在微小工作里，作为日常记录。

由于使用的均是经典<span class="heimu" title="">土味</span>参数，就直接放下结果。

<!-- - [丢人archive](https://wzetto.github.io/wz369.github.io/omoi_main/pyMD/archive202212.html) -->

<hr style="width:60px;text-align:left;margin-left:0">
**2022.11**

- 2D lattice in closed-pack structure. Starting from the relaxed configuration at 0 K.
- 1 fs/step; Nose-Hoover thermostat implemented to ensure the <code>NVT</code> ensemble at ~400 K.
- System gets stabilized after ~1000 steps.
- <code>GEAM</code> potential parameterized by [Zhou](https://journals.aps.org/prb/abstract/10.1103/PhysRevB.69.144113) <i>et al</i>. The gradient is computed based on <code>PyTorch</code> code.

With some other tricks?(
<hr style="width:40px;text-align:left;margin-left:0">
<iframe src="https://www.youtube.com/embed/lDB8qlZtgF8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen width="100%" height="300px"> </iframe>
<hr style="width:40px;text-align:left;margin-left:0">

下一步扩展到3维尝试应用，添加位错之类。但效率实在比不上成熟包体，故就当增加熟悉喽。

### [< back](https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html)

<script>
  window.onload = function(){
    let txt = document.getElementById("side_text");
    txt.innerHTML = "GEAM";
  }
</script>
  
