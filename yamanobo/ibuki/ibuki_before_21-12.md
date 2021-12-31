---
title: '伊吹山'
permalink: /yamanobo/ibuki/ibuki_before_21-12.html
layout: map_default
---
2021.12.28
<hr style="width:50px;text-align:left;margin-left:0">

var map = L.map('map');
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
}).addTo(map);

var gpx = 'https://wzetto.github.io/wz369.github.io/yamanobo/ibuki/210206_ibuki.gpx';
new L.GPX(gpx, {async: true}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
}).addTo(map);

伊吹山，滋賀県最高峰。冬季，大陆高压携带对马海流大量水汽，经由若峡湾-琵琶湖-滨松通道时，进一步获得琵琶湖水汽供给，形成伊吹山地的‘豪雪’现象——这座不足1500m的山，变成了标准的冬攀修炼场。

***掏出手机扫荡一圈后手被迅速冻僵。似有妖魔过境，初踏冬山就体验了久负盛名的伊吹豪雪。***

<iframe width="300" height="400" 
        src="https://www.youtube.com/embed/IKnbJy-kMtI" 
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
</iframe>
<br />
<br />
***名古屋 - 霊仙ー鈴鹿山脈 - 琵琶湖云隙光全景， 2021.12***

<p align="left">
  <img src="https://wzetto.github.io/wz369.github.io/images/yama/ibuki/20211228/IMG_1568.jpeg">
</p>


#### [< back](https://wzetto.github.io/wz369.github.io/yamanobo/yamanobo.html)
