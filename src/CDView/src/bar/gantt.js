import util from '../util/base_util.js'
import CLayout from '../util/layout.js'

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
    //确定开始画的位置,确定g的位置
    let gW = model.gW;
    let gH = model.gH;
    let tx = model.tx;
    let ty = model.ty;
    return {
        draw(data, config) {
            //使用gantt布局得到适用于画图的数据
            let newData = CLayout.gantt()
                .size([gW, gH])(data,config);
            //定义一个颜色的线性比例尺
            let color = d3.scaleLinear()
                .domain([0, 1])
                .range(['#FF2B21', '#69FF1E'])
            //开始画
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
            let rects = g.selectAll('rect')
                .data(newData)
                .enter()
                .append('rect')
                .attr('x', function (d) {
                    return d.x
                })
                .attr('y', function (d) {
                    return d.y
                })
                .attr('width', function (d) {
                    return d.barWidth
                })
                .attr('height', function (d) {
                    return d.barHeight
                })
                .attr('fill', function (d) {
                    return color(d.data[config.VC.completion])
                });

            //颜色对比
            //定义一个线性渐变
            var defs = svg.append("defs");

            var linearGradient = defs.append("linearGradient")
                .attr("id", "linearColor")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");

            linearGradient.append("stop")
                .attr("offset", "0%")
                .style("stop-color", '#FF2B21');
            linearGradient.append("stop")
                .attr("offset", "100%")
                .style("stop-color", '#69FF1E');
            //添加一个矩形，并应用线性渐变
            let wan = svg.append("g")
                .attr("transform", `translate(${ model.width / 2 - 100},${ model.height - 80})`);

            wan.append('rect')
                .attr("width", 200)
                .attr("height", 30)
                .style("fill", "url(#" + linearGradient.attr("id") + ")");

            wan.append('text')
                .attr('x', 100)
                .attr('y', 55)
                .style('text-anchor','middle')
                .text('任务完成度，0%-100%');


            //添加其他元素

            //axis,默认开启
            let add = util.setAxis()
                .svg(svg)
                .model(model)
                .xScale(newData.xScale)
                .yScale(newData.yScale);
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

            //legend
            if ('legend' in config) {
                let useColor = function (color, config, d) {
                    return color(d.data[config.VC.completion])
                };
                let setText = config.legend.content;
                let add = util.setLegend(svg, newData, color, useColor, setText)
                    .config(config)
                    .model(model); //svg,数据,颜色比例尺
                add()
            }

            //tooltip
            if (config && 'tooltip' in config && config.tooltip) {
                let addToolTip = util.setToolTip(rects)
                    .content(config.tooltip.content)
                addToolTip()
            }

        }
    }
};
export default {
    selectById
}