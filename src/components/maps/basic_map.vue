<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="chinaMap_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        简单的中国地图
                    </p>
                    <p class="dv_p">
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <div id="usaMap_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        简单的美国地图
                    </p>
                    <p class="dv_p">
                        http://mapshaper.org/ 缩小地图精确度
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：basic_map
                    配置选项：
                      1、geometry: 'polygon', //因为地图的格式不同，所以选择不同的几何层级（维度）
                      2、size: 0.9,          (地图的缩放比例,可设的值在1左右浮动)
                      3、text: true          (是否显示每个地点的名字)
                      4、map: {
                              color: 'white'     (地图的填充色，如果没有配置，使用默认的配色)
                              stroke: '#000'     (地图的描边色，如果没有配置，使用默认的配色)
                              fill_opacity: 0.5  (地图的填充色的不透明度0-1，如果没有配置，使用默认的配色)
                         }
                      5、dots: [             (设置显示在地图上的原点，value决定圆的大小和配色)
                                {name: '北京',value: 100},
                                {name: '上海',value: 80},
                                {name: '浙江',value: 61},
                                {name: '广西',value: 40},
                                {name: '福建',value: 66}
                            ],
                      6、dotsTooltip: {      (设置圆的tooltip)
                                content: function (d) {
                                    return `在${d.dots.name}市，xx的销量为`
                                }
                            }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "basic_map",
        methods: {
            drawByC() {
                this.$axios.get('/api/china_simplify')
                    .then(res => {
                        let config = {
                            map: {
                                // fill: 'white',
                                // stroke: '#000',
                                 fill_opacity: 0.6
                            },
                            geometry: 'polygon', //因为地图的格式不同，所以选择不同的几何层级（维度）
                            size: 0.9,
                            tooltip: {
                                content: function (d) {
                                    return `${d.properties.name}`
                                }
                            },
                            dots: [
                                {name: '北京',value: 100},
                                {name: '上海',value: 80},
                                {name: '浙江',value: 61},
                                {name: '广西',value: 40},
                                {name: '福建',value: 66}
                            ],
                            dotsTooltip: {
                                content: function (d) {
                                    return `在${d.dots.name}市，xx的销量为`
                                }
                            }
                        };
                        this.$cdview.basic_map.selectById('chinaMap_c').draw(res.data, config)
                    })
            },
            drawByC2() {
                this.$axios.get('/api/usa_geo_simplify')
                    .then(res => {
                        let config = {
                            geometry: 'multiPolygon',
                            size: 1.2
                        };
                        this.$cdview.basic_map.selectById('usaMap_c').draw(res.data, config)
                    })
            }

        },
        mounted() {
            this.drawByC();
            this.drawByC2()
        }
    }
</script>

<style scoped>

</style>