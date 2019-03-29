<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div id="gantt_c" class="dv_box" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="8">
                <div class="dv_description">
                    <p>
                        甘特图
                    </p>
                    <p class="dv_p">
                        表示：
                        在这个时间段内，每个任务的情况，
                        条开始的位置->任务开始时间，
                        条结束的位置->任务结束的时间，
                        条的长度->任务的持续时间，
                        条的颜色->任务的完成情况，
                        x轴表示时间，y轴表示任务
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                    图形对象：gantt
                    配置选项：
                    1、VC: {
                           taskName: 'name',        (指定任务名称，指定到y轴)
                           startTime: 'startTime',  (指定任务开始时间，指定到x轴)
                           endTime: 'endTime',      (指定任务结束时间，指定到x轴)
                           completion: 'completion' (指定任务完成成度)
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "gantt",
        methods: {
            drawByc() {
                let data = [
                    {
                    "name": "任务1",
                    "startTime": "2018-04-18 01:17:12",
                    "endTime": "2018-04-18 01:19:10",
                    "completion": 1
                }, {
                    "name": "任务2",
                    "startTime": "2018-04-18 01:18:15",
                    "endTime": "2018-04-18 01:19:20",
                    "completion": 0.5
                }, {
                    "name": "任务3",
                    "startTime": "2018-04-18 02:11:32",
                    "endTime": "2018-04-18 02:18:50",
                    "completion": 0.8
                }, {
                    "name": "任务4",
                    "startTime": "2018-04-18 01:12:32",
                    "endTime": "2018-04-18 03:18:50",
                    "completion": 0
                }, {
                    "name": "任务5",
                    "startTime": "2018-04-18 02:11:32",
                    "endTime": "2018-04-18 03:10:50",
                    "completion": 0.5
                }];
                let config = {
                    VC: {
                        taskName: 'name',
                        startTime: 'startTime',
                        endTime: 'endTime',
                        completion: 'completion'
                    },
                    axis: {
                        xAxisPosition: 'top',
                        title: {
                            yContent: '任务名称',
                            xContent: '任务完成情况'
                        }
                    },
                    legend: {
                        content: function(d){
                            return d.data.name
                        },
                        position: 'top'
                    },
                    tooltip: {
                        content: function (d) {
                           return `${d.data.startTime}-${d.data.endTime},完成度为${d.data.completion*100}%`
                        }
                    }
                };
                this.$cdview.gantt.selectById('gantt_c').draw(data, config)

            }
        },
        mounted() {
            this.drawByc()
        }
    }
</script>

<style scoped>

</style>