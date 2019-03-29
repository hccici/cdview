<template>
    <div>
        <el-row :span="24">
            <el-col :span="6"><img class="index_img" src="../assets/arc_partition.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/basic_bar.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/basic_curve.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/basic_pie.png"/></el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6"><img class="index_img" src="../assets/china_map.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/chord.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/gantt.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/group_bar.png"/></el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6"><img class="index_img" src="../assets/inverted_triangle.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/multi_curve.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/nd_pie.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/pack.png"/></el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6"><img class="index_img" src="../assets/point.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/polar_point.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/radar.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/rect_partition.png"/></el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6"><img class="index_img" src="../assets/rect_tree.png" /></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/stack_bar.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/tree.png"/></el-col>
            <el-col :span="6"><img class="index_img" src="../assets/usa_map.png"/></el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: 'index',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        methods: {
        },
        mounted(){
            this.$store.commit('changeHeader', 'legend')
        }
    }
</script>

<style scoped>
    .index_img{
        width: 100%;
        height: 100%;
    }
</style>