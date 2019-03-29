<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="rectArea_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的矩形树形图
                    </p>
                    <p class="dv_p">
                        表示：中国各个城市和各个省份GDP的占比。
                        每个块代表一个城市， 同一个省份的城市对应的矩形颜色一样，每个块的大小代表了对应城市的GDP。
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：rectArea
                    配置选项：
                     VC: {
                        hierarchy: ['province','cities'], (层级关系属性，从大到小)
                        size: 'gdp'                       (块的大小->gdp字段)
                    },
                    text: {
                        content: function (d) {          (设置文本内容，d为每个块绑定到的数据)
                            return d.name
                        },
                        fontSize: function (d) {         (可以为固定值和匿名函数，d为每个块绑定到的数据)
                            return d.dx/5                (使用匿名函数可以动态的给每个块的文本字体大小赋值)
                        }
                    }
                    使用说明：
                    这个图所需要的的数据类型是一个标准的json对象，并且具有层及关系。
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "rectArea",
        methods: {
            drawByCDView(){
                let data={
                    "name": "中国",
                    "province":
                        [
                            {
                                "name": "浙江",
                                "cities":
                                    [
                                        {"name":"杭州", "gdp":8343},
                                        {"name":"宁波", "gdp":7128},
                                        {"name":"温州", "gdp":4003},
                                        {"name":"绍兴", "gdp":3620},
                                        {"name":"湖州", "gdp":1803},
                                        {"name":"嘉兴", "gdp":3147},
                                        {"name":"金华", "gdp":2958},
                                        {"name":"衢州", "gdp":1056},
                                        {"name":"舟山", "gdp":1021},
                                        {"name":"台州", "gdp":3153},
                                        {"name":"丽水", "gdp":983}
                                    ]
                            },
                            {
                                "name": "广西",
                                "cities":
                                    [
                                        {"name":"南宁", "gdp":3148},
                                        {"name":"柳州", "gdp":2016},
                                        {"name":"桂林", "gdp":1657},
                                        {"name":"梧州", "gdp":991},
                                        {"name":"北海", "gdp":734},
                                        {"name":"防城港", "gdp":525},
                                        {"name":"钦州", "gdp":734},
                                        {"name":"贵港", "gdp":742},
                                        {"name":"玉林", "gdp":1300},
                                        {"name":"百色", "gdp":656},
                                        {"name":"贺州", "gdp":423},
                                        {"name":"河池", "gdp":497},
                                        {"name":"来宾", "gdp":519},
                                        {"name":"崇左", "gdp":649}
                                    ]
                            },
                            {
                                "name": "江苏",
                                "cities":
                                    [
                                        {"name":"南京", "gdp":8820},
                                        {"name":"无锡", "gdp":8205},
                                        {"name":"徐州", "gdp":4964},
                                        {"name":"常州", "gdp":4360},
                                        {"name":"苏州", "gdp":13500},
                                        {"name":"南通", "gdp":5038},
                                        {"name":"连云港", "gdp":1785},
                                        {"name":"淮安", "gdp":2455},
                                        {"name":"盐城", "gdp":3836},
                                        {"name":"扬州", "gdp":3697},
                                        {"name":"镇江", "gdp":2950},
                                        {"name":"泰州", "gdp":3006},
                                        {"name":"宿迁", "gdp":1930}
                                    ]
                            }
                        ]
                };
                let config={
                    VC: {
                        hierarchy: ['province','cities'],
                        size: 'gdp'
                    },
                    text: {
                        content: function (d) {
                            return d.data.name
                        },
                        fontSize: function (d) {
                            return (d.x1-d.x0)/5
                        }
                    }
                };
                this.$cdview.rectArea.selectById('rectArea_c').draw(data,config)
            }
        },
        mounted(){
            this.drawByCDView()
        }
    }
</script>

<style scoped>

</style>