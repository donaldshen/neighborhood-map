## 目标
single page application，有map，上面有被标记的locations，点击后展现third-party的数据，用infowindow和dom来展示信息。
[image examples](https://classroom.udacity.com/nanodegrees/nd001/parts/00113454014/modules/271165859175462/lessons/2711658591239847/concepts/26906985370923)

> ### workflow
> 1. watch webcast
> 2. gulp/html/css/map
> 3. responsive design(this is killing me! fuck flex! fuck safari!)
> 4. knockout tutor
> 5. autocomplete/model
> 6. marker/animation
> 7. infowindow/third-party api
> 8. (opt)display route from my place to the specific marker

#### knockout
- 处理list（click event），
- filter
  - button和input结合，过滤被展示的locations
  - 可以加dropdown menu
- 其他有关changing state的dom
- list同步呈现map中的markers（locations）

#### maps api
- 处理markers（可以作为part of my viewmodel），
- tracking click events on markers，
- 更新map
- 5 interesting locations at least, display when init
- 点击marker有bounce动画

#### asynchronously加载资源

#### error handle
- alert消息或其他友好方式处理
- e.g., third-party data未成功返回
- [read](http://ruben.verborgh.org/blog/2012/12/31/asynchronous-error-handling-in-javascript/)

#### 加third-party data到infowindow中
- yelp, wikipedia, foursquare
- specify in README & UI
- 点击list或marker都会触发infowindow

#### responsive
- desktop,tablet,phone
-
