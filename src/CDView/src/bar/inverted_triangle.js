import cLayout from '../util/layout'
import util from '../util/base_util.js'

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
            let gW = model.gW;
            let gH = model.gH;
            let tx = model.tx;
            let ty = model.ty;
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + (tx + 0.1 * gW) + ',' + (ty + 0.1 * gH) + ')');

            //使用自己定义的布局
            let convert = cLayout.inverted_triangle()
                .sortBy(function (d) {
                    return d[config.VC.sort]
                })
                .minWidth(gW * 0.3)
                .size([gW, gH]);
            let newData = convert(data);
            // console.log(newData)
            //使用d3的线路径生成器
            let line = d3.line()
                .x(function (d) {
                    return d[0]
                })
                .y(function (d) {
                    return d[1]
                });
            //定义颜色
            let color = d3.scaleOrdinal(d3.schemeCategory10);
            //开始画图形
            let triangles = g.selectAll('path')
                .data(newData)
                .enter()
                .append("path")
                .attr('d', function (d) {
                    return line(d.position)
                })
                .style('fill', function (d) {
                    return color(d.data[config.VC.color])
                });

            //legend
            if ('legend' in config) {
                let addLegend = util.setLegend()
                    .svg(svg)
                    .data(newData)
                    .useColor(function (color, config, d) {
                        return color(d.data[config.VC.color])
                    })
                    .color(color)
                    .content(config.legend.content)
                    .config(config)
                    .model(model);
                addLegend()
            }
            //tooltip
            if (config && 'tooltip' in config && config.tooltip) {
                let addToolTip = util.setToolTip(triangles)
                    .content(config.tooltip.content);
                addToolTip()
            }
            let texts;
            //判断是否显示文本
            if (config && 'text' in config) {
                let add = util.setMultiText()
                    .content(
                        config.text.content
                    )
                    .posX(function (d) {
                        return d.centroid()[0]
                    })
                    .posY(function (d) {
                        return d.centroid()[1]
                    })
                    .rowMaxWidth(function () {
                        return 100
                    })
                    .graphSelection(triangles)
                    .fontSize(config.text.fontSize);

                texts= add();
            }
            //添加交互
            if (config && 'interactive' in config && config.interactive === false) {
                //do nothing
            } else {
                triangles.on('mouseover.color', function () {
                    d3.select(this)
                        .style('fill-opacity', 0.5)
                })
                    .on('mouseout.color', function () {
                        d3.select(this)
                            .style('fill-opacity', 1)
                    })
            }

            //返回一个update对象用来跟新数据
            return {
                reDraw(reData){
                    let newData = convert(reData);
                    triangles.data(newData)  //重新绑定数据
                        .transition()
                        .duration(1000)
                        .attr('d', function (d) {
                            return line(d.position)
                        })
                        .style('fill', function (d) {
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
                                    return d.centroid()[0]
                                })
                                .posY(function (d) {
                                    return d.centroid()[1]
                                })
                                .rowMaxWidth(function () {
                                    return 100
                                })
                                .graphSelection(triangles)
                                .fontSize(config.text.fontSize);

                            texts= add();
                        },1000)
                    }
                }
            }
        }
    }
};
export default {
    selectById
}