import util from '../util/base_util.js'
import colorUtil from "../util/colorUtil";

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
            //思想，用两个xScale
            //定义组比例尺
            let GScale = d3.scaleBand()
                .domain(data.map(function (d) {
                    return d[config.VC.groupName]
                }))
                .range([0, model.gW])
                .padding(0.15, 0.15);
            //定义组项比例尺
            let GMScale = d3.scaleBand()
                .domain(data[0][config.VC.members].map(function (d) {
                    return d[config.VC.memberName]
                }))
                .range([0, GScale.bandwidth()])
                .padding(0.1, 0.1);//用组的大小决定组项的范围
            //定义y轴比例尺
            let yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return d3.max(d[config.VC.members], function (d0) {
                        return d0[config.VC.memberValue]
                    })
                })])
                .range([0, model.gH * 0.9]); //美观0.9
            //定义颜色配比
            colorUtil.addLinearGradient(svg);
            let color = d3.scaleOrdinal().range(colorUtil.linearGradientId);
            //开始绘制
            let canvasG = svg.append('g').attr('transform', 'translate(' + model.tx + ',' + model.ty + ')');
            //首先添加分组的g
            let groupG = canvasG.selectAll('.groupG')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'groupG')
                .attr('transform', function (d) {
                    return `translate(${GScale(d[config.VC.groupName])},0)`
                });
            //每个分组添加矩形
            let rects = groupG.selectAll('rect.member')
                .data(function (d) {
                    return d[config.VC.members]
                })
                .enter()
                .append('rect')
                .attr('class', 'member')
                .attr('x', function (d) {
                    return GMScale(d[config.VC.memberName])
                })
                .attr('y', function (d) {
                    return (-yScale(d[config.VC.memberValue]) + model.gH)//反向画，然后平移
                })
                .attr('width', function () {
                    return GMScale.bandwidth()
                })
                .attr('height', function (d) {
                    return yScale(d[config.VC.memberValue])
                })
                .style('fill', function (d) {
                    return "url(#" + color(d[config.VC.color]) + ")"
                });

            //axis
            let yScale_ = yScale.domain([0, d3.max(data, function (d) {
                return d3.max(d[config.VC.members], function (d0) {
                    return d0[config.VC.memberValue]/ 0.9  //为了美化
                })
            })])
                .range([model.gH, 0]);
            //默认开启
            let add = util.setAxis()
                .svg(svg)
                .model(model)
                .xScale(GScale)
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
                    .data(data[0][config.VC.members])
                    .useColor(function (color, config, d) {
                        return "url(#" + color(d[config.VC.color]) + ")"
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