import util from '../util/base_util.js'

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
    let tx = model.tx;
    let ty = model.ty;
    let gW = model.gW;
    let gH = model.gH;
    return {
        draw: function (data, config) {
            //因为d3的hierarchy布局默认匹配children，所以把具有阶层关系的转换为children
            let dataString=JSON.stringify(data);
            let hierarchy=config.VC.hierarchy;
            hierarchy.forEach(item=>{
                let reg='\\b'+item+'\\b';
                dataString= dataString.replace(new RegExp(reg,'g'),'children');
            });
            data=JSON.parse(dataString);
            //定义获取具有treeMap结构的数据的方法
            function treeMap() {
                /*
                第一步使用hierarchy更改数据结构，使数据变成nodeTree（节点树）
                */
                let newData = d3.hierarchy(data, function (d) { //返回节点树的根节点，root=newData
                    return !config.VC?d.children:d[config.VC.children] || d.children //定义怎样访问当前节点的子节点，返回一个数组，默认访问children
                });
                //因为要使用层次布局，数据中必须有value属性，所以可以使用count、sort、sum为每个节点添加value属性
                //获取要比较的值
                let value=config.VC.size;
                newData.sum(function (d) {
                    return d[value];
                });//从叶子节点开始计算，下至上
                /*
                * 第二步使用布局方法使数据中的每个节点都有矩形属性（位置、大小）,
                * */
                //获得数布局方法
                //定义一个矩形树状图，根据布局画面大小和数据结构和节点的value给每个节点决定x，y和dx，dy（矩形宽高）
                let getTreeMap = d3.treemap()
                    .size([gW, gH])
                    .padding(1)
                    .round(true);//布局画面大小
                 getTreeMap(newData);
                 return newData;
            }
            data=treeMap();
            let getColor = d3.scaleOrdinal(d3.schemeCategory10);
            //console.log(data);
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
            let gGroups = g.selectAll('g.rectArea')
                .data(data.leaves()) //获取叶子节点，也就是每个市
                .enter()
                .append('g')
                .attr('class', 'rectArea')
                .attr('transform', function (d) {
                    return 'translate(' + d.x0 + ',' + d.y0 + ')'
                });
            gGroups.append('rect')
                .attr('width', function (d) {
                    return d.x1-d.x0
                })
                .attr('height', function (d) {
                    return d.y1-d.y0
                })
                .attr('fill', function (d) {
                    return getColor(d.parent.data.name)//相同省的市的名字一样，颜色也一样
                });
            //判断是否添加文本
            if (config && 'text' in config) {
                gGroups.append('text')
                    .style('font-size',config.text.fontSize)
                    .attr('dy','0.5em')
                    .text(config.text.content)
            }
        }
    }
};
export default {
    selectById
}