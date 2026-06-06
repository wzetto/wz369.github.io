---
title: Paraponera Clavata
layout: formal_default
omoicomment: true
tags:
- 其他/随笔
filename: 2026-5-10paraponera_clavata
---

**概述**

中南美的奇特蚂蚁，俗称子弹蚁。从新后开始到现在大概两年，工蚁发展到了50只。这个数量是因条件不对/整活等死去不少卵/幼/茧/工的结果，理想条件下两年达到100只工蚁不是梦。

**饲养条件观察**

比较耐操，出门一周实证没事，更长的话可能需要额外供给系统，比较麻烦。

- 食物：碳水（营养液，额外供水）和蛋白质（大麦虫，面包虫，樱桃蟑螂，昆虫果冻等）。
- 温湿度：
  - 温度：22-28度，超过范围会崩溃，即从卵到工各个阶段个体死亡。
  - 湿度：室内湿度即可，缺水时工蚁会外出寻找，某一处湿度过高时工蚁会连带卵幼转移。这两点可作为湿度限度判据。
- 结茧：在冲绳红土/各类甲虫床材/热带雨林土（感觉假）/腐叶土中尤其偏好腐叶土，作为幼虫结茧辅助。结茧期被打扰：强光刺激或震动有结茧失败几率。
- 周期：卵期40，幼虫期25，茧期2-4个月，似乎视成虫体型决定，成虫体型取决于幼虫期蛋白质摄入量，而这又取决于外界供给和群落动态调节（e.g.较长时间内无工蚁产生的话，未来新产生的工蚁茧期十分短，同时体型偏小）。
- 上限：
  - 自然群落上限论文有研究。
  - 卵上限一般是30，部分卵会成为供幼虫食用的营养卵。这样理论上能保证工蚁数量以线性增长。（亚马逊生存之道？）特殊情况会到60以上，这是因饲养条件不对导致卵无法孵化，或者大量幼虫结茧失败，死亡后，长时间没有工蚁（成虫）羽化后蚁后的应激行为。在这种情况下，茧期缩短至2个月，成虫体型偏小。成虫寿命据说2-3年，但本群因为整活略多，有不下10只工蚁只有一年寿命。
- 初期群落：并非完全新后，因为找人前后合了5枚茧。新后想必是地狱难度。
- 腔室：外购的混凝土巢。额外隔热遮光。连接一个活动区，亚克力箱，连通大气。
- 行为：
  - 进食和大世界扫荡是在夜间进行。观察的话大概只能通过摄像头/阴间作息。
  - 利用前颚搬运液体。
  - 遇到威胁腹部发声。
  - 残疾工蚁较大频率承担活动区巡逻工作。
- 整活：
  - 冬天腔室温度不达理想条件的话会崩溃。夏天更是重量级。能维稳就万幸。
  - 腔室内塞进温湿度传感器的话会招致工蚁攻击塑料外壳。
  - 合并外来工蚁，会与本群工蚁互殴，不致死，并会被拉进群。This is the way？
  - 食物管理不善导致螨虫增生。
  - 工蚁会攻击活动区的植物。如果是多肉的话工蚁会死（怎么能整出这种活）。如果是苔藓会被当作幼虫结茧介质。

**个体识别**

在活动区放了一个广角红外观察夜间行为，并尝试对范围内的蚂蚁进行识别，得以进行后续分析等。

**方法1**

QWEN 3.6 35B 轮椅。放弃思考这块。

<img src="https://drive.google.com/thumbnail?id=1RvJBG1lUOLazbtKvQDR9cqWtS705t3rO&sz=w2800" width="800px" />

监控序列大概天然适合llm，但推理速度太慢，对视频难以速出结果，这样引出方法2:

**方法2**

古法炼丹。用QWEN做事前筛选/识别，然后查漏补缺，微调YOLO26s。这样精度高一些，将来也可以放树莓派之类跑。

<div style="max-width: 100%;">
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
    <iframe 
      src="https://www.youtube.com/embed/pYpulA-Q9q4?start=55&autoplay=0" 
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>
  </div>
</div>

二体距离抽出。

<img src="https://drive.google.com/thumbnail?id=1tAzMI28_VL6__vI-FbX0oryoxFIqfF-D&sz=w2800" width="600px" />

速度抽出。（1/3s等间隔，也许可以继续提高精度）

<img src="https://drive.google.com/thumbnail?id=1jbBzuADyPRfMtCjGk4_WgACM_oGHEatf&sz=w2800" width="600px" />

这些参数应该能用行为聚类，或者套一些统力/MD的模型会很有意思？也许有老哥已经整过类似活了。

吃饭

<img src="https://drive.google.com/thumbnail?id=1fqHKXc9CJLYEmMjMgWn1ostVcTsEjfCE&sz=w2800" width="600px" />

### <a href="https://wzetto.github.io/wz369.github.io/omoi_main/omoi.html"><img src="/images/icon/ico_detailarw_bk.svg" alt="back" style="height:0.9em; vertical-align:middle;"></a>

<script>
  window.onload = function(){
    let txt = document.getElementById("side_text");
    txt.innerHTML = "";
  }
</script>