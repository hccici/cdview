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
            let circleG = svg.append('g').attr('transform', 'translate(' + model.width / 2 + ',' + model.height / 2 + ')');

            //    首先画圆形径向坐标系的圆
            let r = model.gH / 2 / 10;
            let axisData = [];
            for (let i = 1; i <= config.interval; i++) {
                axisData.push(i)
            }
            circleG.selectAll('circle.circleCoordinate_c')
                .data(axisData)
                .enter()
                .append('circle')
                .attr('class', 'circleCoordinate_c')
                .attr('r', function (d) {
                    return r * d
                });
            //再画径向轴
            let attr = config.VC.attr;
            let attrName = config.VC.attrName;
            let attrValue = config.VC.attrValue;
            //径向轴条数
            let axisNum = data[0][attr].length;
            //新建轴对象，保存轴的信息
            let axisG = [];
            let part = 360 / axisNum;
            for (let i = 0; i < axisNum; i++) {
                let axis = {};
                axis.name = data[0][attr][i][attrName];
                axis.rotateAngle = part * i;
                axis.lenght = model.gH / 2;
                axisG.push(axis)
            }
            let axisGS = circleG.selectAll('line.circleCoordinate_a')
                .data(axisG)
                .enter()
                .append('g')
                .attr('class', 'circleCoordinate_a')
                .attr('transform', function (d) {
                    return `rotate(${d.rotateAngle})`
                });

            axisGS.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', function (d) {
                    return d.lenght
                })
                .style('stroke', '#000000');
            //为轴添加文本
            axisGS.append('text')
                .attr('dy', model.gH / 2 + 14)
                .style('text-anchor', 'middle')
                .text(function (d) {
                    return d.name
                });

            //再画属性图形
            let getHorizontalPosition = function (angle, lineScale, value) {
                let rl = lineScale(value);
                angle += 180;
                //sin接收的是弧度所以要做转换
                angle *= Math.PI / 180;
                return rl * Math.sin(angle)
            };
            let getVerticalPosition = function (angle, lineScale, value) {
                let rl = lineScale(value);
                // angle+=180;
                angle *= Math.PI / 180;
                return rl * Math.cos(angle)
            };
            //线性比例尺
            let lineScale = d3.scaleLinear()
                .domain(config.rangeValue)
                .range([0, model.gH / 2]);
            //装配数据
            data.forEach(item => {
                item[attr].forEach((d, i) => {
                    d.angle = axisG[i].rotateAngle
                });
                item[attr].push(item[attr][0])
            });
            // console.log(data);
            //定义线路径生成器
            let generateLine = d3.line()
                .x(function (d) {
                    return getHorizontalPosition(d.angle, lineScale, d[attrValue])
                })
                .y(function (d) {
                    return getVerticalPosition(d.angle, lineScale, d[attrValue])
                });
            //画
            //颜色
            let color = d3.scaleOrdinal().range(colorUtil.radarColors);
            let gg = circleG.selectAll('path')
                .data(data)
                .enter()
                .append('path')
                .attr('d', function (d) {
                    return generateLine(d[attr])
                })
                .style('fill', function (d) {
                    return color(d[config.VC.color])
                })
                .style('fill-opacity', 0.2)
                .style('stroke', function (d) {
                    return color(d[config.VC.color])
                });

            //tooltip
            if ('tooltip' in config) {
                let addTooltip = util.setToolTip()
                    .graphSelection(gg)
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
                    .color(color)
                    .content(config.legend.content)
                    .config(config)
                    .model(model);
                addLegend()
            }

            //添加交互
            if (config && 'interactive' in config && config.interactive === false) {
                // doNothing
            } else {
                gg.on('mouseover.change', function () {
                    d3.select(this)
                        .style('fill-opacity', 0.5)
                        .style('stroke-width', 2);
                });
                gg.on('mouseout.change', function () {
                    d3.select(this)
                        .style('fill-opacity', 0.2)
                        .style('stroke-width', 1);
                })
            }
            //返回一个update对象用来跟新数据
            return {
                reDraw(reData){
                    //装配数据
                    reData.forEach(item => {
                        item[attr].forEach((d, i) => {
                            d.angle = axisG[i].rotateAngle
                        });
                        item[attr].push(item[attr][0])
                    });
                    gg.data(reData)  //重新绑定数据
                        .transition()
                        .duration(1000)
                        .attr('d', function (d) {
                            return generateLine(d[attr])
                        })
                }
            }
        }
    }
};
export default {
    selectById
}