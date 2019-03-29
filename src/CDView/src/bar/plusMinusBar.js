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
    //定义一个返回对象（画家）
    const drawer = {};
    drawer.draw = function (data, config) {
        /*
        * 1、根据传递进来的数据和配置选项，定义比例尺
        * */
        //因为x方向的数值是连续的，所以采用线性比例尺
        //获取数据输入范围
        let xDomain = [
            -d3.max(data, function (d) {
                return d[config.VC.minus]
            }),
            d3.max(data, function (d) {
                return d[config.VC.plus]
            })
        ];
        let xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, model.gW]);
        //因为y方向表示时间，但是不是连续的，而是波段的所以使用波段比例尺
        //获取数据输入范围
        let parseTimeString = d3.timeParse('%Y/%m/%d');
        let yDomain = data.map(function (d) {
            return parseTimeString(d[config.VC.date])
        });
        let yScale = d3.scaleBand()
            .domain(yDomain)
            .range([0, model.gH])
            .padding(0.1, 0.1);
        //因为内部也是分段的所以2次使用
        let yScaleInner = d3.scaleBand()
            .domain([0, 1])
            .range([0, yScale.bandwidth()])
            .padding(0.1, 0.2);
        //颜色参数     支出、收入，盈利，亏损
        let color = ['#13ffff','#a094ff','#15ff0b','#ff2435'];
        /*
        * 2、开始绘制主要图形
        * */
        let svg = addSvg();
        let g = svg.append('g').attr('transform', 'translate(' + model.tx + ',' + model.ty + ')')
            .attr('class','chart');
        //用g分组
        let bandsG = g.selectAll('g.band')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'band')
            .attr('transform', d => `translate(0,${yScale(parseTimeString(d[config.VC.date]))})`);
        //添加一个灰色背景
        bandsG.append('rect')
            .attr('width',model.gW)
            .attr('height',yScale.bandwidth())
            .attr('fill','#eeeeee');
        //每组下添加三条bar,收入,支出，结果
        bandsG.append('rect')
            .attr('class',config.VC.plus)
            .attr('x',function () {
                return xScale(0);
            })
            .attr('y',function () {
                return yScaleInner(1)
            })
            .attr('width',function (d) {
                return xScale(d[config.VC.plus])-xScale(0)
            })
            .attr('height',function () {
                return yScaleInner.bandwidth()
            })
            .attr('fill',color[1]);
        bandsG.append('rect')
            .attr('class',config.VC.minus)
            .attr('x',function (d) {
                return xScale(-d[config.VC.minus]);
            })
            .attr('y',function () {
                return yScaleInner(1)
            })
            .attr('width',function (d) {
                return xScale(0)-xScale(-d[config.VC.minus])
            })
            .attr('height',function () {
                return yScaleInner.bandwidth()
            })
            .attr('fill',color[0]);
        bandsG.append('rect')
            .attr('class','result')
            .attr('x',function (d) {
                return d[config.VC.plus]-d[config.VC.minus]>0?xScale(0):xScale(d[config.VC.plus]-d[config.VC.minus]);
            })
            .attr('y',function () {
                return yScaleInner(0)
            })
            .attr('width',function (d) {
                return d[config.VC.plus]-d[config.VC.minus]>0?xScale(d[config.VC.plus])-xScale(d[config.VC.minus]):xScale(d[config.VC.minus])-xScale(d[config.VC.plus]);
            })
            .attr('height',function () {
                return yScaleInner.bandwidth()
            })
            .attr('fill',d=>d[config.VC.plus]-d[config.VC.minus]>0?color[2]:color[3]);

        /*
        * 3、添加其它辅助图形和效果
        * */
        //① axis,默认开启
        {
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
        //② tooltip
        if ('tooltip' in config) {
            let addTooltip = util.setToolTip()
                .graphSelection(bandsG)
                .content(config.tooltip.content);
            addTooltip()
        }
        //③ legend
        if ('legend' in config) {
            let colorData=[
                {id: 0,content: '支出'},
                {id: 1,content: '收入'},
                {id: 2,content: '盈利'},
                {id: 3,content: '亏损'},
                ];
            let addLegend = util.setLegend()
                .svg(svg)
                .data(colorData)
                .useColor(function (color, config, d) {
                    return color[d.id]
                })
                .color(color)
                .content(config.legend.content||function (d) {
                    return d.content
                })
                .config(config)
                .model(model);
            addLegend()
        }

    };
    return drawer;
};
export default {
    selectById
}