import util from '../util/base_util.js'

let d3 = require('d3');
import d3_sankey from 'sankey'//引入d3的sankey插件
let selectById=function (id) {
    //选择svg
    let d3Id = "#" + id;
    let svg = d3.select(d3Id).select('svg');
    //确定开始画的位置,确定g的位置
    let model = util.getContainerModel(id);
    var height = model.height;
    var width = model.width;
    let tx = model.tx;
    let ty = model.ty;
    //画g
    let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
    return {
        draw(data){
            // 定义桑基布局
            console.log(d3_sankey)
            let sankey = d3_sankey()
                .nodeWidth(80)
                .nodePadding(40)
                .size([width, height])
                .nodes(data.nodes)
                .links(data.links)
                .layout(3);
            // 路径数据生成器
            var path = sankey.link();
            // 绘制连接数据
            var links = svg.append("g").selectAll("path")
                .data(data.links)
                .enter()

// 绑定节点数据
            var nodes = svg.append("g").selectAll(".node")
                .data(data.nodes)
                .enter();

            let color=d3.scale.category20()
// 绘制连接线
            links.append("path")
                .attr({
                    fill: "none",   //填充色
                    stroke: function(d,i){ return color(i); },  //描边色
                    "stroke-opacity": 0.5,  //描边透明度
                    d: path,  //路径数据
                    id: function(d,i){ return 'link' +i }  //ID
                })
                .style("stroke-width", function (d) {  //连线的宽度
                    return Math.max(1, d.dy);
                });

// 绘制圆形节点
            nodes.append("circle")
                .attr("transform",function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .attr("r", function(d) { return d.dy / 2; })
                .attr("cx", function(d) { return d.dx/2; })
                .attr("cy", function(d) { return d.dy / 2; })
                .style("fill", "tomato")
                .style("stroke", "gray");

        }
    }
}
export default {
    selectById
}