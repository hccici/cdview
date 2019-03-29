<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="nightingale_rose_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        起步
                    </p>
                    <p class="dv_p">
                        &nbsp;&nbsp;&nbsp;&nbsp;首先了解一下左边图形的含义，
                        每一块圆弧形表示一个手机品牌，它们有着不同的颜色，块的大小
                        表示了这一年该手机品牌的销量。下面将使用CDView绘出这个图形。
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                第一步：

                  1、确定要画的图表，了解图形属性，了解数据结构，了解数据字段在图形上的映射。

                  2、通过上图我们可以看到图形有哪些属性：颜色、大小

                  3、再让我们来看一看下面的数据：
                    let data = [
                    {name: '小米', value: 60.8},
                    {name: '华为', value: 30.8},
                    {name: '联想', value: 30.4},
                    {name: '三星', value: 40.8},
                    {name: '苹果', value: 70.8},
                    {name: '其他', value: 20.8}
                    ];
                   可以看到数据是一个标准的json格式数组（有些图是一个json对象）。

                   4、再让我们看看数据字段到图形属性的映射
                    不同圆弧形的颜色，表示不同的手机品牌，所以：颜色--'name',
                    不同圆弧形的大小，表示不同的销量，所以：大小--'value'

                第二步：
                   配置图表所需信息：
                    let config = {
                    //私有
                    VC: {                  (视觉通道，也就是数据字段到图形属性的映射，不同的图表会有不同，
                                           具体查看不同图表说明)
                        color: 'name',     (颜色--'name')
                        size: 'value'      (大小--'value')
                    },
                    pie: {                 (配置图形属性，不同的图表会有不同，具体查看不同图表说明)
                        innerRadius: 20,   (圆弧形的内半径，当为0时，就是一个圆弧形变成扇形)
                        outerRadius: 130,  (圆弧形的外半径)
                    },
                    text: {                       (配置图形的文本，不同的图表会有不同，具体查看不同图表说明)
                        content: function (d) {   (文本内容)
                            return d.data.name
                        },
                        fontSize: function (d) {   (文本字体大小)
                            return d.data.value / 3
                        }
                    },
                    //公有
                    tooltip: {             (配置提示框,具体查看公用配置)
                        content: function (d) {
                            //console.log(d) 不知道d是什么结构时看一下
                            return (d.data.name + '销量为：' + d.value + '万台')
                        }
                    },
                    legend: {              (配置图例,具体查看公用配置)
                        content: function (d) {
                            return `${d.name}`
                        }
                    }
                };

                 第三步：
                    1、在页面中建一个图表容器，并指定id，大小：
                      &lt;div id="nightingale_rose_c" class="dv_box" :style="{width: '500px', height: '500px'}">&lt;/div>
                    2、如果你在node环境中使用，需要引用CDView：
                      import CDView from './CDView/src/index.js'
                    3、如果你在html中使用，需使用script标签引用：
                       &lt;script src="../src/CDView/dist/CDView.js"> &lt;/script>
                    4、然后使用：
                      CDView.nightingale_rose.selectById('nightingale_rose_c').draw(data, config)
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "start",
        methods: {
            drawNRByC() {
                let data = [
                    {name: '小米', value: 60.8},
                    {name: '华为', value: 30.8},
                    {name: '联想', value: 30.4},
                    {name: '三星', value: 40.8},
                    {name: '苹果', value: 70.8},
                    {name: '其他', value: 20.8}
                    ];
                let config = {
                    VC: {
                        color: 'name',
                        size: 'value'
                    },
                    pie: {
                        innerRadius: 20,
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
                            return d.data.value / 3
                        }
                    },
                    animation: true,
                    lineTip:{
                        lineColor: '#ff3b5b'
                    }
                };
                this.$cdview.nightingale_rose.selectById('nightingale_rose_c').draw(data, config)
            }
        },
        mounted() {
            this.drawNRByC()
        }
    }
</script>

<style scoped>

</style>