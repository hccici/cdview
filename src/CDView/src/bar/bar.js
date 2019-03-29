import util from '../util/base_util.js'

let d3 = require('d3');
//根据ID选择dom,画条形图
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
            let gW = model.gW;
            let gH = model.gH;
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');

            //y轴的数据的连续的，所以用线性比例尺

            let yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d[config.VC.position[1]]
                })])
                .range([0, gH]);
            //x轴的数据是离散的，所以用序数比例尺
            let xScale = d3.scaleBand()
                .domain(data.map(function (d) {
                    return d[config.VC.position[0]]
                }))
                .range([0, gW])
                .padding(0.3, 0.3);

            //坐标轴使用的和图形使用的是相反的
            let yScale_ = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d[config.VC.position[1]]
                })])
                .range([gH, 0]);

            //定义颜色配比
            let getColor = d3.scaleOrdinal(d3.schemeCategory10);

            //在绘图前，如果配置中的axis的范围有设置那么将使用配置里的，而不是使用上面默认的
            if ('axis' in config && 'yRange' in config.axis) {
                yScale.domain(config.axis.yRange);
                yScale_.domain(config.axis.yRange);
            }
            if ('axis' in config && 'xRange' in config.axis) {
                xScale.domain(config.axis.xRange)
            }

            //开始绘图
            let rectGs = g.selectAll('g')
                .data(data)
                .enter()
                .append('g');
            let rects = rectGs// 选择一组数据，如果这个时候还没有元素，返回的是一个空选择，这个空选择仍然拥有非空选择的方法
                .append('rect')//添加矩形元素
                .attr('x', function (d) { //要为每个矩形动态的添加不一样的画的起始位置，就用匿名函数,d: 数组数据,i: 数组下标
                    return xScale(d[config.VC.position[0]])
                })
                .attr('y', function (d) {
                    return (-yScale(d[config.VC.position[1]]) + gH)//反向画，然后平移
                })
                .attr('width', function () {
                    return xScale.bandwidth();
                })
                .attr('height', function (d) {
                    return yScale(d[config.VC.position[1]])
                })
                .attr("fill", function (d) {
                    return getColor(d[config.VC.color]);
                });

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

            //tooltip
            if ('tooltip' in config) {
                let addTooltip = util.setToolTip()
                    .graphSelection(rects)
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

            //交互效果
            let bg = xScale.bandwidth() * 0.1;
            rectGs.insert('rect', 'rect')
                .attr('x', function (d) { //要为每个矩形动态的添加不一样的画的起始位置，就用匿名函数,d: 数组数据,i: 数组下标
                    return xScale(d[config.VC.position[0]]) - bg;
                })
                .attr('y', function () {
                    return 0
                })
                .attr('width', function () {
                    return xScale.bandwidth() + 2 * bg
                })
                .attr('height', function () {
                    return gH
                })
                .attr('fill-opacity', 0)
                .attr("fill", '#eeeeee')
                .attr('class', 'bg');

            if (config && 'interactive' in config && config.interactive === false) {
                //do nothing
            } else {
                rectGs.on('mouseover', function () {
                    d3.select(this).select('rect.bg').attr('fill-opacity', 1)
                }).on('mouseout', function () {
                    d3.select(this).select('rect.bg').attr('fill-opacity', 0)
                })
            }

            //返回一个update对象用来跟新数据
            return {
                reDraw(reData){
                    rects.data(reData)  //重新绑定数据
                        .transition()
                        .duration(1000)
                        .attr('y', function (d) {
                            return (-yScale(d[config.VC.position[1]]) + gH)//反向画，然后平移
                        })
                        .attr('height', function (d) {
                            return yScale(d[config.VC.position[1]])
                        })
                }
            }
        }
    }
};
export default {
    selectById
}