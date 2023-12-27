---
title: 京の夕焼け
---

2021.12.28

- [Codes](https://github.com/wzetto/YuyakeRecog) 

京都冬天的积云会在日落时散于西方，确切的说，Ponpon-愛宕连线处，平淡的落日大概能体会到夕暮れ的些许悲凉。

夏天，尤其雨后，则是夕烧频发日子，登上大文字，买瓶荔枝水（自贩机限定），空气稍有燥热，但漫天红霞定能让审美之愉传导周身神经，再有北方山地的小型云瀑，在这小城中，竟也能享受一番天地包容之感！

体验虽好，但夕烧可遇不可求——也许呆个两三年，就能自如判断今晚登山与否了吧！但现阶段，勉强采用量化手段。简单用windy的ECMWF云图数据（1h）对当日夕阳前1h-夕阳后15min的截图，放入CNN中~~搅拌~~,两三百张后，大概会拟合出75% Acc的网络，也算是能提前判断今晚是搬砖还是上山。不过云图本身不稳定，所以越逼近日落采集数据，准确度越高。

over。

具体还在工事中，有时间试下交互吧。

***i.e. 京の夕焼け***

<p align="left">
  <img width="400" height="300" src="https://wzetto.github.io/wz369.github.io/images/omoi/yuyake_recog/IMG_9708.jpeg">
</p>

#### [< back](https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html)
