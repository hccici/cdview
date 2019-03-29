let d3=require('d3');

//倒三角布局
let inverted_triangle = function () {
    let width;
    let height;
    let sortBy;
    let minWidth;

    //转换数据函数对象，data要转换的数据
    function convert(data_) {
        //注意为了不影响原来的数据，我们应该创建一个新的对象，这个对象具有原来数据的所有属性
        let data=[];
        data_.forEach(item=>{
           data.push(item)
        });
        //首先给data排序,大到小（冒泡）
        for (let i = 0; i <= data.length - 2; i++) {
            for (let j = i + 1; j <= data.length - 1; j++) {
                if (sortBy(data[i]) < sortBy(data[j])) {
                    let temp = data[i];
                    data[i] = data[j];
                    data[j] = temp;
                }
            }
        }
        // console.log(data)
        //计算布局数据
        let zoneNum = data.length;
        let rHeight = 0.8 * height;
        let rWidth = 0.8 * width;
        let zoneHeight = rHeight / zoneNum;
        let gHeight = 0.9 * zoneHeight;
        let padding = 0.1 * zoneHeight;
        //重构新数据
        //得到某一层的button值
        function getButton(i) {
            return (rWidth - minWidth) * ((zoneNum - i) / zoneNum) + minWidth
        }

        let newData = [];
        for (let i = 0; i < data.length; i++) {
            let object = {
                data: data[i],
                button: getButton(i),
                top: getButton(i + 1),
                height: gHeight,
                padding: padding,
                position: [
                    [(rWidth - getButton(i)) / 2, (i * zoneHeight)],
                    [(rWidth - getButton(i)) / 2 + getButton(i), (i * zoneHeight)],
                    [(rWidth - getButton(i + 1)) / 2 + getButton(i + 1), (i * zoneHeight) + gHeight],
                    [(rWidth - getButton(i + 1)) / 2, (i * zoneHeight) + gHeight]

                ]
            }
            //获取质心
            object.centroid = function () {
                return [(((rWidth - getButton(i)) / 2) + ((rWidth - getButton(i)) / 2 + getButton(i))) / 2, ((i * zoneHeight) + ((i * zoneHeight) + gHeight)) / 2]
            };
            newData.push(object)
        }
        return newData

    }

    //设置排序依据，f为一个函数，要求返回数值
    convert.sortBy = function (f) {
        sortBy = f
        return convert
    }
    //设置布局范围,array是一个宽高语义的数组,[width,height]
    convert.size = function (array) {
        width = array[0];
        height = array[1];
        return convert
    }
    convert.minWidth = function (d) {
        minWidth = d;
        return convert
    }
    return convert
};
//甘特图布局
let gantt = function () {
    //布局选项
    let width;
    let height;
    //转换方法对象
    function convert(data,config) {
        let newData=[];
        //把数据中的startTime和endTime字符串转化为js的时间对象并保存newData在sto和eto中
        data.forEach((item)=>{
            let sStartTime= item[config.VC.startTime];
            let sEndTime=item[config.VC.endTime];
            let oStartTime=new Date(sStartTime);
            let oEndTime=new Date(sEndTime);
            let obj={};
            obj.data=item;
            obj.sto=oStartTime;
            obj.eto=oEndTime;
            newData.push(obj)
        });
        //取出最大结束时间和最小开始时间
        let maxT;
        let minT;
        newData.forEach((item)=>{
            //初始化
            if(maxT===undefined&&minT===undefined){
                maxT=item.eto;
                minT=item.sto;
            }else {
                //比较
                if (maxT<item.eto) {
                    maxT=item.eto;
                }
                if (minT>item.sto){
                    minT=item.sto
                }
            }
        });
        //定义时间比例尺，确定bar的x位置，以及bar宽度
        let timeScale = d3.scaleTime()
            .domain([minT,maxT])
            .range([0,width]);
        //使用比例尺得到bar的x位置，得到bar的宽度,保存到newData中
        newData.forEach(item=>{
            item.x=timeScale(item.sto);
            item.barWidth=timeScale(item.eto)-timeScale(item.sto);
        });
        //定义序数比例尺
        //用于比例尺
        let names=[];
        newData.forEach((item)=>{
            names.push(item.data[config.VC.taskName])
        });
        let bandsScale=d3.scaleBand()
            .domain(names)
            .range([0,height])
            .padding(0.3,0.3);
        //使用比例尺给bar添加y位置，以及bar的高度
        newData.forEach(item=>{
            item.y=bandsScale(item.data[config.VC.taskName]);
            item.barHeight=bandsScale.bandwidth()
        });
        //把比例尺保存到newData里面去
        newData.xScale=timeScale;
        newData.yScale=bandsScale;

        return newData;
    }
    convert.size=function (size) { //size: [width,height]
        width=size[0];
        height=size[1];
        return convert
    }
    return convert
}

export default {
    inverted_triangle,
    gantt
}