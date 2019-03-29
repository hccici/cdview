import util from '../util/base_util.js'

let d3 = require('d3');
//根据ID选择dom,画散点
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
            let tx = model.tx;
            let ty = model.ty;
            let gH = model.gH;
            let gW = model.gW;
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');

            //定义线性比例尺，来对圆的位置和大小进行缩放
            let min = d3.min(data, function (d) {
                return d[config.VC.position[0]]
            });
            let max = d3.max(data, function (d) {
                return d[config.VC.position[0]]
            });
            let xScale = d3.scaleLinear()
                .domain([min * 0.8, max])
                .range([0, gW]);
            let min1 = d3.min(data, function (d) {
                return d[config.VC.position[1]]
            });
            let max1 = d3.max(data, function (d) {
                return d[config.VC.position[1]]
            });
            let yScale = d3.scaleLinear()
                .domain([min1 * 0.8, max1])
                .range([0, gH]);
            let minR = d3.min(data, function (d) {
                return d[config.VC.size]
            });
            let maxR = d3.max(data, function (d) {
                return d[config.VC.size]
            });
            let rScale = d3.scaleLinear()
                .domain([minR, maxR])
                .range([5, 20]);//根据圆点的y大小改变圆的大小，最小为5,最大为10

            //y轴用的反向比例尺
            let yScale_ = d3.scaleLinear()
                .domain([min1 * 0.8, max1])
                .range([gH, 0]);

            //在绘图前，如果配置中的axis的范围有设置那么将使用配置里的，而不是使用上面默认的
            if ('axis' in config) {
                if ('yRange' in config.axis) {
                    yScale.domain(config.axis.yRange);
                    yScale_.domain(config.axis.yRange);
                }
                if ('xRange' in config.axis) {
                    xScale.domain(config.axis.xRange)
                }
            }

            //使用d3配色库对圆点进行配色
            let getColor = d3.scaleOrdinal(d3.schemeCategory10);
            //开始画点
            let graphSelection;

            if (config && 'multi' in config && config.multi===true) {
                //定义d3的序数比例尺，用来生成不同的图形的名称
                // 不定义domain时，根据0,1,2,3......顺序输出，查过range范围，则循环range内容
                let getSymbolName = d3.scaleOrdinal() // <-A
                    .range(d3.symbols);
                //开始画点
                graphSelection = g.selectAll("path")
                    .data(data)
                    .enter()
                    .append("path")
                    .attr("transform", function (d) {
                        return "translate(" //
                            + xScale(d[config.VC.position[0]])
                            + ","
                            + (gH - yScale(d[config.VC.position[1]]))
                            + ")";
                    })
                    .attr("class", function (d, i) {
                        return "symbol _" + i
                    })
                    // 使用d3自带的符号图形路径生成器，只需要提供图形名字
                    .attr("d", function (d, i) {
                            return d3.symbol()
                                .size(function (d) {
                                    return rScale(d[config.VC.size]) * 10
                                })
                                .type(getSymbolName(i))(d)
                            //返回的只是个生成器方法，我们要调用它才能返回值
                        }
                    )
                    .attr('fill', function (d) {
                        return getColor(d[config.VC.color])
                    });
            } else {
                graphSelection = g.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) {
                        // return d[0]*zoomParam
                        return xScale(d[config.VC.position[0]])//其实就是输入x的大小，d3帮你进行合理的缩放
                    })
                    .attr('cy', function (d) {
                        return gH - yScale(d[config.VC.position[1]])
                    })
                    .attr('r', function (d) {
                        return rScale(d[config.VC.size])
                    })
                    .attr('fill', function (d) {
                        return getColor(d[config.VC.color])
                    }).attr('stroke', function (d) {
                        return getColor(d[config.VC.color])
                    }).attr('class', 'bubble')
            }

            //tooltip
            if (config && 'tooltip' in config && config.tooltip) {
                let addTooltip = util.setToolTip(graphSelection)
                    .content(config.tooltip.content);
                addTooltip()
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

            //axis
            //默认开启
            let add = util.setAxis()
                .svg(svg)
                .model(model)
                .xScale(xScale)
                .yScale(yScale_);
            if (config && 'axis' in config && config.axis.show === false) {
                //do Nothing
            } else if (config && 'axis' in config) {
                add.axisConfig(config.axis);
                let xyA = add();
                //操作y轴title
                xyA[1].select('text.yAxisTitle')
                    .attr('dx', '-3em')
            } else {
                add()
            }
            //supLine
            if (config && 'supLine' in config) {
                let addLine = util.setSupLine()
                    .content(config.supLine.content)
                    .position(config.supLine.position)
                    .gSelection(g)
                    .xScale(xScale)
                    .yScale(yScale_);
                addLine()
            }

            //返回一个update对象用来跟新数据
            return {
                reDraw(reData){
                    graphSelection.data(reData)  //重新绑定数据
                        .transition()
                        .duration(1000)
                        .attr('cx', function (d) {
                            // return d[0]*zoomParam
                            return xScale(d[config.VC.position[0]])//其实就是输入x的大小，d3帮你进行合理的缩放
                        })
                        .attr('cy', function (d) {
                            return gH - yScale(d[config.VC.position[1]])
                        })
                        .attr('r', function (d) {
                            return rScale(d[config.VC.size])
                        })
                }
            }
        }
    }
};
export default {
    selectById
}