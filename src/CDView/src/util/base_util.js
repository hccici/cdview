let d3 = require('d3');

//获取容器模型
let getContainerModel = function (id) {
    let height = document.getElementById(id).offsetHeight;
    let width = document.getElementById(id).offsetWidth;
    let tx = width * 0.15;
    let ty = height * 0.2;
    let gW = width - 2 * tx;
    let gH = height - 2 * ty;
    return {
        width,
        height,
        tx,
        ty,
        gW,
        gH
    }
};

//把[[x,y]]结构改成[{x: '',y: ''}]
let array2xy = function (data, scale_x, scale_y) {
    let xyData = [];
    data.forEach(function (item, i) {
        let temp = {x: scale_x(i), y: scale_y(item)};
        xyData.push(temp)
    });
    return xyData
};

/*把数据结构为[{source: 'xxx',target: 'xxx'},{},.....]，'xxx'与object中的name属性值对应
改成[{source: object,target: object},{},.....]*/
let stringST2ObjectST = function (stringST, nodes, config) {  //nodes为经过层级布局后的数据
    //定义一个名字到对象的映射
    let hash = {};
    for (let i = 0; i < nodes.length; i++) {
        hash[nodes[i][config.VC.node]] = nodes[i]
    }
    let objectST = [];
    for (let i = 0; i < stringST.length; i++) {
        objectST.push({source: hash[stringST[i].source], target: hash[stringST[i].target]})
    }
    return objectST;
};

// 添加显示多行文本text
/*
* 配置选项
	graphSelection,			//图形选择集
	content, 				//一个方法，定义显示的内容
	posX, 				//文本的x坐标
	posY, 				//文本的y坐标
	rowMaxWidth, 				//每一行的宽度，单位为像素
	fontSize, 			//文字的大小（可省略），默认为 14
	fontFamily			//文字的字体（可省略），默认为 simsun, arial

*/
function setMultiText() {
    //供add方法使用的配置选项
    let _graphSelection;
    let _fontSize = function () {
        return 14
    }; //字体没有设置的话，默认大小为14px
    let _fontFamily = "simsun, arial"; //默认 "simsun, arial"
    let _rowMaxWidth = function () {
        return 20
    };//默认为20px
    let _content;//要显示的内容 方法 参数 d，匹配的对应图形数据
    let _posX;//要显示的位置x轴 方法 参数 d，匹配的对应图形数据
    let _posY;//要显示的位置y轴 方法 参数 d，匹配的对应图形数据
    //返回语义为换好行后的字符串数组['str1','str2',.....]
    function splitByLine(str, max, fontSize) {
        let curLen = 0;
        let result = [];
        let start = 0, end = 0;
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            let pixelLen = code > 255 ? fontSize : fontSize / 2;// 字母宽度为fontsize的一半，一个中文字符为一个fontsize
            curLen += pixelLen;
            if (curLen > max) {
                end = i;
                result.push(str.substring(start, end)); // 没把长出来的加入
                start = i;
                curLen = pixelLen;// 注意，要把长出来的字符加给下一行
            }
            if (i === str.length - 1) {  //要把末尾行加入
                end = i;
                result.push(str.substring(start, end + 1));
            }
        }
        return result;
    }

    //判断是否为函数
    function isFunction(it) {
        return Object.prototype.toString.call(it) === '[object Function]';
    }

    let gp;
    let mulText;
    //add方法，在graphSelection的同级中加入基本样式的text，返回text d3选择集，可以针对不同的图形，在做具体修改
    function addMultiText(graphSelection) {
        if (graphSelection) {
            _graphSelection = graphSelection;
        }
        _graphSelection.each(function (d) {
            //把一行字符串，根据设置的一行最大宽度和字体大小，得到字符串数组[string,string,...]
            let strs = splitByLine(_content(d), _rowMaxWidth(d), isFunction(_fontSize) ? _fontSize(d) : _fontSize);
            //获取该元素的父元素，并用d3来操作父元素
            gp = d3.select(this.parentNode);
             mulText = gp.append("text") //添加text，text与图形是兄弟节点
                .attr('class', 'multiText')
                .attr("x", _posX(d))
                .attr("y", _posY(d))
                .style("font-size", isFunction(_fontSize) ? _fontSize(d) : _fontSize)
                .style("font-family", _fontFamily);
            //写入换行数据
            mulText.selectAll("tspan")
                .data(strs)
                .enter()
                .append("tspan")
                .attr("x", mulText.attr("x"))
                .attr("dy", "1em")
                .text(function (d) {
                    return d;
                });
        });
    }

    //注册配置选项的方法
    addMultiText.fontSize = function (fontSize) {
        _fontSize = fontSize;
        return addMultiText
    };
    addMultiText.fontFamily = function (fontFamily) {
        _fontFamily = fontFamily;
        return addMultiText
    };
    addMultiText.rowMaxWidth = function (rowMaxWidth) {
        _rowMaxWidth = rowMaxWidth;
        return addMultiText
    };
    addMultiText.content = function (content) {
        _content = content;
        return addMultiText
    };
    addMultiText.posX = function (posX) {
        _posX = posX;
        return addMultiText
    };
    addMultiText.posY = function (posY) {
        _posY = posY;
        return addMultiText
    };
    addMultiText.graphSelection = function (graphSelection) {
        _graphSelection = graphSelection;
        return addMultiText
    };

    return addMultiText
}

//添加提示框tooltip
/*
配置选项：
1、* graphSelection： 要使用tooltip的图形选择集
2、* content（d）:  设置内容的方法 参数 d为data中的一项，返回 字符串
要传递过来的实参函数有两个形参，分别是tooltip选择集，和绑定到g的数组中的一项数据，上面会调用这个方法传入具体的值
*/
function setToolTip(graphSelection, content) {
    //配置项
    let _graphSelection = graphSelection;
    let _content = content;

    function addToolTip() {
        //首先在body中添加一个div.tooltip,并且不透明度为0
        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0.0)

        /*当图形选择集中的某个图形发生以下事件时操作tooltip
    mouseover 更改div里的文本内容，改变div的位置，改变不透明度
    mousemove 改变div的位置
    mouseout 改变不透明度*/
        _graphSelection.on('mouseover.tooltip', function (d) { //注意同一个元素如果在多个地方都监听了一个事件，上一个的监听回调函数会被最近的覆盖，所以要加一个命名空间
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("opacity", 1.0)
                .html(_content(d))
        })
            .on('mousemove.tooltip', function () {
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px");
            })
            .on('mouseout.tooltip', function () {
                tooltip.style("opacity", 0.0)
                    .style("left", 0 + "px")
                    .style("top", 0 + "px");

            })
    }

    addToolTip.content = function (content) {
        _content = content;
        return addToolTip
    };
    addToolTip.graphSelection = function (graphSelection) {
        _graphSelection = graphSelection;
        return addToolTip
    };

    return addToolTip
}

//添加辅助直线supLine
/*
* 配置选项：
* 1、content： 线的标题
* 2、fontSize： 字体大小，默认14
* 3、lineSize： 线的颜色
* 4、position： 线的位置 {start :[x,y],end: [x,y]}
* 5、xScale： 图表使用的比例尺
* 6、yScale：图表使用的比例尺
* 7、gSelection ： 图表第一个g
* */
function setSupLine() {
    let _content;
    let _fontSize;
    let _lineSize;
    let _position;
    let _xScale;
    let _yScale;
    let _gSelection;

    function addSupLine() {
        //用比例尺修改坐标数据
        _position.start[0] = _xScale(_position.start[0]);
        _position.start[1] = _yScale(_position.start[1]);
        _position.end[0] = _xScale(_position.end[0]);
        _position.end[1] = _yScale(_position.end[1]);

        let supLine = _gSelection.append('g');
        //画线_
        supLine.append('line')
            .attr('x1', _position.start[0])
            .attr('y1', _position.start[1])
            .attr('x2', _position.end[0])
            .attr('y2', _position.end[1])
            .style('stroke', '#000')
            .style('fill', 'none')
            .style('stroke', _lineSize ? _lineSize : 1)//线粗细默认为1
        //添加文本
        supLine.append('text')
            .attr('x', _position.end[0])
            .attr('y', _position.end[1])
            .style('text-anchor', 'middle')
            .style('font-size', (_fontSize ? _fontSize : 14))//字体大小默认为14
            .style('color', '#000')
            .text(_content)
    }

    addSupLine.content = function (content) {
        _content = content;
        return addSupLine
    };
    addSupLine.fontSize = function (fontSize) {
        _fontSize = fontSize;
        return addSupLine
    };
    addSupLine.lineSize = function (lineSize) {
        _lineSize = lineSize;
        return addSupLine
    };
    addSupLine.position = function (position) {
        _position = position;
        return addSupLine
    };
    addSupLine.xScale = function (xScale) {
        _xScale = xScale;
        return addSupLine
    };
    addSupLine.yScale = function (yScale) {
        _yScale = yScale;
        return addSupLine
    };
    addSupLine.gSelection = function (gSelection) {
        _gSelection = gSelection;
        return addSupLine
    };
    return addSupLine
}

//计算字符串长度
function computeStringSize(str, fontSize) {
    let size = 0;
    for (let i = 0; i < str.length; i++) {
        //判断英文中文
        if (str.charCodeAt(i) > 255) {
            size += fontSize
        } else {
            size += (fontSize / 2)
        }
    }
    return size
}

//添加图例
/*
* 配置项（*为必选）
*  1、* svg: d3选中svg的对象
*  2、* data: 布局数据或者原先数据（注意！根据数据的不同添加文本和颜色的方法也不同）
*  3、* color： 颜色比例尺
*  4、* useColor(color,config,d,i) 使用颜色的方法，color为颜色比例尺，d为data中的一项，i为索引,config: 使用者传过来的配置项, ，return '#xxxx'
*  5、* content(d) 怎样显示文本的方法， d为data中的一项数据，return ‘要显示的文本’
*  6.* config : 使用者传过来的配置项
*  7.* model : 容器模型
* */
function setLegend(svg, data, color, useColor, setText, config, model) {
    let _svg = svg;
    let _data = data;
    let _color = color;
    let _useColor = useColor;
    let _setText = setText;
    let _config = config;
    let _model = model;

    function addLegend() {
        //计算内容长度,并付给data
        _data.forEach(item => {
            item.strSize = computeStringSize(_setText(item), 14)
        });
        //定义legend
        let legend = _svg.append('g')
            .attr('class', 'cdv_legend')
            .attr('transform', 'translate(10,20)');
        let circles = legend.selectAll('circle')
            .data(_data)
            .enter()
            .append('circle');
        let plx = 0;
        let lx = 0;
        circles.attr('cx', function (d) {
            plx = lx;
            lx += (30 + d.strSize);
            return plx;
        })
            .attr('r', 5)
            .style('fill', function (d, i) {
                return _useColor(_color, _config, d, i)
            });
        plx = 0;
        lx = 0;
        legend.selectAll('text')
            .data(_data)
            .enter()
            .append('text')
            .attr('class', 'legend_text')
            .attr('x', function (d) {
                plx = lx;
                lx += (30 + d.strSize);
                return plx;
            })
            .style('text-anchor', 'start')
            .attr('dx', '0.4em')
            .attr('dy', '0.3em')
            .text(function (d) {
                return _setText(d)
            })
        //设置legend的位置
        if (!('position' in _config.legend) && !(_config.legend.position === 'top')) {
            //默认左下角
            legend.attr('transform', 'translate(' + (0.5 * _model.tx) + ',' + (_model.height - _model.ty * 0.3) + ')')
        } else {
            //上方
            legend.attr('transform', 'translate(' + (0.5 * _model.tx) + ',' + (_model.ty * 0.3) + ')')
        }
    }

    addLegend.svg = function (svg) {
        _svg = svg;
        return addLegend
    };
    addLegend.data = function (data) {
        _data = data;
        return addLegend
    };
    addLegend.color = function (color) {
        _color = color;
        return addLegend
    };
    addLegend.useColor = function (useColor) {
        _useColor = useColor;
        return addLegend
    };
    addLegend.content = function (setText) {
        _setText = setText;
        return addLegend
    };
    addLegend.config = function (config) {
        _config = config;
        return addLegend
    };
    addLegend.model = function (model) {
        _model = model;
        return addLegend
    };

    return addLegend
}

//添加坐标系
/*
* 配置项：
*   1、model: 容器模型
*   2、svg: d3选中svg的对象
*   3、xScale: x轴比例尺
*   4、yScale: y轴比例尺
*   5、axisConfig: 坐标轴配置对象
* */
function setAxis() {
    //配置选项
    let _model;
    let _svg;
    let _xScale;
    let _yScale;
    let _axisConfig;

    //核心方法
    function addAxis() {

        /*
        * 1、使用d3的axis路径生成器得到坐标轴路径对象
        * */
        let x_axis, y_axis;
        if (_axisConfig && _axisConfig.xAxisPosition === 'top') {
            x_axis = d3.axisTop(_xScale)
        } else {
            x_axis = d3.axisBottom(_xScale)
        }
        if (_axisConfig && _axisConfig.yAxisPosition === 'right') {
            y_axis = d3.axisRight(_yScale)
        } else {
            y_axis = d3.axisLeft(_yScale)
        }

        /*
        * 2、配置坐标轴刻度样式，没有的话使用d3默认的：
        * */
        //配置刻度文本样式
        if (_axisConfig && 'xTickFormat' in _axisConfig) {
            //这里使用了d3.timeFormat,具体查看d3时间字符串格式化表
            x_axis.tickFormat(_axisConfig.xTickFormat(d3.timeFormat))
        }
        if (_axisConfig && 'yTickFormat' in _axisConfig) {
            //这里使用了d3.timeFormat,具体查看d3时间字符串格式化表
            y_axis.tickFormat(_axisConfig.yTickFormat(d3.timeFormat))
        }
        //ticks(刻度多少)
        if (_axisConfig && 'xTicks' in _axisConfig) {
            x_axis.ticks(_axisConfig.xTicks)
        }
        if (_axisConfig && 'yTicks' in _axisConfig) {
            y_axis.ticks(_axisConfig.yTicks)
        }
        //画g，画坐标，在g添加坐标轴对象
        let xTrans = (_axisConfig && _axisConfig.xAxisPosition === 'top') ? _model.ty : (_model.gH + _model.ty);
        let g_x = _svg.append('g')
        //x轴位置，默认，在下，通过_axisConfig.xAxisPosition设置top可指定在上
            .attr('transform', 'translate(' + _model.tx + ',' + xTrans + ')')
            .attr('class', 'cd_xy_axis')
            .call(x_axis);

        let yTrans = (_axisConfig && _axisConfig.yAxisPosition === 'right') ? (_model.tx + _model.gW) : _model.tx;
        let g_y = _svg.append('g')
        //y轴位置，默认，在左，通过_axisConfig.yAxisPosition设置right可指定在右
            .attr('transform', 'translate(' + yTrans + ',' + _model.ty + ')')
            .attr('class', 'cd_xy_axis')
            .call(y_axis);

        //画网格
        if (_axisConfig && 'grid' in _axisConfig) {
            if (_axisConfig.grid === true) {
                g_x.selectAll('g')
                    .append("line")
                    .classed("grid-line", true)
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", _axisConfig.xAxisPosition === 'top' ? _model.gH : -(_model.gH));
                g_y.selectAll('g')
                    .append("line")
                    .classed("grid-line", true)
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", _axisConfig.yAxisPosition === 'right' ? -(_model.gW) : _model.gW)
                    .attr("y2", 0);
            }
        }
        //坐标轴title
        if (_axisConfig && 'title' in _axisConfig) {
            //y轴title内容
            if (_axisConfig.title.yContent) {
                let c = _axisConfig.title.yContent;
                g_y.append('text')
                    .attr('class', 'yAxisTitle')
                    .attr("transform", "rotate(90)")//text旋转-90°
                    .attr("text-anchor", "start")//字体尾部对齐
                    .attr("dy", "3.5em")//沿y轴平移一个字体的大小
                    .text(c)
            }
            //x轴title内容
            if (_axisConfig.title.xContent) {
                let c = _axisConfig.title.xContent;
                g_x.append('text')
                    .attr('class', 'xAxisTitle')
                    .attr("text-anchor", "start")//字体尾部对齐
                    //根据坐标轴的位置调整位置
                    .attr('dy', _axisConfig.xAxisPosition === 'top' ? '-3em' : '3em')
                    .attr('dx', (2 / 3) * _model.gW)
                    .text(c)
            }
        }

        //返回x、y轴d3选择集数组[x,y]
        return [g_x, g_y]
    }

    //选项设置
    addAxis.model = function (model) {
        _model = model;
        return addAxis
    };
    addAxis.svg = function (svg) {
        _svg = svg;
        return addAxis
    };
    addAxis.xScale = function (xScale) {
        _xScale = xScale;
        return addAxis
    };
    addAxis.yScale = function (yScale) {
        _yScale = yScale;
        return addAxis
    };
    addAxis.axisConfig = function (axisConfig) {
        _axisConfig = axisConfig;
        return addAxis
    };

    return addAxis
}

//添加极坐标系
/*配置项：
* 1、
* */
function setPolarAxis() {
    //配置选项
    let _model;
    let _g;
    let _polarAxisCfg;

    //核心方法
    function addPolarAxis() {
        let polarG = _g.append('g')
            .lower()
            .attr('class', 'polarAxis');

        //1、添加半径部分
        let rData = d3.range(_polarAxisCfg.rTicks - 1)
            .map(function (d) {
                return [(d + 1) * _model.gW / 2 / (_polarAxisCfg.rTicks - 1), ((d + 1) * (_polarAxisCfg.rDomain[1] - _polarAxisCfg.rDomain[0]) / (_polarAxisCfg.rTicks - 1))]
            });
        let rG = polarG.append('g')
            .attr('class', 'polarAxis_r');
        //圆
        rG.selectAll('circle')
            .data(rData)
            .enter()
            .append('circle')
            .attr('x', 0)
            .attr('y', 0)
            .attr('r', function (d) {
                return d[0]
            });
        //text
        rG.selectAll('text')
            .data(rData)
            .enter()
            .append('text')
            .attr("y", function (d) {
                return -d[0] - 2;
            })
            .attr("transform", "rotate(20)")
            .style("text-anchor", "middle")
            .style('font-size', 10)
            .text(function (d) {
                return d[1];
            });

        //2、添加角度部分
        let timeParse = d3.timeParse('%Y/%m/%d %H:%M');
        let t = ((timeParse(_polarAxisCfg.aDomain[1]) - timeParse(_polarAxisCfg.aDomain[0])) / (_polarAxisCfg.aTicks - 1));
        let aData = d3.range(_polarAxisCfg.aTicks - 1)
            .map(function (d) {
                return [(d + 1) * (360 / (_polarAxisCfg.aTicks - 1)), new Date(timeParse(_polarAxisCfg.aDomain[0]).getTime() + (d + 1) * t)]
            });
        let aG = polarG.append('g')
            .attr('class', 'polarAxis_a');
        //线
        let aGG = aG.selectAll('g')
            .data(aData)
            .enter()
            .append('g')
            .attr("transform", function (d) {
                return "rotate(" + d[0] + ")";
            });
        aGG.append('line')
            .attr('x2', _model.gW / 2);
        //text
        let timeFormat=d3.timeFormat('%H:%M');
        aGG.append('text')
            .style("text-anchor", function (d) {
                return d[0] < 270 && d[0] > 90 ? "end" : null;
            })
            .attr("transform", function (d) {
                 return d[0] < 270 && d[0] > 90 ? "rotate(180 " + (_model.gW / 2 ) + ",0)" : null;
            })
            .attr('x', _model.gW / 2)
            .text(function (d) {
                return timeFormat(d[1])
            });

    }

    //选项设置
    addPolarAxis.model = function (model) {
        _model = model;
        return addPolarAxis
    };
    addPolarAxis.g = function (g) {
        _g = g;
        return addPolarAxis
    };
    addPolarAxis.polarAxisCfg = function (polarAxisCfg) {
        _polarAxisCfg = polarAxisCfg;
        return addPolarAxis
    };

    return addPolarAxis
}

//选择容器
/*
*  配置项： 1、id: 容器id。
*         2、container 容器模型
* */
function selectContainerAddSvg() {
    let _id;
    let _model;

    function add() {
        let container = d3.select("#" + _id);
        let height = _model.height;
        let width = _model.width;
        let _svg = container.append('svg').attr('width', width).attr('height', height);
        return _svg
    }

    add.id = function (id) {
        _id = id;
        return add
    };
    add.model = function (model) {
        _model = model;
        return add
    };
    return add
}

export default {
    getContainerModel,
    array2xy,
    stringST2ObjectST,
    setMultiText,
    setToolTip,
    setSupLine,
    setLegend,
    setAxis,
    selectContainerAddSvg,
    setPolarAxis
}