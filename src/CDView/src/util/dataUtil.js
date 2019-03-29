//更改数据结构，使得易于绘图

//转成易于绘制多折线图的数据
let multi_curve = function (data, config) {
    //因为position的y是这样的 xxx.xxx,所以要把.左右两边分开
    let yp = config.VC.position[1].substring(0, config.VC.position[1].indexOf('.'));

    //以例子为说明和定义变量，看saleInfo中有多少种商品
    let number = data[0][yp].length;
    let returnData = [];
    for (let i = 0; i < number; i++) {
        returnData.push([])
    }
    data.forEach((item) => {
        item[yp].forEach((d, i) => {
            d.xPositionO=item.xPositionO;
            d[config.VC.position[0]]=item[config.VC.position[0]];
            returnData[i].push(d)
        })
    });
    return returnData;
};
//转成易于弦布局的数据
let chord=function (data,config) {
    let _arcs=config.VC.arcs;
    let _chordsP=config.VC.chords.substring(0,config.VC.chords.indexOf('.'));
    let _chords=config.VC.chords.substring(config.VC.chords.indexOf('.')+1);
    let arcs=[];
    let chords=[];
    data.forEach((item,i)=>{
        arcs.push(item[_arcs]);
        chords.push([]);
        item[_chordsP].forEach(d=>{
            chords[i].push(d[_chords])
        })
    });
    return [arcs,chords]
};
//转成易于捆图布局的数据
let bundle=function (data,config) {
    let nodes={
        name: 'root',
        children: []
    };
    let lines=[];
    data.forEach(item=>{
        let obj0={};
        obj0.name=item[config.VC.node];
        nodes.children.push(obj0);
        item[config.VC.links].forEach(d=>{
            let obj={};
            obj.source=item[config.VC.node];
            obj.target=d;
            lines.push(obj)
        })
    });
    return [nodes,lines]
};
export default {
    multi_curve,
    chord,
    bundle
}