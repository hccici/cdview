<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="polarPoint" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        极坐标点图
                    </p>
                    <p class="dv_p">
                        表示：
                        在极坐标系中，任意位置可由一个夹角和一段相对原点（极点）的距离表示。也就是说，我们可以用 (angle,r) 来表示极坐标系中的点。
                        下图随机抽取了双十一那天小米和华为手机在每个时间段的销量
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：polarPoint
                    配置选项：
                    1、VC: {
                        angle: 'date',  // 角度表示时间
                        radius: 'sale',  //半径表示销量
                        color: 'name'
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "polarPoint",
        methods: {
            drawByc() {
                let data=[
                    {name: '小米',date: '2018/11/11 16:20',sale: '120'},
                    {name: '小米',date: '2018/11/11 18:30',sale: '236'},
                    {name: '小米',date: '2018/11/11 20:10',sale: '191'},
                    {name: '小米',date: '2018/11/11 00:20',sale: '161'},
                    {name: '华为',date: '2018/11/11 12:30',sale: '123'},
                    {name: '小米',date: '2018/11/11 00:50',sale: '143'},
                    {name: '小米',date: '2018/11/11 10:30',sale: '200'},
                    {name: '华为',date: '2018/11/11 19:20',sale: '230'},
                    {name: '小米',date: '2018/11/11 17:00',sale: '210'},
                    {name: '华为',date: '2018/11/11 04:20',sale: '89'},
                    {name: '小米',date: '2018/11/11 06:30',sale: '64'}
                ];
                let config={
                    VC: {
                        angle: 'date',  // 角度表示时间
                        radius: 'sale',  //半径表示销量
                        color: 'name'
                    },
                    polarAxis: {
                        aTicks: 13,  // 角度方向轴刻度数
                        aDomain: ['2018/11/11 00:00','2018/11/12 00:00'], //角度方向轴输入范围
                        rTicks: 11, // 半径方向轴刻度数
                        rDomain: [0,300]  //半径方向轴输入范围
                    },
                    tooltip: {
                        content: function (d) {
                            return `${d.name}手机在该时间点(${d.date}的销量为: ${d.sale})`
                        }
                    }
                };
                this.$cdview.polarPoint.selectById('polarPoint').draw(data, config)
            }
        },
        mounted() {
            this.drawByc()
        }
    }
</script>

<style scoped>

</style>