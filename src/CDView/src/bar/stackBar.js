import util from '../util/base_util.js'
import dataUtil from '../util/dataUtil.js'

let d3 = require('d3');
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
    //画g
    let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');

    return {
        draw(data, config) {
            //console.log(newData0);
            //因为position的y是这样的 xxx.xxx,所以要把.左右两边分开
            let y = config.VC.position[1].substring(config.VC.position[1].indexOf('.') + 1);
            let s = config.VC.position[1].substring(0,config.VC.position[1].indexOf('.'));
            let cfgColor = config.VC.color.substring(config.VC.color.indexOf('.') + 1);
            //使用d3的stack布局，
            let keys=data[0][s].map(function (d,i) {
               return i
            });
            let getStackData = d3.stack()
                .keys(keys)//指定有几个堆叠层，每个堆叠层表示什么,keys=[0,1,2],b表示对应种类
                .value(function (d,key) {  // 指定怎么访问每条bar的值,key为上面绑定的keys项
                    //console.log(key);
                    return d[s][key][y]
                });
            let newData = getStackData(data);
            //console.log(newData);
            //获得新的堆叠数据，newData中的项(a)表示一个堆叠层，a也是一个数组，a的每一项（b）表示一个bar，b也是一个数组，b的第一项表示bar的起始y位置，第二项表示bar的高度（其实就是value的分布）

            /*
            * 比例尺
            * */
            //bar都是用band，你懂的
            let parseTimeString = d3.timeParse('%Y/%m/%d');
            let scale_x = d3.scaleBand()
                .domain(data.map(function (d) {
                    return parseTimeString(d[config.VC.position[0]]) //使用时间对象作为输入域，这样操作坐标轴时比较好使
                }))
                .range([0,gW])
                .padding(0.1,0.1);
            //  y轴是连续的，所以用线性比例尺
            //  因为转换数据后，最后bar的高度为堆叠层bar的叠加，最后的bar有好几条，所以选出最高的那一条
            //  因为数组最后一项的叠加层最高，所以只需要得到最后叠加层中最高的那一个bar的高度就行，barHeight=y0(起始高度)+y（长度）
            let maxBarHeight = d3.max(newData[newData.length - 1], function (d) {
                return d[0] + d[1]
            });
            // max方法返回数组中最大的值，如果有回调函数作为参数，那么先改变原来原来数组中的每一项值，从得到的新数组中得到最大值（内部用map了）
            let scale_y = d3.scaleLinear()
                .domain([0, maxBarHeight])
                .range([0, gH]);
            //开始画
            // 先分出叠加层，为叠加层添加颜色
            let getColor = d3.scaleOrdinal(d3.schemeCategory10);
            let layers = g.selectAll('g.layer')
                .data(newData)
                .enter()
                .append('g')
                .attr('class', 'layer')
                .attr('fill', function (d,i) {
                    return getColor(i)
                });
            // 每个叠加层中加入矩形
            let rects;
            {
                rects = layers.selectAll('rect')
                    .data(function (d) {
                        return d  //为每一个叠加层绑定不同的数据，输入数据是layer绑定的数据
                    })
                    .enter()
                    .append('rect')
                    .attr('x', function (d) {
                        return scale_x(parseTimeString(d.data[config.VC.position[0]]))
                    })
                    .attr('y', function (d) {
                        return gH - scale_y(d[0] + d[1])
                    })
                    .attr('width', scale_x.bandwidth())
                    .attr('height', function (d) {
                        return scale_y(d[1])
                    })
            }

            //legend
            let category=data[0][s].map(function (d) {
                let obj={};
                obj.name=d[cfgColor];
                return obj
            });
            if ('legend' in config) {
                let addLegend = util.setLegend()
                    .svg(svg)
                    .data(category)
                    .useColor(function (color, config, d,i) {
                        return color(i)
                    })
                    .color(getColor)
                    .content(config.legend.content)
                    .config(config)
                    .model(model);
                addLegend()
            }

            //axis
            let yScale_ = d3.scaleLinear()
                .domain([0, maxBarHeight])
                .range([gH, 0]);
            //默认开启
            let add = util.setAxis()
                .svg(svg)
                .model(model)
                .xScale(scale_x)
                .yScale(yScale_);
            if (config && 'axis' in config && config.axis.show === false) {
                //do Nothing
            } else if (config && 'axis' in config) {
                add.axisConfig(config.axis);
                add();

            } else {
                add()
            }

            //tooltip
            if (config && 'tooltip' in config && config.tooltip) {
                let addTooltip = util.setToolTip(rects)
                    .content(config.tooltip.content);
                addTooltip()
            }
        }
    }
};
export default {
    selectById
}