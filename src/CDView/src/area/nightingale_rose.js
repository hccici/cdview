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
        draw(data, config) {
            //确定开始画的位置,确定g的位置
            let width = model.width;
            let height = model.height;
            //画g
            //路径生成器是以g的（0,0）为圆心开始画的
            let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
            //定义pie布局生成适合布局的数据
            let pie = d3.pie()
                .sort(function (a, b) {
                    return a[config.VC.size] - b[config.VC.size]; //分块按从小到大排序
                })
                .value(function (d) {
                    return d[config.VC.size]; //给每个分块付权值，这样pie布局才能够决定分块的大小
                });
            let newData = pie(data);
            //添加百分比
            let maxV=0;
            data.forEach(item=>{
                maxV+=item[config.VC.size]
            });
            newData.forEach(item=>{
                item.percent=Math.round(item.data[config.VC.size]/maxV*1000)/10
            });
            // console.log(newData);//记得看看转化后的数据

            //定义要画的圆弧的内外半径
            let outerRadius = config.pie.outerRadius; // 圆弧外半径最大值
            let innerRadius = config.pie.innerRadius;
            // 定义一个线性比例尺，根据不同数据的值改变圆弧外半径的值
            let liner = d3.scaleLinear()
                .domain([d3.min(newData, function (d) {
                    return d[config.VC.size]
                }), d3.max(newData, function (d) {
                    return d[config.VC.size]
                })])
                .range([outerRadius * 0.8, outerRadius * 1.2]);
            //定义颜色比例尺
            let color = d3.scaleOrdinal().range(colorUtil.pieColors);
            //定义圆弧路径生成器
            let arc = d3.arc()
            //startAngle如果没有设置，就直接使用传入数据的startAngle（没有就报错了）
                .innerRadius(innerRadius)
                .outerRadius(function (d) {
                    return liner(d[config.VC.size])
                });//使用线性比例尺动态生成外半径
            //生成图形
            let arcG = g.append('g')
                .attr('class', 'nightingale_rose');
            let arcs = arcG.selectAll('path')
                .data(newData)
                .enter()
                .append('path');
            arcs.attr('d', arc)
                .attr('fill', function (d) {
                    return color(d.data[config.VC.color])
                });

            //tooltip
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
                    .color(color)
                    .content(config.legend.content)
                    .config(config)
                    .model(model);
                addLegend()
            }
            //判断是否显示文本
            let texts;
            if (config && 'text' in config) {
                let add = util.setMultiText()
                    .content(
                        config.text.content
                    )
                    .posX(function (d) {
                        return arc.centroid(d)[0]
                    })
                    .posY(function (d) {
                        return arc.centroid(d)[1]
                    })
                    .rowMaxWidth(function () {
                        return 100
                    })
                    .fontSize(config.text.fontSize)
                    .graphSelection(arcs);
                texts = add();
            }
            //交互
            if (config && 'interactive' in config && config.interactive === false) {
                // doNothing
            } else {
                arcs.on('mouseover.bounce', function () {
                    d3.select(this)
                        .style('opacity', 1)
                        .transition()
                        .duration(200)
                        .ease(d3.easeBounceOut)//缓动效果，弹跳
                        .attr('d', function (d) {
                            let arc = d3.arc()
                                .innerRadius(innerRadius) // 设置环的内半径,为0的时候则是圆
                                .outerRadius(liner(d[config.VC.size]) * 1.2); // 通过比例尺计算外半径
                            return arc(d)
                        })
                });
                arcs.on('mouseout.bounce', function () {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .ease(d3.easeBounceOut)//缓动效果，弹跳
                        .attr('d', function (d) {
                            return arc(d)
                        })
                        .style('opacity', 1)
                })
            }
            //添加圆外提示线
            if (config && 'lineTip' in config && config.lineTip === false) {
                // doNothing
            } else {
                //从圆弧中心引出一条线
                let lineTipG = g.insert('g','.nightingale_rose').attr('class', 'lineTips');
                let lineTipC = lineTipG.selectAll('g.lineTip')
                    .data(newData)
                    .enter()
                    .append('g')
                    .attr('class', 'lineTip');
                lineTipC.append('line').attr('x1', function (d) {
                    return arc.centroid(d)[0]*2
                }).attr('y1', function (d) {
                    return arc.centroid(d)[1]*2
                }).attr('x2', function (d) {
                    return arc.centroid(d)[0]*2.5
                }).attr('y2',function (d) {
                    return arc.centroid(d)[1]*2.5
                }).attr('stroke',config.lineTip.lineColor);
                //拉出一条直线
                lineTipC.append('line').attr('x1', function (d) {
                    return arc.centroid(d)[0]*2.5
                }).attr('y1', function (d) {
                    return arc.centroid(d)[1]*2.5
                }).attr('x2', function (d) {
                    let x2=arc.centroid(d)[0]*2.5;
                    return x2>0?(x2+20):(x2-20)
                }).attr('y2',function (d) {
                    return arc.centroid(d)[1]*2.5
                }).attr('stroke',config.lineTip.lineColor);
                //添加百分比
                lineTipC.append("text")
                    .attr('x',function (d) {
                        let x2=arc.centroid(d)[0]*2.5;
                        return x2>0?(x2+20):(x2-20)
                    })
                    .attr('y',function (d) {
                        return arc.centroid(d)[1]*2.5
                    })
                    .style("text-anchor","middle")
                    .attr('dy',-5)
                    .text(function(d){
                        return d.percent+'%';
                    });
            }

            //返回一个update对象用来跟新数据
            return {
                reDraw(reData) {
                    let newData = pie(reData);
                    // 定义一个线性比例尺，根据不同数据的值改变圆弧外半径的值
                    liner.domain([d3.min(newData, function (d) {
                        return d[config.VC.size]
                    }), d3.max(newData, function (d) {
                        return d[config.VC.size]
                    })]);

                    //定义圆弧路径生成器
                    arc.outerRadius(function (d) {
                        return liner(d[config.VC.size])
                    });//使用线性比例尺动态生成外半径
                    //生成图形
                    arcs.data(newData)
                        .transition()
                        .duration(1000)
                        .attr('d', arc)
                        .attr('fill', function (d) {
                            return color(d.data[config.VC.color])
                        });
                    //重新添加文本
                    if (config && 'text' in config) {
                        texts.remove();
                        setTimeout(function () {
                            let add = util.setMultiText()
                                .content(
                                    config.text.content
                                )
                                .posX(function (d) {
                                    return arc.centroid(d)[0]
                                })
                                .posY(function (d) {
                                    return arc.centroid(d)[1]
                                })
                                .rowMaxWidth(function () {
                                    return 100
                                })
                                .fontSize(config.text.fontSize)
                                .graphSelection(arcs);
                            texts = add();
                        }, 1000)
                    }

                }
            }
        }
    }
};
export default {
    selectById
}