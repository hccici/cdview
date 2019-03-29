<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="base_dispersedPoint_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的散点图
                    </p>
                    <p class="dv_p">
                        表示：
                        各个市的人口数与一年的生产总值的关系，x轴表示人口，
                        y轴表示生产总值，每个点表示一个城市，其大小随着y轴位置的增大而变大
                    </p>
                    <el-button @click="drawByCDview(1)">新数据</el-button>
                    <el-button @click="drawByCDview(2)">旧数据</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div id="base_dispersedPoint1_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的散点图（点不同）
                    </p>
                    <p class="dv_p">
                        与上图定义一致，只是使用multi属性，使图形形状变得不一样了
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：basic_dispersedPoint
                    配置选项：
                    1、VC: {
                        position: ['population', 'product'], (x轴->人口，y轴->生产总值)
                        color: 'name',                       (点的颜色->城市名字)
                        size: 'product'                      (点的大小->生产总值)
                    },
                    2、multi: true                           (值为boolean,控制点的样式，默认为气泡)
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Basic_dispersedPoint",
        methods: {
            drawByCDview(flag) {
                let data = [
                    {name: '北京', population: 6000, product: 2820},
                    {name: '上海', population: 5132, product: 2401},
                    {name: '杭州', population: 4000, product: 1622},
                    {name: '南宁', population: 3850, product: 891},
                    {name: '秦皇岛', population: 2001, product: 666}
                ];
                let data1 = [
                    {name: '北京', population: 6000, product: 1500},
                    {name: '上海', population: 5132, product: 3000},
                    {name: '杭州', population: 4000, product: 2000},
                    {name: '南宁', population: 3850, product: 6000},
                    {name: '秦皇岛', population: 2001, product: 5000}
                ];
                let config = {
                    VC: {
                        position: ['population', 'product'],
                        color: 'name',
                        size: 'product'
                    },
                    tooltip: {
                        content: function (d) {
                            // console.log(d) //不知道d是什么结构时看一下
                            return (`${d.name}的人口为: ${d.population}万，生产总值为: ${d.product}亿元`)
                        }
                    },
                    legend: {
                        content: function (d) {
                            return `${d.name}`
                        }
                    },
                    supLine: {
                        content: '我是华泓钧',
                        position: {
                            start: [2100, 1600],
                            end: [6000, 1600]
                        }
                    },
                    axis:{
                        yRange: [0,8000],
                        xRange: [0,7000]
                    }
                };
                if (flag===0) {
                    this.update=this.$cdview.basic_dispersedPoint.selectById('base_dispersedPoint_c').draw(data, config);
                } else if(flag===1){
                    this.update.reDraw(data1);
                } else {
                    this.update.reDraw(data);
                }
            },
            drawByCDview1() {
                let dataset = [
                    {name: '北京', population: 6000, product: 2820},
                    {name: '上海', population: 5132, product: 2401},
                    {name: '杭州', population: 4000, product: 1622},
                    {name: '南宁', population: 3850, product: 891},
                    {name: '秦皇岛', population: 2001, product: 666}
                ];
                let config1 = {
                    VC: {
                        position: ['population', 'product'],
                        color: 'name',
                        size: 'product'
                    },
                    multi: true,
                    tooltip: {
                        content: function (d) {
                            // console.log(d) //不知道d是什么结构时看一下
                            return (`${d.name}的人口为: ${d.population}万，生产总值为: ${d.product}亿元`)
                        }
                    },
                    legend: {
                        content: function (d) {
                            return `${d.name}`
                        }
                    },
                    supLine: {
                        content: 'dshdsd sd',
                        position: {
                            start: [2100, 1600],
                            end: [6000, 1600]
                        }
                    }
                };
                this.$cdview.basic_dispersedPoint.selectById('base_dispersedPoint1_c').draw(dataset, config1);
            }
        },
        mounted() {
            this.drawByCDview(0);
            this.drawByCDview1();
        }
    }
</script>

<style scoped>

</style>