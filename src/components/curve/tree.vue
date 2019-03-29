<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="mindMap_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        聚类树状图
                    </p>
                    <p class="dv_p">
                        树形图的一种，但是所有的叶子节点在同一垂直线上
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：curve
                    配置选项：
                    1、VC: {
                        nodeName: 'name',  // 节点名称，默认为name
                        children: function (d) { // 子节点访问器，默认访问d.children
                            return d.children
                        }
                      }
                    2、size: 10 //文本大小，默认 为10
                    3、nodeRadius: 3 //圆点半径大小，默认为 2.5
                    4、style: 'ordinary'   //树的样式，当前有‘ordinary’,'cluster'
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "mindMap",
        methods: {
            drawByCDview() {
                let data = {
                    "name": "如何学习D3",
                    "children":
                        [
                            {
                                "name": "预备知识",
                                "children":
                                    [
                                        {"name": "HTML & CSS"},
                                        {"name": "JavaScript"},
                                        {"name": "DOM"},
                                        {"name": "SVG"}
                                    ]
                            },
                            {
                                "name": "安装",
                                "children":
                                    [
                                        {
                                            "name": "记事本软件",
                                            "children":
                                                [
                                                    {"name": "Notepad++"},
                                                    {"name": "EditPlus"},
                                                    {"name": "Sublime Text"}
                                                ]
                                        },
                                        {
                                            "name": "服务器软件",
                                            "children":
                                                [
                                                    {"name": "Apache Http Server"},
                                                    {"name": "Tomcat"}
                                                ]
                                        },
                                        {"name": "下载D3.js"}
                                    ]
                            },
                            {
                                "name": "入门",
                                "children":
                                    [
                                        {
                                            "name": "选择集",
                                            "children":
                                                [
                                                    {"name": "select"},
                                                    {"name": "selectAll"}
                                                ]
                                        },
                                        {
                                            "name": "绑定数据",
                                            "children":
                                                [
                                                    {"name": "datum"},
                                                    {"name": "data"}
                                                ]
                                        },
                                        {"name": "添加删除元素"},
                                        {
                                            "name": "简单图形",
                                            "children":
                                                [
                                                    {"name": "柱形图"},
                                                    {"name": "折线图"},
                                                    {"name": "散点图"}
                                                ]
                                        },
                                        {"name": "比例尺"},
                                        {"name": "生成器"},
                                        {"name": "过渡"}
                                    ]
                            },
                            {
                                "name": "进阶",
                                "children":
                                    [
                                        {
                                            "name": "布局的应用",
                                            "children":
                                                [
                                                    {"name": "饼状图"},
                                                    {"name": "树状图"},
                                                    {"name": "矩阵树图"}
                                                ]
                                        },
                                        {"name": "地图"}
                                    ]
                            }
                        ]
                };
                let config={
                    VC: {
                        nodeName: 'name',  // 节点名称，默认为name
                        children: function (d) { // 子节点访问器，默认访问d.children
                            return d.children
                        }
                    },
                    size: 10, //文本大小，默认 为10
                    nodeRadius: 3, //圆点半径大小，默认为 2.5
                    style: 'cluster'   //树的样式，当前有‘ordinary’,'cluster'
                };
                this.$cdview.tree.selectById('mindMap_c').draw(data,config)
            }
        },
        mounted() {
            this.drawByCDview()
        }
    }
</script>

<style scoped>

</style>