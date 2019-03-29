import util from '../util/base_util.js'
import colorUtil from "../util/colorUtil";

let d3 = require('d3');
let selectById = function (id) {
    //获取容器模型
    let model = util.getContainerModel(id);
    //选择容器添加svg
    let addSvg = util.selectContainerAddSvg()
        .id(id)
        .model(model);
    let svg = addSvg();
    return {
        draw: function (data, config) {
            //确定开始画的位置,确定g的位置
            let width = model.width;
            let height = model.height;
            //画g
            //路径生成器是以g的（0,0）为圆心开始画的
            let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
            //数据类型是这样的[{name: '鞋子',value: 100},{}]
            //定义每个数据加载的角量，total.value=每个数据的value相加，得到每个数据的角量d.angle=d.value/total.value*2pi
            //    d3已经封装好了这个过程，直接使用pie数据转换器将初始数据转换成圆弧数据
            let getPieData = d3.pie()
                .sort(function (d, i) {//数据片排序
                    return i
                })
                .value(function (d) {
                    return d[config.VC.size]
                });
            //    pie方法返回一个方法对象（p），通过这个对象p的sort方法为返回这个对象的作用域的变量赋值一个方法中（f，我们在这里传入）
            //    这样这个p方法对象就能使用f方法了

            //    定义弧路径生成器
            let arcG = d3.arc()
                .innerRadius(config.pie.innerRadius)//为圆弧路径生成器配置参数
                .outerRadius(config.pie.outerRadius);

            let getColor = d3.scaleOrdinal().range(colorUtil.pieColors);
            //    开始画
            let slices = g.selectAll('path.arc')
                .data(getPieData(data));//数据会转成这样[{startAngle:0,endAngle: 0.1*2pi},{}]
            //    enter
            let arcs = slices.enter()
                .append('path')
                .attr('d', function (d) {
                    return arcG(d)
                })
                .attr('class', 'arc')
                .attr('fill', function (d) {
                    return getColor(d.data[config.VC.color])
                });

            //判断是否显示文本
            if (config && 'text' in config) {
                let add = util.setMultiText()
                    .content(
                        config.text.content
                    )
                    .posX(function (d) {
                        return arcG.centroid(d)[0]
                    })
                    .posY(function (d) {
                        return arcG.centroid(d)[1]
                    })
                    .rowMaxWidth(function () {
                        return 100
                    })
                    .fontSize(config.text.fontSize)
                    .graphSelection(arcs);
                add();
            }
            //   是否需要tooltip
            if (config && 'tooltip' in config && config.tooltip) {
                let addToolTip = util.setToolTip(arcs)
                    .content(config.tooltip.content);
                addToolTip()
            }
            //legend
            if ('legend' in config) {
                let addLegend = util.setLegend()
                    .svg(svg)
                    .data(data)
                    .useColor(function (color, config, d) {
                        return color(d[config.VC.color])
                    })
                    .color(getColor)
                    .content(config.legend.content)
                    .config(config)
                    .model(model);
                addLegend()
            }
            //交互
            if (config && 'interactive' in config && config.interactive === false) {
                //do nothing
            } else {
                arcs.on('mouseover.bounce', function () {
                    d3.select(this)
                        .style('opacity', 0.7)
                        .transition()
                        .duration(200)
                        .ease('bounce')//缓动效果，弹跳
                        .attr('d', function (d) {
                            let arc = d3.svg.arc()
                                .innerRadius(config.pie.innerRadius) // 设置环的内半径,为0的时候则是圆
                                .outerRadius(config.pie.outerRadius * 1.2); // 通过比例尺计算外半径
                            return arc(d)
                        })
                });
                arcs.on('mouseout.bounce', function () {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .ease('bounce')//缓动效果，弹跳
                        .attr('d', function (d) {
                            return arcG(d)
                        })
                        .style('opacity', 1)
                })
            }
        }
    }
};
export default {
    selectById
}