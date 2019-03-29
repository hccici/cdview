<template>
    <el-container>
        <el-aside>
            <el-menu
                    class="el-menu-vertical-demo "
                    style="border-right-color: #545c64;"
                    @select="handleSelect"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <el-submenu index="0">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>开始</span>
                    </template>
                    <el-menu-item index="/">legend</el-menu-item>
                    <el-menu-item index="start">start</el-menu-item>
                    <el-menu-item index="publicConfig">publicConfig</el-menu-item>
                </el-submenu>
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>折线图</span>
                    </template>
                    <el-menu-item index="Basic_curve">Basic_curve</el-menu-item>
                    <el-menu-item index="tree">tree</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>条形图</span>
                    </template>
                    <el-menu-item index="Basic_bar">Basic_bar</el-menu-item>
                    <el-menu-item index="stackBar">stackBar</el-menu-item>
                    <el-menu-item index="sankey">sankey</el-menu-item>
                    <el-menu-item index="inverted_triangle">inverted_triangle</el-menu-item>
                    <el-menu-item index="gantt">gantt</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>散点图</span>
                    </template>
                    <el-menu-item index="Basic_DispersedPoint">Basic_DispersedPoint</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>面积图</span>
                    </template>
                    <el-menu-item index="ringArea">ringArea</el-menu-item>
                    <el-menu-item index="packArea">packArea</el-menu-item>
                    <el-menu-item index="rectArea">rectArea</el-menu-item>
                    <el-menu-item index="chord">chord</el-menu-item>
                    <el-menu-item index="rectPartition">rectPartition</el-menu-item>
                    <el-menu-item index="arcPartition">arcPartition</el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>地图</span>
                    </template>
                    <el-menu-item index="basic_map">basic_map</el-menu-item>
                    <el-menu-item index="simple_radar">simple_radar</el-menu-item>
                </el-submenu>
                <el-submenu index="6">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>极坐标图</span>
                    </template>
                    <el-menu-item index="polarPoint">polarPoint</el-menu-item>
                </el-submenu>

            </el-menu>
        </el-aside>
        <el-container>
            <el-header>{{this.$store.state.header}}</el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

    export default {
        name: 'app',
        data() {
            return {
                isCollapse: true
            };
        },
        methods: {
            handleSelect(key) {
                this.$router.push(key)
            }
        },
        watch: {
            '$route'(to) {
                this.$store.commit('changeHeader', to.name)
            }
        }
    }
</script>

<style>
    .el-header {
        background-color: #ffd04b;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #545c64;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    .el-container {
        height: 100%;
    }
</style>
