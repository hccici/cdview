<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="triangle_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        自定义布局之层级倒三角
                    </p>
                    <p class="dv_p">
                        表示：
                        四个城市平均工资水平，从大到小的排序，
                        每个梯形代表一个城市，城市从上到下的顺序和大小跟城市的平均工资水平有关
                    </p>
                    <el-button @click="drawTriangleByC(1)">新数据</el-button>
                    <el-button @click="drawTriangleByC(2)">旧数据</el-button>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：inverted_triangle
                    配置选项：
                    1、VC: {
                          sort: 'salary',  (根据工资的多少进行排序)
                          color: 'name'    (根据城市的名称来给每个城市图形配色)
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "inverted_triangle",
        methods:{
            drawTriangleByC(flag) {
                let data = [
                    {name: '北京', salary: 10000},
                    {name: '深圳', salary: 8000},
                    {name: '南宁', salary: 2000},
                    {name: '杭州', salary: 9000}
                ];
                let data1 = [
                    {name: '北京', salary: 2000},
                    {name: '深圳', salary: 10000},
                    {name: '南宁', salary: 8000},
                    {name: '杭州', salary: 6000}
                ];
                let config={
                    VC: {
                        sort: 'salary',
                        color: 'name'
                    },
                    legend: {
                        content :function (d) {
                            return `${d.data.name}`
                        }
                    },
                    tooltip: {
                        content: function (d) {
                           return (`${d.data.name}的平均工资为：${d.data.salary}元`)
                        }
                    },
                    text: {
                        content: function (d) {
                            return d.data.name+'市'
                        }
                    }
                };
                if (flag===0) {
                    this.update=this.$cdview.inverted_triangle.selectById('triangle_c').draw(data,config);
                } else if(flag===1){
                    this.update.reDraw(data1);
                } else {
                    this.update.reDraw(data);
                }
            }
        },
        mounted(){
            this.drawTriangleByC(0)
        }
    }
</script>

<style scoped>

</style>