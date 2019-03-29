/* eslint-disable no-irregular-whitespace */
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
    return {
        draw(data, config) {
            //转换数据
            let newData = dataUtil.chord(data, config);
            //console.log(newData)
            let groups = newData[0];
            let chords = newData[1];
            //获取画图大小
            let width = model.width;
            let height = model.height;
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            let chord_layout = d3.chord()
                .padAngle(0.03) //弦图扇形环间的间距
                .sortSubgroups(d3.descending)(chords); //定义怎么为数组的组项添加index值（排序），这里为下降，也就是0,1,2,3顺序付给

            /*    矩阵类型数组数据,下面的表示更直观
                         "北京籍"  "上海籍"  "广州籍"  "深圳籍" "香港籍"（）
                 "北京市"   1000    3045　   4567　   1234     3714
                 "上海市"   3214    2000　   2060　   124      3234
                 "广州市"   8761    6545　   3000　   8045     647
                 "深圳市"   3211    1067     3214     4000     1006
                 "香港市"   2146    1034　   6745     4764     5000

                 横向看 北京市中，户籍为格个市的人口分布，和是北京市的人口数量
                 纵向看 北京籍的在各个市的人口分布，和是北京籍的总人口数量*/
            //chord_layout.groups()方法把数据给分成（以例子）5个对象，用来表示北京、上海、深圳等城市的总人口（弦图外环）
            /*
            * [
            * {
            *   starAngle: ****,  圆弧开始画的起始角度
            *   endAngle: ****,   画到的角度
            *   index: 0, 索引
            *   value: 13560  输入数组中的每一个组项数组的组项之和，下面对应类推value=chords[0][0]+chords[0][1]+......代表北京市的总人口
            * },
            * {},{},{},{}]
            * */
            //chord_layout.chords() 方法把数据分成 （以例子）15对象，用来表示各个城市之间的人口关系，某个城市a中其他城市来的人数越多，在a弧站的比例越多（弦图的弦）
            /*
            *[{},
            * {
            * source: {
            *     starAngle: ****,  圆弧开始画的起始角度
            *     endAngle: ****,   画到的角度
            *     index: 1 ,  所在的外环对应索引
            *     value: 1000,   城市b在城市a的人数
            *     subIndex,  子索引在外弧上的位置
            *       },
            * target: {}
            * },
            * {},{},.......]
            * */
            /*console.log(chord_layout.groups());
            console.log(chord_layout.chords());*/

            // 定义圆弧生成器
            let innerRadius = config.arc.innerRadius;
            let outerRadius = config.arc.outerRadius;
            let outer_arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
            //颜色
            let color20 = d3.scaleOrdinal(d3.schemeCategory10);
            // 绘制外部圆弧（即分组，有多少个城市画多少个弦），及绘制城市名称
            {
                let g_outer = g.append("g");
                let arcs = g_outer.selectAll("path")
                    .data(chord_layout.groups)
                    .enter()
                    .append("path")
                    .style("fill", function (d) {
                        return color20(d.index);
                    })
                    .style("stroke", function (d) {
                        return color20(d.index);
                    })
                    .attr("d", function (d) {
                        return outer_arc(d)  //他会自动处理具有startAngle和endAngle的数据
                    });
                //添加文本
                g_outer.selectAll("text")
                    .data(chord_layout.groups)
                    .enter()
                    .append("text")
                    .each(function (d, i) {
                        d.middleangle = (d.startAngle + d.endAngle) / 2;  //text在圆弧的中间位置
                        d.name = groups[i];  //给chord_layout.groups 添加name属性，上行一个套路
                    })
                    .attr("dy", ".35em")
                    .attr("transform", function (d) {
                        return "rotate(" + (d.middleangle * 180 / Math.PI) + ")" +  //上面的g（0,0）圆点在model的中心
                            "translate(0," + -1.0 * (outerRadius + 10) + ")" +
                            ((d.middleangle > Math.PI * 3 / 4 && d.middleangle < Math.PI * 5 / 4) ? "rotate(180)" : "");
                    })
                    .text(function (d) {
                        return d.name;
                    });
                //tooltip
                if (config && 'arc' in config && 'tooltip' in config.arc) {
                    let addToolTip = util.setToolTip(arcs)
                        .content(config.arc.tooltip.content);
                    addToolTip()
                }
            }
            //  定义弦路径生成器
            let inner_chord = d3.ribbon()
                .radius(innerRadius);//范围
            //绘制内部弦（即所有城市人口的来源，4*5/2+5=15条弧）
            {
                let nd= chord_layout;
                nd.forEach(item=>{
                   item.source.name= chord_layout.groups[item.source.index].name;
                   item.target.name= chord_layout.groups[item.target.index].name
                });
                let chordGs = g.append("g")
                    .attr("class", "chord")
                    .selectAll("path")
                    .data(nd)
                    .enter()
                    .append("path")
                    .attr("d", inner_chord) //和用function作用一样，inner_chord自动处理{source: {startAngle :****,endAngle},target: {startAngle :****,endAngle}}的数据
                    .style("fill", function (d) {
                        return color20(d.source.index);
                    });
                //添加tooltip
                if (config && 'chord' in config && 'tooltip' in config.chord)
                {
                    let addToolTip = util.setToolTip(chordGs)
                        .content(config.chord.tooltip.content);
                    addToolTip()
                }
            }
        }
    }
};
export default {
    selectById
}