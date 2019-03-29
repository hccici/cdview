/* eslint-disable no-irregular-whitespace */
import util from '../util/base_util.js'
import colorUtil from '../util/colorUtil.js'
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
            let width = model.width;
            let tx = model.tx;
            let ty = model.ty;
            let gW = model.gW;
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
            /*
                    由于 GeoJSON 文件中的地图数据，都是经度和纬度的信息，它们都是三维的。要在网页上显示的是二维的，
                 所以要设定一个投影函数来转换经度纬度。如上所示，我们用 d3.geo.mercator() 的投影方式。关于各种投影方式的函数，
                 可以参考： https://github.com/mbostock/d3/wiki/Geo-Projections
             */
            //定义把三维的json数据转化为二维的工具
            //根据数据的geometry类型不同选择不同的投影方式
            let projection;
            if (config && 'geometry' in config && config.geometry === 'polygon') {
                projection = d3.geoMercator()
                    .center([107, 31]) //center() 函数是用于设定地图的中心位置，[107,31] 指的是经度和纬度。
                    .scale((config.size ? config.size : 0.9) * width) //scale() 函数用于设定放大的比例。
                    .translate([gW / 1.8, gW / 1.8]);
            } else {
                projection = d3.geoAlbersUsa()
                    .scale(width * (config.size ? config.size : 1)) //scale() 函数用于设定放大的比例。
                    .translate([gW / 1.8, gW / 1.8]);
            }
            // 定义地图路径生成器
            let getGEOPath = d3.geoPath()
                .projection(projection);
            let gg = g.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("stroke", function () {
                    if ('map' in config && 'stroke' in config.map) {
                        return config.map.stroke;
                    } else {
                        return colorUtil.mapColors[0].stroke;
                    }
                })
                .attr("stroke-width", 1)
                .attr("fill", function (d, i) {
                    if ('map' in config && 'fill' in config.map) {
                        return config.map.fill;
                    } else {
                        return colorUtil.mapColors[0].fill;
                    }
                })
                .attr('fill-opacity',function () {
                    if ('map' in config && 'fill_opacity' in config.map) {
                        return config.map.fill_opacity;
                    } else {
                        return colorUtil.mapColors[0].fill_opacity;
                    }
                })
                .attr("d", getGEOPath);
            //交互
            if (config && 'interactive' in config && config.interactive === false) {
                // doNothing
            } else {
                gg.on("mouseover", function () {
                    d3.select(this)
                        .attr("fill", "yellow");
                })
                    .on("mouseout", function (d, i) {
                        d3.select(this)
                            .attr("fill", function () {
                                if ('map' in config && 'fill' in config.map) {
                                    return config.map.color;
                                } else {
                                    return colorUtil.mapColors[0].fill;
                                }
                            });
                    })
            }
            //tooltip
            if ('tooltip' in config) {
                let addTooltip = util.setToolTip()
                    .graphSelection(gg)
                    .content(config.tooltip.content);
                addTooltip()
            }
            //是否显示文本
            if (config && 'text' in config && config.text === true) {
                let fontSize = (config.size ? config.size : 0.9) * width / 50;
                let add = util.setMultiText()
                    .content(function (d) {
                        return d.properties.name
                    })
                    .posX(function (d) {
                        return getGEOPath.centroid(d)[0]
                    })
                    .posY(function (d) {
                        return getGEOPath.centroid(d)[1]
                    })
                    .rowMaxWidth(function () {
                        return 100
                    })
                    .fontSize(fontSize);
                add(gg);
            }
            //配置点的大小
            if (config && 'dots' in config) {
                let circle = [];
                data.features.forEach(item => {
                    config.dots.forEach(item2 => {
                        if (item2.name === item.properties.name) {
                            item.dots = item2;
                            circle.push(item)
                        }
                    });
                });
                let maxValue=d3.max(config.dots,function (d) {
                    return d.value;
                });
               let cg= svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')')
                    .selectAll('circle.mapDots')
                    .data(circle)
                    .enter()
                    .append('circle')
                    .attr('class','mapDots')
                    .attr('cx',function (d) {
                        return getGEOPath.centroid(d)[0]
                    })
                    .attr('cy',function (d) {
                        return getGEOPath.centroid(d)[1]
                    })
                    .attr('r',function (d) {
                        return d.dots.value/maxValue*10
                    })
                    .attr('fill',function (d) {
                        return `rgba(255,${d.dots.value},90,0.8)`
                    });

                //dotsTooltip
                if ('dotsTooltip' in config) {
                    let addTooltip = util.setToolTip()
                        .graphSelection(cg)
                        .content(config.dotsTooltip.content);
                    addTooltip()
                }
            }
        }
    }
};
export default {
    selectById
}