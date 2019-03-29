<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="rectPartition_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        基本的矩形分区图
                    </p>
                    <p class="dv_p">
                        表示：中国各个省份的各个市的各个区的隶属关系
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：rectPartition
                    配置选项：
                     VC: {
                        hierarchy: ['province','cities'], (层级关系属性，从大到小)
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
        name: "rectPartition",
        methods: {
            drawByCDView(){
                let data={
                    "name":"中国",
                    "province":
                        [
                            {
                                "name":"浙江" ,
                                "cities":
                                    [
                                        {"name":"杭州" },
                                        {"name":"宁波" },
                                        {"name":"温州" },
                                        {"name":"绍兴" }
                                    ]
                            },

                            {
                                "name":"广西" ,
                                "cities":
                                    [
                                        {"name":"桂林",'cities':[{'name': '七星区'},{'name': '吴兴区'}]},
                                        {"name":"南宁"},
                                        {"name":"柳州"},
                                        {"name":"防城港"}
                                    ]
                            },

                            {
                                "name":"黑龙江",
                                "cities":
                                    [
                                        {"name":"哈尔滨"},
                                        {"name":"齐齐哈尔"},
                                        {"name":"牡丹江"},
                                        {"name":"大庆"}
                                    ]
                            },

                            {
                                "name":"新疆" ,
                                "cities":
                                    [
                                        {"name":"乌鲁木齐"},
                                        {"name":"克拉玛依"},
                                        {"name":"吐鲁番"},
                                        {"name":"哈密"}
                                    ]
                            }
                        ]
                };
                let config={
                    VC: {
                        hierarchy: ['province','cities','area']
                    },
                    text: {
                        content: function (d) {
                            return d.data.name
                        },
                        fontSize: function (d) {
                            return  (50 / (d.depth + 1))
                        }
                    }
                };
                this.$cdview.rectPartition.selectById('rectPartition_c').draw(data,config)
            }
        },
        mounted(){
            this.drawByCDView()
        }
    }
</script>

<style scoped>

</style>