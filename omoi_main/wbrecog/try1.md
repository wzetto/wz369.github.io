---
title: WBdisloc
layout: formal_default
---

[\<code\>](https://github.com/wzetto/MATools/tree/main/WBdisloc)

年末抽两天搞了去年末遗留（？的位错识别问题。简要梳理下思路：

- 首先从SAED图像识别衍射斑点 -\> Burgers vector.可以直接通过opencv <code>HoughCircles</code>解决。

- 导入灰度图像。

<hr style="width:50px;text-align:left;margin-left:0">
<img src="https://drive.google.com/thumbnail?id=1fuLDIfPPViOMH23Q2ZMwORFHWeTvS-pT&sz=w800" width="400px"/>

- 手描线，例如定义：添加原始锚点/删除原始锚点/拖动锚点/插值生成曲线($l$) 四种操作。返回锚点坐标数组。

- 对插值曲线$l$上等距$N$个拟合点做处理。为：

1. 定义$P_N$上的切线及垂线$l_{P_N}^{\perp}$，自定义长度，下文称呼pins。$N$个pins在原图像上的intensity-x图（下文称I-x图）长这样：
  
<hr style="width:50px;text-align:left;margin-left:0">
<img src="https://drive.google.com/thumbnail?id=1AZ1jilxTIEIPzZnLai8Kg5-onL7sry8I&sz=w1200" width="900px"/>

需要筛选有效信号。识别标准为：将单个pin的I-x pattern拟合高斯分布后，定义其AIC/BIC/Variance的值超出某阈值。

例如有效信号其一。其中，x为单个pin在图像经过的像素，y为归一化后的对应intensity；蓝橙绿分别对应原始平滑拟合。

<hr style="width:50px;text-align:left;margin-left:0">
<img src="https://drive.google.com/thumbnail?id=1AdxM1p00UVBEzAA5nQxdLGRhWeHW57Yi&sz=w800" width="400px"/>

2. 返回有效pins的I-x图拟合后的高斯分布参数。定义$\mu\pm0.3\sigma$处的像素为待测像素。生成范例如下。其中黑线为pins，黑点为待测像素。

<hr style="width:50px;text-align:left;margin-left:0">
<img src="https://drive.google.com/thumbnail?id=1ADl85Mv1vp_BDOIdhKD787ZfWr1Z4pQB&sz=w800" width="600px"/>

- 返回待测像素坐标，因非时间序列，故采用非参数化的Lowess平滑。取68%置信区间后返回最终坐标序列。如下图：

<hr style="width:50px;text-align:left;margin-left:0">
<img src="https://drive.google.com/thumbnail?id=1AlWYfaxgdvjXfS7cvplxrsXHBFxQvD1J&sz=w800" width="600px"/>

- 接下来识别有效的锚点对，定义为$p=p_2\in l_2-p1\in l_1$垂直于两条平行位错。进行后续科学计算时仅信任锚点对数据。取点数较少的一条位错为基，大概思路是：

<img src="https://drive.google.com/thumbnail?id=1Ao5Mb2CZKKFBavqEebkbThJfcIt9vw5T&sz=w800" width="800px"/>

<hr style="width:50px;text-align:left;margin-left:0">

总之成品为：

<hr style="width:50px;text-align:left;margin-left:0">
<img src="https://drive.google.com/thumbnail?id=1AQ4hbPp-JVCuG8IeEtplK9-aRo4Jvu63&sz=w800" width="400px"/>

- 红线是平滑曲线（不带/带插值）；
- 红环是置信区间；
- 平黑线是切线；竖黑线是$1.5^{\circ}$ tolerance下的有效锚点对；
- 蓝点是有效点；红叉是无效点；
<hr style="width:50px;text-align:left;margin-left:0">
拉二真美妙～

<iframe width="100%" height="400px" src="https://www.youtube.com/embed/SvuitFzDxDg?start=55&autoplay=0" 
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen> </iframe>

### [< back](https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html)

<script>
  window.onload = function(){
    let txt = document.getElementById("side_text");
    txt.innerHTML = "";
  }
</script>

