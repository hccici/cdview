import util from '../util/base_util.js'
import dataUtil from '../util/dataUtil.js'
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
            let tx = model.tx;
            let ty = model.ty;
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
            //因为折线图在x，y方向上都是连续的，所以使用现行比例尺
            //判断映射到x轴的字段是普通数值类型还是时间类型的
            let xScale;
            if (isNaN(Date.parse(data[0][config.VC.position[0]]))) {
                //  不能转化成数值，说明不是时间格式字符串，所以用普通的线性比例尺
                //为了下面使用统一，也给他添加新的字段
                data.forEach(item => {
                    item.xPositionO = item[config.VC.position[0]]
                });
                let max = d3.max(data, function (d) {
                    return d.xPositionO
                });
                let min = d3.min(data, function (d) {
                    return d.xPositionO
                });
                xScale = d3.scaleLinear()
                    .domain([min, max])
                    .range([0, model.gW])
            } else {
                //  能够转化成数值，说明是时间类型的字符串，所以使用时间类型的线性比例尺
                //修改原来的数据使时间格式字符串变成可以比较大小的时间类型
                data.forEach(item => {
                    item.xPositionO = new Date(item[config.VC.position[0]])
                });
                let max = d3.max(data, function (d) {
                    return d.xPositionO
                });
                let min = d3.min(data, function (d) {
                    return d.xPositionO
                });
                xScale = d3.scaleTime()
                    .domain([min, max])
                    .range([0, model.gW])
            }
            //因为position的y是这样的 xxx.xxx,所以要把.左右两边分开
            let yp = config.VC.position[1].substring(0, config.VC.position[1].indexOf('.'));
            let y = config.VC.position[1].substring(config.VC.position[1].indexOf('.') + 1);
            let cfgColor = config.VC.color.substring(config.VC.position[1].indexOf('.') + 1);

            let max = d3.max(data, function (d) {
                return d3.max(d[yp], function (d0) {
                    return d0[y]
                })
            });
            let min = d3.min(data, function (d) {
                return d3.min(d[yp], function (d0) {
                    return d0[y]
                })
            });
            let yScale = d3.scaleLinear()
                .domain([min, max])
                .range([model.gH, 0]);

            //转换数据
            let newData = dataUtil.multi_curve(data, config);
            //定义线条路径生成器,line 接收的是一个数组[],注意是newData ，d是data中的一项
            let line = d3.line()
                .x(function (d) {
                    return xScale(d.xPositionO)
                })
                .y(function (d) {
                    return yScale(d[y])
                });
            let color = d3.scaleOrdinal().range(colorUtil.publicColors);
            //绘制
            g.selectAll('path')
                .data(newData)
                .enter()
                .append('path')
                .attr('class', 'cd_curve')
                .attr('d', line)
                .style('stroke', function (d) {
                    return color(d[0][cfgColor])
                });

            //添加其他元素
            //axis,默认开启
            let add = util.setAxis()
                .svg(svg)
                .model(model)
                .xScale(xScale)
                .yScale(yScale);
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
            //    圆点
            let circles;
            let dotsG;
            let cs;
            let rects;
            if ('line' in config && 'dots' in config.line) {
                if (config.line.dots === true) {
                    //有多条线，所以先分组
                    cs = g.selectAll('g')
                        .data(newData)
                        .enter()
                        .append('g');
                    dotsG = cs.selectAll('g.dotsG')
                        .data(function (d) {
                            return d
                        })
                        .enter()
                        .append('g')
                        .attr('class', 'dotsG');
                    circles = dotsG.append('circle')
                        .attr('class', 'dots');
                    circles.attr('cx', function (d) {
                        return xScale(d.xPositionO)
                    }).attr('cy', function (d) {
                        return yScale(d[y])
                    }).attr('r', 4.5);
                    //交互
                    //加一个无填充颜色的长方形用于tooltip
                    rects = g.append('g')
                        .selectAll('rect')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('height', model.gH)
                        .attr('width', 9)
                        .attr('x', function (d) {
                            return xScale(d.xPositionO) - 4.5
                        })
                        .attr('fill', '#ddd')
                        .attr('fill-opacity', 0);

                    if (config && 'interactive' in config && config.interactive === false) {
                        //do nothing
                    } else {
                        rects.on('mouseover.rect', function () {
                            d3.select(this)
                                .attr('fill-opacity', 1)
                        })
                            .on('mouseout.rect', function () {
                                d3.select(this)
                                    .attr('fill-opacity', 0)
                            })
                    }
                }
            }
            //tooltip
            if ('tooltip' in config && config.tooltip) {
                let addToolTip = util.setToolTip(rects)
                    .content(config.tooltip.content);
                addToolTip()
            }
            //legend
            if ('legend' in config) {
                let addLegend = util.setLegend()
                    .svg(svg)
                    .data(newData)
                    .useColor(function (color, config, d) {
                        return color(d[0][cfgColor])
                    })
                    .color(color)
                    .content(config.legend.content)
                    .config(config)
                    .model(model);
                addLegend()
            }

        }
    }
};
export default {
    selectById
}