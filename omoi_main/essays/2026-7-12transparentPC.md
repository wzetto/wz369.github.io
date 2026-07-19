---
title: 透明PC打印
layout: formal_default
omoicomment: true
tags:
- 其他/随笔
filename: 2026-7-12transparentPC
---

参数文件：<a href="https://makerworld.com/en/models/3067499-pc-clear-translucent#profileId-3452860"><img src="../../images/icon/makerworld.svg" alt="" aria-hidden="true" style="width:1em; height:1em; vertical-align:-0.12em; margin-right:0.25em;">MakerWorld</a>

### 介绍

梅雨季周末躲家里，除了蹬codex外不整点实验浑身难受。故使用拓竹P2S 0.6 mm / 0.8 mm 碳化钨头进行了对透明PC耗材打印的尝试。PC耗材生产厂家为拓竹。

该工程塑料拥有89%透光率，与透明PETG相比拥有更高强度以及高温耐性（glass transition temperature），也就是更难打印。

FDM相比光固化天然不适合打印透明材料，这是自我折磨课题，以期获得对打印过程的更深入理解。

### 思路和手法

参考拓竹官方和Maker World，Reddit老哥对半透明PETG的打印攻略，以及5.6 Pro的跟进和思路sampling。

由于涉及实验，5.6 Pro会列举大量参数，但并非全对，也并非完全，不完全对会导致结果完全不对，故需要对可能的参数进行调整试错，再根据GPT的反馈和实验获得的对照来加强理解以及寻找优化梯度，最终发现GPT对线横截面的判断错误，也许是拓竹官方指南是PETG材料的原因，而这是为数不多的参考资料。调参人，并且废机器。是时候学下FDM模拟了...后处理是在底面和表面涂UV胶，待渗透进孔隙后用紫光灯固化。

### 结果

导致非透明的原因是界面造成的光散射在试料内部的发生，主要的界面是FDM法在走线过程中，新的熔融塑料线接触到旧的塑料线时，如果新旧接触部分未能通过：新线加热旧线使其软化产生扩散 的话则会产生界面。需要消除的是此类边界，消除的思路是让**新的高温塑料线熔化接触到的旧凝固塑料线**，消除的手段是减缓新塑料线的冷却，具体的参数是高初始温度，高环境温度，低打印速度，**低体积流量**但是**高流量比（flow ratio）**，通过过挤出的扁平走线降低空隙率以及增加新-旧线接触面积（也许是比接触面积，考虑小挤出体积冷却更慢的优势）。


<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=1JLXteSwqB5yTRYJ7opKM5lf9yNqL_Foe&sz=w2800" width="300px" />
</p>

跟官方透明件参数的对比。小气泡是UV胶涂布过程产生，以及内部仍有微小边界。没办法，尽力了，太折磨。

<p style="text-align: center;"><em>左 0.6 mm / 中 0.8 mm / 右 0.6 mm 官方参数</em></p>
<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=19v_UKh2he7FXTjCCX61_YBnYrh1UE8UI&sz=w2800" width="600px" />
</p>

透，虽说拿远了仍然是毛玻璃效果。没办法，尽力了。

<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=1akwEbqp2wlRnCrINoNq1HztwvUhAmgPy&sz=w2800" width="300px" />
</p>


<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=1Y_yre2pbo7mKy15FVRM7uixyfCm0OVNd&sz=w2800" width="300px" />
</p>

对各项参数和环境的评价（主观体验，与参数重要性不一定等价，以及具体数值采用0.8 mm喷嘴的数据）：

##### 夯

- flow ratio: 1.03以上可，甚至可以升到1.1。虽说后者因为挤出过多塑料会导致表面不平整，但无敌的高温碳化钨喷嘴会在打印更上一层时将不平整的部分刮到试料边缘，然后后处理即可。缺点是废机器。
- layer height $h=0.16\ mm$, line width $w = 0.82\ mm$, printing speed $< 10 mm/s$ 作用同上，高flow ratio + 低体积流量大概能增加比表面积优化导热。 

##### 顶级

- nozzle temperature： 290 deg.C。
- infill-wall overlap to 45%. 也是遵循新旧重叠消除边界的思路的暴力手段。（走线图中红色infill与橙色wall的重叠率）

<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=132_Vz023x0bki2EsEUbwenAgrIKzs4vQ&sz=w2800" width="400px" />
</p>

- 三绿E2 pro烘干机。能干到110 deg.C，但这是鼓风干燥机的下位替代，因为牢日的炉子太贵，走阿里的话，前一阵子跟阿里合作的佐川急便刚被杀鸡儆猴，剩下的顺丰遵纪守法一定会报税。（倒反天罡）

<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=1YfglxpBnX2OhvD4XoVqOCOY72kOXiw1X&sz=w2800" width="200px" />
</p>

##### 人上人

- 5.6 Pro，提供当前实验数据和.3mf参数文件后会生成指南和新.3mf文件，但有雷！打印一版试样至少需2h，若是考虑PC材料干燥时间一个晚上会流逝。若是使用埋雷参数进行实验会跌入绝望之渊！

##### NPC

- P2S机器：
  - 喷嘴和热床温度够
  - 但没有腔温控制，所以到达理想的50度左右腔温，需要提前加热1h
  - 而同时考虑到PC分解以及微塑料等启动了外排装置（Hon&Guan HI 100SD，与通风口和打印机的两个连接件用PETG-CF制作）。一旦吸入环境空气则会逐渐降温。
- PC材料：
  - 高模量（拓竹性能2.1 GPa）和高glass transition temperature ($T_g\approx 145\ ^{\circ}C$)，导致零件与腔温的温差过大的话热应力会使得零件翘曲，例如：

<p style="text-align: center;">
<img src="https://drive.google.com/thumbnail?id=1ZcHX--Keoy2FhfGBqscTbcp0bz-1HpEo&sz=w2800" width="300px" />
</p>

  - 以上的对策是在打印完成后，通过调整热床温度逐步降温，四舍五入也是在退火。例如，每次下降20K，稳定后再进行后续降温。直到热床（约等于零件温度）与腔温差小于20 K时可取出。以及，延伸来讲，打印功能件时brim（帽檐）设置不可少。

##### 拉完了

- smooth PEI plate （拓竹光面板）：并非光面。导致的底面凹凸需要后续涂胶处理。




### <a href="https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html"><img src="https://wzetto.github.io/wz369.github.io/images/icon/ico_detailarw_bk.svg" alt="back" style="height:0.9em; vertical-align:middle;"></a>

<script>
  window.onload = function(){
    let txt = document.getElementById("side_text");
    txt.innerHTML = "";
  }
</script>
