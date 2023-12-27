---
title: 2023.1.8
layout: formal_default
omoicomment: true
tags:
- 其他/随笔
filename: 2023-1-8Castoria
---

[\<code\>](https://github.com/wzetto/projLite-/blob/main/Hist_matching/try1.ipynb)

从网络搞到了C100的キャストリア百面相扫描，颜色不太对：

### 扫描图img_raw + Type moon官方图img_ref

<img src="https://drive.google.com/thumbnail?id=11PLOhC2jiYC9eGHZ3sh3iDd6ZwCZGu0q&sz=w800" width="600px"/>
<hr style="width:50px;text-align:left;margin-left:0">

故调下色，分为：
- Denoise+Cutout

降噪用opencv的`fastNlMeansDenoisingColored`函数；cutout用`rembg`包体。

- 随后用opencv的直方图均衡，直方图匹配用numpy实现，因定义在RGB色域上对img_ref的变换满足$\Gamma(img\_ref) = \sum_0^{255} P_{img\_ref}(w) \geq \sum_0^{255} P_{raw}(w)$，故可简化为`np.intep`对ref图与raw图的RGB通道上的累计分布函数做插值实现匹配。

- 最后二次降噪及改变背景alpha=0得到完成图，效果如下：

### 后处理扫描图 + Type moon官方图

<img src="https://drive.google.com/thumbnail?id=18ljGsd9x_AKCHAHxtvmNnADKuq6-8Tkr&sz=w800" width="600px"/>
<hr style="width:50px;text-align:left;margin-left:0">


### [< back](https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html)

<script>
  window.onload = function(){
    let txt = document.getElementById("side_text");
    txt.innerHTML = "ここすき";
  }
</script>
