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
    let gW = model.gW;
    let gH = model.gH;
    let tx = model.tx;
    let ty = model.ty;
    return {
        draw: function (data, config) {
            //获得具有树布局结构的数据的方法
            function getTree() {
                /*
                第一步使用hierarchy更改数据结构，使数据变成nodeTree（节点树）
                */
                let newData = d3.hierarchy(data, function (d) { //返回节点树的根节点，root=newData
                    return !config.VC?d.children:d[config.VC.children] || d.children //定义怎样访问当前节点的子节点，返回一个数组，默认访问children
                });
                //因为要使用层次布局，数据中必须有value属性，所以可以使用count、sort、sum为每个节点添加value属性
                newData.count();//计算每个当前节点下有多少个后代节点，统计除数量后绑定到当前节点的value属性上，向下执行（每个节点都执行）
                /*
                * 第二步使用布局方法使数据中的每个节点都有位置属性
                * */
                //获得数布局方法
                let tree;
                //不同的布局
                if (config&&'style' in config&&config.style==='ordinary'){
                    tree = d3.tree()
                        .size([model.gW, model.gH]);//配置数布局方法，设置布局宽高
                } else {
                    tree = d3.cluster()
                        .size([model.gW, model.gH]);//配置数布局方法，设置布局宽高
                }
                tree(newData);//使用布局方法为数据的每个节点添加坐标值x,y（默认从上到下）么，并且影响了数据对象的一些方法（links等）
                return newData
            }
            let newData = getTree();
            //定义link生产器，用于生成两点之间的曲线
            let link=d3.linkHorizontal() //source访问器默认 d.source,其他也一样，所以不用配置
                .x(function(d) { return d.y; }) //因为图示从左到右，布局是从上到下，所以想x，y配置是返的
                .y(function(d) { return d.x; });
            /*
            * 开始画
            * */
            //画图表分组轮廓
            let g = svg.append('g')
                .attr("font-family", "sans-serif")
                .attr("font-size", (config.size||10))
                .attr('transform', 'translate(' + tx + ',' + ty + ')');
            //画线
            //console.log(newData.links());
            const links = g.append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)
                .selectAll("path")
                .data(newData.links()) //数据对象中的links方法返回了节点之间的连线数组[{source: Node,target: Node},{}]
                .enter().append("path")
                .attr("d", link);//可以使用svg的曲线画法，也可以使用d3提供的曲线画法，记得newData同时也是root
            //画节点
            //console.log(newData.descendants());
            //节点与文本在一个g
            const nodes = g.append("g")
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .selectAll("g")
                .data(newData.descendants().reverse())//返回当前节点的所有后代节点（一个数组，第一项是当前节点），reverse数组反转
                .enter().append("g")
                .attr("transform", d => `translate(${d.y},${d.x})`);
            //圆
            nodes.append("circle")
                .attr("fill", d => d.children ? "#555" : "#999")
                .attr("r", config.nodeRadius||2.5);
            //圆
            nodes.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d.children ? -6 : 6) //文本在叶子节点右侧，非叶子节点左侧
                .text(d => !config.VC?d.data.name:d.data[config.VC.nodeName]||d.data.name)
                .filter(d => d.children) //通过涮选，新的选择集中只剩符合条件的，选出非叶子节点的text
                .attr("text-anchor", "end")
                .clone(true).lower()     //克隆一份g，做文字效果，白色的文字盖住线条作为文字背景色,lower: 重新插入该元素，并且作为它的父元素的第一项
                .attr("stroke", "white");
        }
    }
};
export default {
    selectById
}