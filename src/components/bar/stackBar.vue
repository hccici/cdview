<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="stackBar_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的堆栈图(更新中)
                    </p>
                    <p class="dv_p">
                        表示：
                        每种冰激淋在8月1号到8月5号当天的销量及总数，
                        x轴表示时间，y轴表示当天的销量总量，每一种颜色的bar，代表一种冰激凌
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：stackBar
                    配置选项：
                    1、VC: {
                           position: ['date', 'saleInfo.number'], (data->x轴，saleInfo.number->y轴)
                           color: 'saleInfo.name'                 (根据saleInfo.number确定每种冰激凌的条的颜色)
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "stackBar",
        methods: {
            drawByCDView() {
                let data = [
                    {
                        date: '2018/8/01',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 100},
                            {name: '奶油冰激淋', number: 10},
                            {name: '香草冰激淋', number: 198}
                        ]
                    },
                    {
                        date: '2018/8/02',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 88},
                            {name: '奶油冰激淋', number: 24},
                            {name: '香草冰激淋', number: 240}
                        ]
                    },
                    {
                        date: '2018/8/03',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 91},
                            {name: '奶油冰激淋', number: 36},
                            {name: '香草冰激淋', number: 222}
                        ]
                    },
                    {
                        date: '2018/8/04',
                        saleInfo: [
                            {name: '草莓冰激淋', number: 62},
                            {name: '奶油冰激淋', number: 77},
                            {name: '香草冰激淋', number: 167}
                        ]
                    },
                    {
                        date: '2018/8/05',
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
                    legend: {
                        content: function (d) {
                            return d.name
                        }
                    },
                    tooltip: {
                        content: function (d) {
                            // console.log(d) //不知道d是什么结构时看一下
                            return (`${d.data.date}:<br>
                            ${d.data.saleInfo[0].name}的销量为：${d.data.saleInfo[0].number}个<br>
                            ${d.data.saleInfo[1].name}的销量为：${d.data.saleInfo[1].number}个<br>
                            ${d.data.saleInfo[2].name}的销量为：${d.data.saleInfo[2].number}个<br>
                            `)
                        }
                    },
                    axis: {
                        xTickFormat: function (timeFormat) {
                            return timeFormat('%m-%d')
                        }
                    }
                };
                this.$cdview.stackBar.selectById('stackBar_c').draw(data, config);
            }
        },
        mounted() {
            this.drawByCDView()
        }
    }
</script>

<style scoped>

</style>