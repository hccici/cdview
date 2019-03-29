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
    return {
        draw: function (data, config) {
            //因为d3的hierarchy布局只能匹配children，所以把具有阶层关系的转换为children
            let dataString = JSON.stringify(data);
            let hierarchy = config.VC.hierarchy;
            hierarchy.forEach(item => {
                let reg = '\\b' + item + '\\b';
                dataString = dataString.replace(new RegExp(reg, 'g'), 'children');
            });
            data = JSON.parse(dataString);
            // console.log(data);

            //确定开始画的位置,确定g的位置
            let tx = model.tx;
            let ty = model.ty;
            let gW = model.gW;
            let gH = model.gH;
            //画g
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');

            //用d3的pack布局，把不易于布局的数据转换成易于布局的数据
            let newData = d3.hierarchy(data, function (d) { //返回节点树的根节点，root=newData
                return !config.VC?d.children:d[config.VC.children] || d.children //定义怎样访问当前节点的子节点，返回一个数组，默认访问children
            });
            //因为要使用层次布局，数据中必须有value属性，所以可以使用count、sort、sum为每个节点添加value属性
            //获取要比较的值

            newData.sum(function () {
                return 1;
            });//从叶子节点开始计算，下至上
            let getPackData = d3.pack()
                .size([gW, gH]);  //画布范围
            //输入数据格式为：{name,children: [{}]}
            //pack函数把一个对象当成一个节点，这个对象应该包含name属性，如果有children属性
            //children属性应该是这样的[{},{}....]表示当前节点，下面包含以下节点对象，以此类推
            //pack把json数据转化为node模型后为他添加x（cx），y（cy），r属性，并自动根据size和radius（或者value）为它们生成值
            //size（最大圆不超过此范围）、radius（最小圆半径）、value（为每个圆的value属性赋值，根据值自动适应每个圆的大小）
            //可以看笔记截图node/packArea
            let nodes = getPackData(newData).descendants();
            let circle = g.selectAll('circle')
                .data(nodes)
                .enter()
                .append("circle")
                .attr("fill", "rgb(31, 119, 180)")
                .attr("fill-opacity", "0.4")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", function (d) {
                    return d.r;
                });
            //交互
            if (config && 'interactive' in config && config.interactive === false) {
                // doNothing
            } else {
                circle.on('mouseover', function () {
                    d3.select(this).attr('fill', 'yellow')
                })
                    .on('mouseout', function () {
                        d3.select(this).attr('fill', 'rgb(31, 119, 180)')
                    })
            }
            //最底层显示文本
            let maxDepth = d3.max(nodes, function (d) {
                return d.depth
            });
            if (config && 'text' in config && config.text === true) {
                g.selectAll('text')
                    .data(nodes)
                    .enter()
                    .append('text')
                    .attr('x', function (d) {
                        return d.x
                    })
                    .attr('y', function (d) {
                        return d.y
                    })
                    .text(function (d) {
                        return d.data.name
                    })
                    .attr('fill-opacity', function (d) {
                        if (d.depth === maxDepth) {  //最底层才显示文本
                            return 0.9
                        } else {
                            return 0
                        }
                    })
                    .attr('fill', '#ffffff')
                    .attr('font-size', gH / maxDepth / 30)
                    .attr('text-anchor', 'middle')

            }
        }
    }
};
export default {
    selectById
}