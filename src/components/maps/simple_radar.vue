<template>
    <div>
    <el-row>
        <el-col :span="16">
            <div id="radar_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
        </el-col>
        <el-col :span="8">
            <div class="dv_description">
                <p>
                    简单的雷达图
                </p>
                <p class="dv_p">
                    表示： 三个英雄的属性，
                    每个不同颜色的图形表示每一个英雄，
                    图形每个点表示不同的属性，
                    点的位置表示属性的值
                </p>
                <el-button @click="draw(1)">新数据</el-button>
                <el-button @click="draw(2)">旧数据</el-button>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：radar
                    配置选项：
                     1、VC: {
                        attr: 'attribute',   (属性对象->英雄属性字段)
                        attrName: 'name',    (属性名字->英雄属性名字)
                        attrValue: 'value',  (属性值->英雄属性值)
                        color: 'name'        (图形颜色->英雄名字)
                    },
                    2、rangeValue: [0,100],   (设置坐标系统，属性值的范围)
                    3、interval: 10,          (设置间隔，有多少的圆，每个间隔代表的值)
                    4、interactive: boolean   (是否开启交互，默认开启)
                </pre>
        </div>
    </el-row>
    </div>
</template>

<script>
    export default {
        name: "simple_radar",
        methods: {
            draw(flag) {
                let data = [
                    {
                        name: '盖伦',
                        attribute: [{name: '物理攻击力', value: 66}, {name: '魔法攻击力', value: 20}, {
                            name: '护甲',
                            value: 88
                        }, {name: '魔抗', value: 68}, {name: '操作空间', value: 30}]
                    },
                    {
                        name: '流浪',
                        attribute: [{name: '物理攻击力', value: 15}, {name: '魔法攻击力', value: 90}, {
                            name: '护甲',
                            value: 60
                        }, {name: '魔抗', value: 50}, {name: '操作空间', value: 76}]
                    },
                    {
                        name: '寒冰',
                        attribute: [{name: '物理攻击力', value: 92}, {name: '魔法攻击力', value: 40}, {
                            name: '护甲',
                            value: 20
                        }, {name: '魔抗', value: 16}, {name: '操作空间', value: 73}]
                    }
                ];
                let data1 = [
                    {
                        name: '盖伦',
                        attribute: [{name: '物理攻击力', value: 44}, {name: '魔法攻击力', value: 30}, {
                            name: '护甲',
                            value: 88
                        }, {name: '魔抗', value: 55}, {name: '操作空间', value: 56}]
                    },
                    {
                        name: '流浪',
                        attribute: [{name: '物理攻击力', value: 34}, {name: '魔法攻击力', value: 34}, {
                            name: '护甲',
                            value: 67
                        }, {name: '魔抗', value: 13}, {name: '操作空间', value: 56}]
                    },
                    {
                        name: '寒冰',
                        attribute: [{name: '物理攻击力', value: 54}, {name: '魔法攻击力', value: 66}, {
                            name: '护甲',
                            value: 55
                        }, {name: '魔抗', value: 11}, {name: '操作空间', value: 77}]
                    }
                ];
                let config = {
                    VC: {
                        attr: 'attribute',
                        attrName: 'name',
                        attrValue: 'value',
                        color: 'name'
                    },
                    rangeValue: [0,100],
                    interval: 10,
                    tooltip: {
                        content: function (d) {
                            return `${d.name}能力属性值：<br>
                                    物理攻击力为：${d.attribute[0].value}<br>
                                    魔法攻击力为：${d.attribute[1].value}<br>
                                    护甲为：${d.attribute[2].value}<br>
                                    魔抗为：${d.attribute[3].value}<br>
                                    操作空间为：${d.attribute[4].value}
                                    `
                        }
                    },
                    legend:{
                        content: function (d) {
                            return `${d.name}`
                        },
                        position: 'top'
                    }
                };
                if (flag===0) {
                    this.update=this.$cdview.radar.selectById('radar_c').draw(data,config)
                } else if(flag===1){
                    this.update.reDraw(data1);
                } else {
                    this.update.reDraw(data);
                }
            }
        },
        mounted() {
            this.draw(0)
        }
    }
</script>

<style scoped>

</style>