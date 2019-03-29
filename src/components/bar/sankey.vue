<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="sankey_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        还没完成
                    </p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "sankey",
        methods: {
            drawByC(){
                var data = {
                    'nodes': [
                        {name: "0"},
                        {name: "1"},
                        {name: "2"},
                        {name: "3"},
                        {name: "4"},
                        {name: "5"},
                        {name: "6"},
                        {name: "7"},
                        {name: "8"}
                    ],
                    'links': [
                        {source: 0, target: 3, value: 10},
                        {source: 1, target: 4, value: 10},
                        {source: 2, target: 4, value: 5},
                        {source: 1, target: 5, value: 5},
                        {source: 3, target: 6, value: 5},
                        {source: 3, target: 7, value: 5},
                        {source: 4, target: 7, value: 10},
                        {source: 4, target: 8, value: 5},
                        {source: 5, target: 8, value: 5}
                    ]
                };
                this.$cdview.basic_svg.selectById('sankey_c').draw()
                this.$cdview.sankey.selectById('sankey_c').draw(data)
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>