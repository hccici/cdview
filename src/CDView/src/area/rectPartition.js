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
        draw(data, config) {
            //因为d3的hierarchy布局只能匹配children，所以把具有阶层关系的转换为children
            let dataString=JSON.stringify(data);
            let hierarchy=config.VC.hierarchy;
            hierarchy.forEach(item=>{
                let reg='\\b'+item+'\\b';
                dataString= dataString.replace(new RegExp(reg,'g'),'children');
            });
            data=JSON.parse(dataString);
            // console.log(data);
            //确定开始画的位置,确定g的位置
            let tx = model.tx;
            let ty = model.ty;
            let gW = model.gW;
            let gH = model.gH;
            //画g
            //路径生成器是以g的（0,0）为圆心开始画的
            let g = svg.append('g').attr('transform', 'translate(' + tx + ',' + ty + ')');
            //用d3的pack布局，把不易于布局的数据转换成易于布局的数据
            let newData1 = d3.hierarchy(data, function (d) { //返回节点树的根节点，root=newData
                return !config.VC?d.children:d[config.VC.children] || d.children //定义怎样访问当前节点的子节点，返回一个数组，默认访问children
            });
            //因为要使用层次布局，数据中必须有value属性，所以可以使用count、sort、sum为每个节点添加value属性
            //获取要比较的值

            newData1.count();//从叶子节点开始计算，下至上
            //定义分区布局进行数据转换
            let partitionData = d3.partition()
                .size([gW, gH])
                .padding(1);  //设定转换后图形的范围，这个值很重要，运用得当可变为圆形分区图。

            //查看转换后的数据
            let newData = partitionData(newData1).descendants();//partitionData(data)也可以
            //console.log(newData);
            /*
                        以看到多出了如下属性:
                        x: 矩形起始点位置
                        y: 矩形起始点位置
                        dx: 矩形宽度
                        dy: 矩形高度
                        depth: 节点深度(层级)
                        value: 同一层级权重
            */
            let getColor = d3.scaleOrdinal(d3.schemeCategory10);
            //使用新数据画分区图
            let rectGs = g.selectAll('g.rectPartition')
                .data(newData)
                .enter()
                .append('g')
                .attr('class', 'rectPartition');
            let gg = rectGs.append('rect')
                .attr('x', function (d) {
                    return d.x0
                })
                .attr('y', function (d) {
                    return d.y0
                })
                .attr('width', function (d) {
                    return d.x1-d.x0
                })
                .attr('height', function (d) {
                    return d.y1-d.y0
                })
                .attr('fill', function (d) {
                    return getColor((d.children ? d : d.parent).data.name)//为每个有儿子节点的付新颜色，没有儿子节点的跟它父节点一个色
                });
            //判断是否显示文本
            if (config && 'text' in config) {
                let add= util.setMultiText()
                    .content(config.text.content)
                    .posX(function (d) {
                        return d.x0
                    })
                    .posY(function (d) {
                        return d.y0
                    })
                    .rowMaxWidth(function (d) {
                        return d.x1-d.x0
                    })
                    .fontSize(config.text.fontSize);
                add(gg);
                d3.selectAll('.multiText')
                    .style('text-anchor','start');
            }

        }
    }
};

export default {
    selectById
}