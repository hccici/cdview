import util from '../util/base_util.js'

let d3 = require('d3');
//根据ID选择dom,画折线
let selectById = function (id) {
    //获取容器模型
    let model = util.getContainerModel(id);
    //选择容器添加svg
    let addSvg = util.selectContainerAddSvg()
        .id(id)
        .model(model);
    let svg = addSvg();
    //开始画
    return {
        draw: function (data, config) {
            //确定开始画的位置,确定g的位置
            let tx = model.tx;
            let ty = model.ty;
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
            //画折线
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
            let yScale = d3.scaleLinear()
                .domain([d3.min(data, function (d) {
                    return d[config.VC.position[1]]
                }),
                    d3.max(data, function (d) {
                        return d[config.VC.position[1]]
                    })])
                .range([model.gH, 0]);

            //  定义一个线路经生成器
            let line_generate =
                d3.line()
                    .x(function (d) {
                        return (xScale(d.xPositionO))
                    })
                    .y(function (d) {
                        return (yScale(d[config.VC.position[1]]))
                    });
                    // .interpolate("cardinal");//使用差值模式，依据原始坐标点，在这些坐标点之间插入更多的坐标点，在连接所有的点后，曲线就会变得平滑

            //    在g下生产path路径
            let line = g.append('path').attr('d', line_generate(data)).attr('class', 'cd_curve');
            //  根据配置更改属性
            if (config) {
                //颜色
                if ('line' in config && 'lineColor' in config.line) {
                    line.attr('style', 'stroke: ' + config.lineColor)
                }
                //    圆点
                let circles;
                let dotsG;
                if ('line' in config && 'dots' in config.line) {
                    if (config.line.dots === true) {
                        dotsG = g.selectAll('g.dotsG')
                            .data(data)
                            .enter()
                            .append('g')
                            .attr('class', 'dotsG');
                        //加一个无填充颜色的长方形用于tooltip
                        dotsG.append('rect')
                            .attr('height', model.gH)
                            .attr('width', 9)
                            .attr('x', function (d) {
                                return xScale(d.xPositionO) - 4.5
                            })
                            .attr('fill', '#ddd')
                            .attr('fill-opacity', 0);
                        circles = dotsG.append('circle')
                            .attr('class', 'dots');
                        circles.attr('cx', function (d) {
                            return xScale(d.xPositionO)
                        }).attr('cy', function (d) {
                            return yScale(d[config.VC.position[1]])
                        }).attr('r', 4.5);
                        //交互
                        if (config && 'interactive' in config && config.interactive === false) {
                            //do nothing
                        } else {
                            dotsG.on('mouseover.rect', function () {
                                d3.select(this).select('rect')
                                    .attr('fill-opacity', 1)
                            })
                                .on('mouseout.rect', function () {
                                    d3.select(this).select('rect')
                                        .attr('fill-opacity', 0)
                                })
                        }
                    }
                }
                // 面积
                if ('line' in config && 'area' in config.line) {
                    if (config.line.area === true) {
                        //面积生成器 生成器传入的是一个数组
                        let areaG = d3.area()
                            .x(function (d) {
                                return xScale(d.xPositionO)
                            })
                            .y0(function () {
                                return (model.gH)
                            })
                            .y1(function (d) {
                                return yScale(d[config.VC.position[1]])
                            });

                        g.insert('path', 'path.cd_curve')
                            .attr('class', 'lineArea')
                            .attr('style', 'fill: ' + config.lineColor + ';')
                            .attr('d', areaG(data))
                    }
                }
                //tooltip
                if ('tooltip' in config && config.tooltip) {
                    let addToolTip = util.setToolTip(dotsG)
                        .content(config.tooltip.content);
                    addToolTip()
                }

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
                    add();
                } else {
                    add()
                }
            }
        }
    }
};
export default {
    selectById
}