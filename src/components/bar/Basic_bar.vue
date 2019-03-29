<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="base_bar_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的条形图
                    </p>
                    <p class="dv_p">
                        表示：
                        每种类型游戏的销量，
                        x轴表示游戏类型，y轴表示销量，
                        每一条矩形对应一种游戏类型
                    </p>
                    <el-button @click="draw_byCDView(1)">新数据</el-button>
                    <el-button @click="draw_byCDView(2)">旧数据</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：basic_bar
                    配置选项：
                    1、VC: {
                           position: ['genre','sold'], (x轴->genre .y轴->sold)
                           color: 'genre'              (条颜色->genre)
                      }
                </pre>
            </div>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div id="group_bar" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        组合条形图
                    </p>
                    <p class="dv_p">
                        表示：
                        某个商品在2016、2017、2018年中，每个季度的销量，
                        x轴表示年份，y轴表示销量，每种不同颜色的bar代表一个季度
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：group_bar
                    配置选项：
                    1、VC: {
                          groupName: 'year',      (分组字段名)
                          members: 'quarters',    (指向成员对象数组）
                          memberName: 'quarter',  (成员字段名)
                          memberValue: 'sales',   (成员的值)
                          color: 'quarter'        (指定条根据什么字段来进行配色)
                    }
                </pre>
            </div>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div id="payoff_bar" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        盈利条形图
                    </p>
                    <p class="dv_p">
                        表示：
                        在这个时间段内，收入与开支的对比及结果
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：group_bar
                    配置选项：
                    1、VC: {
                        plus: 'income',   //正方向映射
                        minus: 'pay',     //负方向映射
                        date: 'date'      //时间轴映射
                    },
                    2、legend: {
                        content           //这个content可设置，可不设置，
                                            默认显示[‘支出’，‘收入’，‘盈利’，‘亏损’]
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "Basic_bar",
        methods: {
            //使用cdview画条形图
            draw_byCDView(flag) {
                let data = [
                    {genre: 'Sports', sold: 275},
                    {genre: 'Strategy', sold: 115},
                    {genre: 'Action', sold: 120},
                    {genre: 'Shooter', sold: 350},
                    {genre: 'Other', sold: 150}
                ];
                let data1 = [
                    {genre: 'Sports', sold: 200},
                    {genre: 'Strategy', sold: 123},
                    {genre: 'Action', sold: 234},
                    {genre: 'Shooter', sold: 232},
                    {genre: 'Other', sold: 111}
                ];
                let config = {
                    VC: {  //配置视觉通道(visual channel)
                        position: ['genre', 'sold'], //x轴->genre .y轴->sold
                        color: 'genre' //颜色->genre
                    },
                    tooltip: {
                        content: function (d) {
                            return `genre: ${d.genre},sold: ${d.sold}`
                        }
                    },
                    legend: {
                        content: function (d) {
                            return d.genre
                        },
                        position: 'top'
                    },
                    axis: {
                        yRange: [0, 500]
                    }
                };
                if (flag === 0) {
                    this.update = this.$cdview.basic_bar.selectById('base_bar_c').draw(data, config);
                } else if (flag === 1) {
                    this.update.reDraw(data1);
                } else {
                    this.update.reDraw(data);
                }
            },
            draw_byCDView1() {
                let data = [
                    {
                        'year': 2016,
                        'quarters': [{'quarter': '春季', sales: 500}, {'quarter': '夏季', sales: 343}, {
                            'quarter': '秋季',
                            sales: 234
                        }, {'quarter': '冬季', sales: 560}]
                    },
                    {
                        'year': 2017,
                        'quarters': [{'quarter': '春季', sales: 400}, {'quarter': '夏季', sales: 222}, {
                            'quarter': '秋季',
                            sales: 600
                        }, {'quarter': '冬季', sales: 322}]
                    },
                    {
                        'year': 2018,
                        'quarters': [{'quarter': '春季', sales: 600}, {'quarter': '夏季', sales: 401}, {
                            'quarter': '秋季',
                            sales: 460
                        }, {'quarter': '冬季', sales: 600}]
                    }
                ];
                let config = {
                    VC: {
                        groupName: 'year',
                        members: 'quarters',
                        memberName: 'quarter',
                        memberValue: 'sales',
                        color: 'quarter'
                    },
                    tooltip: {
                        content: function (d) {
                            return `${d.quarter}的销量为：${d.sales}万件`
                        }
                    },
                    legend: {
                        content: function (d) {
                            return `${d.quarter}`
                        },
                        position: 'top'
                    }
                };
                this.$cdview.group_bar.selectById('group_bar').draw(data, config)
            },
            drawPayoff() {
                let data = [
                    {date: '2018/12/01', income: 100, pay: 30},
                    {date: '2018/12/02', income: 230, pay: 90},
                    {date: '2018/12/03', income: 140, pay: 100},
                    {date: '2018/12/04', income: 80, pay: 200},
                    {date: '2018/12/05', income: 200, pay: 110},
                    {date: '2018/12/06', income: 20, pay: 130},
                    {date: '2018/12/07', income: 200, pay: 100},
                ];
                let config={
                    VC: {
                        plus: 'income',
                        minus: 'pay',
                        date: 'date'
                    },
                    tooltip: {
                        content: function (d) {
                            return `支出：${d.pay},收入：${d.income},结果：${d.income-d.pay}`
                        }
                    },
                    axis: {
                        yTickFormat: function (timeFormat) { //y轴的数据是时间类型，所以要指定显示的时间字符串
                            return timeFormat('%m月%d日')
                        }
                    },
                    legend: {
                        content: function(d){
                          return d.id===0?'支出':d.id===1?'收入':d.id===2?'盈利':'亏损'
                        },
                        position: 'top'
                    }
                };
                this.$cdview.plusMinusBar.selectById('payoff_bar').draw(data, config);
            }
        },
        mounted() {
            this.draw_byCDView(0);
            this.draw_byCDView1();
            this.drawPayoff();
        }
    }
</script>

<style scoped>

</style>