import util from '../util/base_util.js'
import base_util from "../util/base_util";

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
        //因为在角度方向是连续的，而且是时间所以使用时间比例尺
        let timeParse = d3.timeParse('%Y/%m/%d %H:%M');
        let aScale = d3.scaleTime()
            .domain([timeParse(config.polarAxis.aDomain[0]), timeParse(config.polarAxis.aDomain[1])])
            .range([0, 360]);//0-360度
        //因为在半径方向是连续的线性，所以用线性比例尺
        let rScale = d3.scaleLinear()
            .domain(config.polarAxis.rDomain)
            .range([0, model.gW / 2]); //从g的中心开始画
        let color=d3.scaleOrdinal(d3.schemeCategory10);
        /*
        * 2、开始绘制主要图形
        * */
        let svg = addSvg();
        let g = svg.append('g').attr('transform', 'translate(' + (model.tx + model.gW / 2) + ',' + (model.ty + model.gH / 2) + ')');
        console.log(data);
       let cG= g.append('g')
            .attr('class','polarCircle')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('transform',d=>`rotate(${aScale(timeParse(d[config.VC.angle]))})`)
            .attr('cx',d=>rScale(d[config.VC.radius]))
            .attr('r',10)
            .attr('fill',d=>{
                return color(d[config.VC.color])
            });
        /*
       * 3、添加其它辅助图形和效果
       * */
        //① 极坐标系
        {
            let add = base_util.setPolarAxis()
                .model(model)
                .g(g)
                .polarAxisCfg(config.polarAxis);
            add();
        }
        //② tooltip
        if ('tooltip' in config) {
            let addTooltip = util.setToolTip()
                .graphSelection(cG)
                .content(config.tooltip.content);
            addTooltip()
        }
    };
    return drawer;
};
export default {
    selectById
}