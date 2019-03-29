<template>
    <div>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                tooltip：提示框，鼠标在图形上时出现的提示信息
                配置选项：
                tooltip: {
                        content: function (d) {  (配置tooltip的弹出内容 ，d是每一个图形绑定到的数据)
                           return `${d.xx}xxx`   (返回一个要显示的字符串模板)
                        }
                    }
                </pre>
            </div>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                legend：图例，标识图形的内容
                配置选项：
                legend: {
                        content: function(d){     (配置legend的标题内容 ，d是每一个图形绑定到的数据)
                            return `${d.xx}xxx`   (返回一个要显示的字符串模板)
                        },
                        position: 'top'           (配置图例的显示位置，默认在下，可使用'top'，使它在上)
                    }
                </pre>
            </div>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                axis：坐标轴
                配置选项：
                axis: {
                        show: boolean,          (对于支持坐标轴的，可以控制show的值，来控制是否使用坐标轴，默认显示)
                        xAxisPosition: 'top',   (x坐标轴位置，默认在下,可使用‘top’,使之在上)
                        yAxisPosition: 'right'  (y坐标轴位置，默认在左,可使用‘right’,使之在右)
                        title: {
                            yContent: 'xx',     (y轴标题显示内容)
                            xContent: 'xx'      (x轴标题显示内容)
                        },
                        xTickFormat: function (timeFormat) {  (配置刻度内容,默认使用d3的配置
                                                               ,timeFormat为d3.timeFormat对象)
                            return timeFormat('%H:%M') (这里使用了d3.timeFormat,具体查看d3时间字符串格式化表)
                        },
                        yTickFormat: function (timeFormat) {  (配置刻度内容,默认使用d3的配置
                                                               ,timeFormat为d3.timeFormat对象)
                            return timeFormat('%H:%M') (这里使用了d3.timeFormat,具体查看d3时间字符串格式化表)
                        },
                        xTicks: number,   (要显示的刻度数,注意如果给的数不恰当，比如刻度上显示无穷小数，那么会使用默认的)
                        xTicks: number,   (要显示的刻度数,注意如果给的数不恰当，比如刻度上显示无穷小数，那么会使用默认的)
                        yRange: [0,500],                 (为y轴和y方向的图形属性设定，y比例尺，不在使用自适应比例尺)
                        xRange: [0,500]                 (为x轴和x方向的图形属性设定，x比例尺，不在使用自适应比例尺)
                    }
                </pre>
            </div>
        </el-row>
        <el-row>
            <div class="dv_description">
                <pre class="dv_pre">

                polarAxis：极坐标轴
                配置选项：
                polarAxis: {
                        aTicks: 13,  // 角度方向轴刻度数
                        aDomain: ['2018/11/11 00:00','2018/11/12 00:00'], //角度方向轴输入范围
                        rTicks: 11, // 半径方向轴刻度数
                        rDomain: [0,300]  //半径方向轴输入范围
                    }
                </pre>
            </div>
        </el-row>
    </div>
</template>

<script>
    export default {}
</script>

<style scoped>

</style>