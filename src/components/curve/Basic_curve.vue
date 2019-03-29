<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="base_curve_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的折线图
                    </p>
                    <p class="dv_p">
                        表示：
                        00:00-01:20这段时间的降雨量,
                        x轴表示时间，y轴表示降雨量，折线表示，降雨量随时间变化的趋势
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：curve
                    配置选项：
                    1、VC: {
                           position: [x,y]    (指定数据字段映射在x,y方向)
                      }
                    2、line: {
                           lineColor: '#000'  (指定线条的颜色)
                           dots: boolean,     (折点是否为空心圆)
                           area: boolean,     (是否是面积图)
                    }
                </pre>
            </div>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div id="multi_curve_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        多条折线图
                    </p>
                    <p class="dv_p">
                        表示：
                        8月1号到8月5号这几天，每种冰激淋的销量走势。
                        x轴表示时间，y轴表示销量，每条折线代表一种冰激凌
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：multi_curve
                    配置选项：
                    1、VC: {
                          position: [x, y]    (指定数据字段映射在x,y方向),
                          color: 'xx.xx'      (指定线条的颜色根据数据的哪个字段决定)
                    }
                    2、line: {
                          dots: boolean,       (折点是否为空心圆)
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Basic_curve",
        mounted() {
            this.l_base_curve_c();
            this.l_base_curveArea();
        },
        methods: {
            l_base_curve_c() {
                let data = [
                    {value: 10, time: '2015-03-01T16:00:00.000Z'},
                    {value: 15, time: '2015-03-01T16:10:00.000Z'},
                    {value: 26, time: '2015-03-01T16:20:00.000Z'},
                    {value: 9, time: '2015-03-01T16:30:00.000Z'},
                    {value: 12, time: '2015-03-01T16:40:00.000Z'},
                    {value: 23, time: '2015-03-01T16:50:00.000Z'},
                    {value: 18, time: '2015-03-01T17:00:00.000Z'},
                    {value: 21, time: '2015-03-01T17:10:00.000Z'},
                    {value: 22, time: '2015-03-01T17:20:00.000Z'}
                ];
                let config = {
                    VC: {
                        position: ['time', 'value']
                    },
                    line: {
                        dots: true,
                        area: true,
                    },
                    tooltip: {
                        content: function (d) {
                            // console.log(d) //不知道d是什么结构时看一下
                            return (`该时间点的降雨量为：${d.value}`)
                        }
                    },
                    axis: {
                        xTickFormat: function (timeFormat) {
                            //这里使用了d3.timeFormat,具体查看d3时间字符串格式化表
                            return timeFormat('%H:%M')
                        },
                        xTicks: 5,
                        yTicks: 20
                    }
                };
                this.$cdview.curve.selectById('base_curve_c').draw(data, config)
            },
            l_base_curveArea() {
                let data = [
                    {
                        date: '2018/8/1',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 100},
                            {name: '奶油冰激淋', number: 10},
                            {name: '香草冰激淋', number: 198}
                        ]
                    },
                    {
                        date: '2018/8/2',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 88},
                            {name: '奶油冰激淋', number: 24},
                            {name: '香草冰激淋', number: 240}
                        ]
                    },
                    {
                        date: '2018/8/3',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 91},
                            {name: '奶油冰激淋', number: 36},
                            {name: '香草冰激淋', number: 222}
                        ]
                    },
                    {
                        date: '2018/8/4',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 62},
                            {name: '奶油冰激淋', number: 77},
                            {name: '香草冰激淋', number: 167}
                        ]
                    },
                    {
                        date: '2018/8/5',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 50},
                            {name: '奶油冰激淋', number: 88},
                            {name: '香草冰激淋', number: 187}
                        ]
                    }
                ];
                let config = {
                    VC: {
                        position: ['date', 'saleInfo.number'],
                        color: 'saleInfo.name'
                    },
                    line: {
                        dots: true,
                        area: true
                    },
                    tooltip: {
                        content: function (d) {
                            return `${d.date}：<br>
                            草莓冰激淋的销量为：${d.saleInfo[0].number}<br>
                            奶油冰激淋的销量为：${d.saleInfo[1].number}<br>
                            香草冰激淋的销量为：${d.saleInfo[2].number}`
                        }
                    },
                    legend: {
                        content: function (d) {
                            return d[0].name
                        }
                    },
                    axis: {
                        xTickFormat: function (timeFormat) {
                            //这里使用了d3.timeFormat,具体查看d3时间字符串格式化表
                            return timeFormat('%m-%d')
                        },
                        xTicks: 5
                    }
                };
                this.$cdview.multi_curve.selectById('multi_curve_c').draw(data, config)
            }
        }
    }
</script>

<style scoped>

</style>