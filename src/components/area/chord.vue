<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="chord_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        简单的弦图
                    </p>
                    <p class="dv_p">
                        表示：
                        5个地方的人口组成关系，
                        每一个圆弧形表示一个城市，其大小表示该城市的人口总数，
                        每一条弦表示两个城市之间的人口来往，弦两端的大小根据来往人口数决定。
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：chord
                    配置选项：
                     VC: {
                        arcs: 'name',               (圆弧形->城市名字)
                        chords: 'population.number' (弦->人口数量)
                    },
                    arc: {                          (配置圆弧样式)
                        innerRadius: 180,           (内半径)
                        outerRadius: 200,           (外半径)
                        tooltip: {                  (配置圆弧形的tooltip，具体看公用配置)
                            content: function (d) {
                                return `${d.name}市，人口总数为：${d.value}万`
                            }
                        }
                    },
                    chord: {
                        tooltip: {                   (配置弦的tooltip，具体看公用配置)
                            content: function (d) {
                                return `在${d.source.name}市，来自${d.target.name}的人口为：${d.source.value}万<br>
                                        在${d.target.name}市，来自${d.source.name}的人口为：${d.target.value}万`
                            }
                        }
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "chord",
        methods: {
            drawByCDView() {
                let data = [
                    {
                        name: '北京',
                        population: [{comeFrom: '北京', number: 1000}, {comeFrom: '上海', number: 3045}, {
                            comeFrom: '广州',
                            number: 4567
                        }, {comeFrom: '深圳', number: 1234}, {comeFrom: '香港', number: 3714}]
                    },
                    {
                        name: '上海',
                        population: [{comeFrom: '北京', number: 3214}, {comeFrom: '上海', number: 2000}, {
                            comeFrom: '广州',
                            number: 2060
                        }, {comeFrom: '深圳', number: 888}, {comeFrom: '香港', number: 3234}]
                    },
                    {
                        name: '广州',
                        population: [{comeFrom: '北京', number: 1233}, {comeFrom: '上海', number: 3111}, {
                            comeFrom: '广州',
                            number: 2323
                        }, {comeFrom: '深圳', number: 1111}, {comeFrom: '香港', number: 2321}]
                    },
                    {
                        name: '深圳',
                        population: [{comeFrom: '北京', number: 2444}, {comeFrom: '上海', number: 2333}, {
                            comeFrom: '广州',
                            number: 4267
                        }, {comeFrom: '深圳', number: 2324}, {comeFrom: '香港', number: 1142}]
                    },
                    {
                        name: '香港',
                        population: [{comeFrom: '北京', number: 2222}, {comeFrom: '上海', number: 1222}, {
                            comeFrom: '广州',
                            number: 3123
                        }, {comeFrom: '深圳', number: 4542}, {comeFrom: '香港', number: 1234}]
                    }
                ];
                let config = {
                    VC: {
                        arcs: 'name',
                        chords: 'population.number'
                    },
                    arc: {
                        innerRadius: 180,
                        outerRadius: 200,
                        tooltip: {
                            content: function (d) {

                                return `${d.name}市，人口总数为：${d.value}万`
                            }
                        }
                    },
                    chord: {
                        tooltip: {
                            content: function (d) {
                                return `在${d.source.name}市，来自${d.target.name}的人口为：${d.source.value}万<br>
                                        在${d.target.name}市，来自${d.source.name}的人口为：${d.target.value}万`
                            }
                        }
                    }
                };
                this.$cdview.chord.selectById('chord_c').draw(data, config,)
            }
        },
        mounted() {
            this.drawByCDView()
        }
    }
</script>

<style scoped>

</style>