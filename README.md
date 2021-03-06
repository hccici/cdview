# 使用CDView

## 安装和运行
```
npm install //安装
npm run serve //运行，port：8090
npm run mock //运行mock服务器，用来返回json数据
CDView的打包，进入CDView目录，再 npm run build
```

## src目录结构
- assets: 静态资源文件，如css等
- CDView: 使用d3开发的数据可视化包
- component: vue各个页面组件
- router: vue路由配置
- store: vuex储存内容
- APP.vue: 目录页
- main.js:入口文件

##  CDView目录结构
- dist: CDView打包生成文件的目录
- test: 测试CDView
- src: 使用D3开发图形的源代码

### src
- area: 面积图形分组，保存生成各个面积类型的图的d3代码
- 其他具有相似语言的包也是上面的解释
- css: svg使用到的样式
- util: CDView使用到的工具类
- CDView.js: 入口文件
- index.js: 打包入口文件

### 打包说明
- 打包入口文件: /src/index.js
- 打包步骤: <br>
0、使用terminal进入CDView目录<br>
1、npm install（添加打包环境和依赖）<br>
2、npm run build （在根目录下生成/dist/main.js，main.js就是打包好的文件）

## 在html中的使用
1、在html中通过script标签引用CDView.js,就可以使用CDView对象了

## 在VUE中的使用
1、在main.js文件中引用CDView，挂载到vue原型
2、在单文件组件中（component）使用

```
<div id='test' :style="{width: '500px', height: '500px'}">
//新建一个容器，并一定赋予id、宽高，CDView根据id和宽高在容器内画图
...
<script>
 //首先准备好数据和配置对象
 let data=[];   // 符合规则
 let config={};  //可以查看配置文档
//然后选择想要的图形，给他提供容器id，数据信息，配置信息
 this.$cdview.force_directed_graph.selectById('test').draw(data,config);
```

## 关于mock服务器
1、 json文件放到根目录下的static下的data文件夹中。<br/>
2、 新增数据要重启mock服务器。<br>
3、例子： data目录下新增test.json，重启后，通过this.$axios.get('/api/test'),就可以拿到数据

## 起步

![南丁格尔玫瑰图](./public/img/start.png)

>首先了解一下左边图形的含义，每一块圆弧形表示一个手机品牌，它们有着不同的颜色，块的大小表示了这一年该手机品牌的销量。下面将使用CDView绘出这个图形。

```
第一步：

                  1、确定要画的图表，了解图形属性，了解数据结构，了解数据字段在图形上的映射。

                  2、通过上图我们可以看到图形有哪些属性：颜色、大小

                  3、再让我们来看一看下面的数据：
                    let data = [
                    {name: '小米', value: 60.8},
                    {name: '华为', value: 30.8},
                    {name: '联想', value: 30.4},
                    {name: '三星', value: 40.8},
                    {name: '苹果', value: 70.8},
                    {name: '其他', value: 20.8}
                    ];
                   可以看到数据是一个标准的json格式数组（有些图是一个json对象）。

                   4、再让我们看看数据字段到图形属性的映射
                    不同圆弧形的颜色，表示不同的手机品牌，所以：颜色--'name',
                    不同圆弧形的大小，表示不同的销量，所以：大小--'value'

                第二步：
                   配置图表所需信息：
                    let config = {
                    //私有
                    VC: {                  (视觉通道，也就是数据字段到图形属性的映射，不同的图表会有不同，
                                           具体查看不同图表说明)
                        color: 'name',     (颜色--'name')
                        size: 'value'      (大小--'value')
                    },
                    pie: {                 (配置图形属性，不同的图表会有不同，具体查看不同图表说明)
                        innerRadius: 20,   (圆弧形的内半径，当为0时，就是一个圆弧形变成扇形)
                        outerRadius: 130,  (圆弧形的外半径)
                    },
                    text: {                       (配置图形的文本，不同的图表会有不同，具体查看不同图表说明)
                        content: function (d) {   (文本内容)
                            return d.data.name
                        },
                        fontSize: function (d) {   (文本字体大小)
                            return d.data.value / 3
                        }
                    },
                    //公有
                    tooltip: {             (配置提示框,具体查看公用配置)
                        content: function (d) {
                            //console.log(d) 不知道d是什么结构时看一下
                            return (d.data.name + '销量为：' + d.value + '万台')
                        }
                    },
                    legend: {              (配置图例,具体查看公用配置)
                        content: function (d) {
                            return `${d.name}`
                        }
                    }
                };

                 第三步：
                    1、在页面中建一个图表容器，并指定id，大小：
                      &lt;div id="nightingale_rose_c" class="dv_box" :style="{width: '500px', height: '500px'}">&lt;/div>
                    2、如果你在node环境中使用，需要引用CDView：
                      import CDView from './CDView/src/index.js'
                    3、如果你在html中使用，需使用script标签引用：
                       &lt;script src="../src/CDView/dist/CDView.js"> &lt;/script>
                    4、然后使用：
                      CDView.nightingale_rose.selectById('nightingale_rose_c').draw(data, config)
```

## 详细使用
> 在vx-dateview目录下运行npm run serve，启动vue程序，使用浏览器访问8090端口，可以看到怎样使用CDView。<br>
> 详细使用请看每个component中的使用方式和实例说明，CDView中的每个图形也做了大量解释。<br>
> 特别注意的是，目前数据格式没有优化完全，使用每个图形时必须按照指定的格式。

