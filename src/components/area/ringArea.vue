<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="ringArea_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的圆环图
                    </p>
                    <p class="dv_p">
                        表示：一天售卖的冰激淋中，每种口味的销量，
                        每块不同颜色的饼代表每种不同口味的冰激凌，
                        块的大小表示冰激凌的销量
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：ringArea
                    配置选项：
                    1、VC: {
                        size: 'value',   (块大小->value)
                        color: 'name'    (块颜色->name)
                    },
                    2、pie: {
                        innerRadius: 50,  (设置圆弧形的内半径，置为0，整个图形变为圆形)
                        outerRadius: 180  (设置圆弧形的外半径)
                    },
                    3、text: {
                        content: function (d) {   (设置图形中显示的文本，d为绑定到块的数据)
                            return `xxx`          (返回字符串模版)
                        },
                        fontSize: 20              (设置文本字体的大小)
                    },
                    4、interactive: false         (是否开启交互，默认开启)
                </pre>
            </div>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div id="nightingale_rose_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        南丁格尔玫瑰图
                    </p>
                    <p class="dv_p">
                        首先了解一下左边图形的含义，
                        每一块圆弧形表示一个手机品牌，它们有着不同的颜色，块的大小
                        表示了这一年该手机品牌的销量。下面将使用CDView绘出这个图形。
                    </p>
                    <el-button @click="drawNRByC(1)">新数据</el-button>
                    <el-button @click="drawNRByC(2)">旧数据</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：nightingale_rose
                    配置选项：
                    1、VC: {
                        size: 'value',   (块大小->value)
                        color: 'name'    (块颜色->name)
                    },
                    2、pie: {
                        innerRadius: 50,  (设置圆弧形的内半径，置为0，整个图形变为圆形)
                        outerRadius: 180  (设置圆弧形的外半径)
                    },
                    3、text: {
                        content: function (d) {   (设置图形中显示的文本，d为绑定到块的数据)
                            return `xxx`          (返回字符串模版)
                        },
                        fontSize: function (d) {  (设置文本字体的大小，可以是固定值，也可以是一个匿名函数)
                            return d.data.value/3
                        }
                    },
                    4、interactive: true         (是否开启交互，默认开启)
                    5、lineTip: {                (默认有，可以设置false来关掉，也可以是一个配置对象)
                        lineColor: '#000'        (配置线的颜色)
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "ringArea",
        methods: {
            drawRingByCDView() {
                let data = [{name: '巧克力', value: 100}, {name: '冰激凌', value: 80}, {name: '烤肠', value: 150}];
                let config = {
                    VC: {
                        size: 'value',
                        color: 'name'
                    },
                    pie: {
                        innerRadius: 50,
                        outerRadius: 180
                    },
                    text: {
                        content: function (d) {
                            return `${d.data.name}/${d.data.value}`
                        },
                        fontSize: 20
                    },
                    tooltip: {
                        content: function (d) {
                            //console.log(d) 不知道d是什么结构时看一下
                            return (d.data.name + '销量为：' + d.value)
                        }
                    },
                    legend: {
                        content: function (d) {
                            return `${d.name}`
                        }
                    },
                    interactive: false
                };
                this.$cdview.ringArea.selectById('ringArea_c').draw(data, config)
            },
            drawNRByC(flag) {
                let data = [
                    {
                        name: '小米',
                        value: 60.8
                    }, {
                        name: '华为',
                        value: 30.8
                    }, {
                        name: '联想',
                        value: 30.4
                    }, {
                        name: '三星',
                        value: 40.8
                    }, {
                        name: '苹果',
                        value: 70.8
                    }, {
                        name: '其他',
                        value: 20.8
                    }];
                let data1 = [
                    {
                        name: '小米',
                        value: 23
                    }, {
                        name: '华为',
                        value: 56
                    }, {
                        name: '联想',
                        value: 77
                    }, {
                        name: '三星',
                        value: 34
                    }, {
                        name: '苹果',
                        value: 10
                    }, {
                        name: '其他',
                        value: 66
                    }];
                let config = {
                    VC: {
                        color: 'name',
                        size: 'value'
                    },
                    pie: {
                        innerRadius: 0,
                        outerRadius: 130,
                    },
                    tooltip: {
                        content: function (d) {
                            //console.log(d) 不知道d是什么结构时看一下
                            return (d.data.name + '销量为：' + d.value + '万台')
                        }
                    },
                    legend: {
                        content: function (d) {
                            return `${d.name}`
                        }
                    },
                    text: {
                        content: function (d) {
                            return d.data.name
                        },
                        fontSize: function (d) {
                            return d.data.value/3
                        }
                    },
                    lineTip: {
                        lineColor: '#ff050c'
                    }
                };
                if (flag===0) {
                    this.update=this.$cdview.nightingale_rose.selectById('nightingale_rose_c').draw(data, config)
                } else if(flag===1){
                    this.update.reDraw(data1);
                } else {
                    this.update.reDraw(data);
                }
            }
        },
        mounted() {
            this.drawRingByCDView();
            this.drawNRByC(0)
        }
    }
</script>

<style scoped>

</style>