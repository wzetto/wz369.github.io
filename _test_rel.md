---
layout: null
permalink: /_test_rel.html
---
A: {{ '/js/map_homepage.js' | relative_url }}
B: {{ 'https://wzetto.github.io/wz369.github.io/js/map_homepage.js' | replace: site.url, '' | replace: site.baseurl, '' | relative_url }}
C: {{ '/wz369.github.io/js/map_homepage.js' | replace: site.url, '' | replace: site.baseurl, '' | relative_url }}
D: {{ '/js/map_homepage.js' | replace: site.url, '' | replace: site.baseurl, '' | relative_url }}
