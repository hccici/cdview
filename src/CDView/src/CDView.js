import curve from './curve/curve.js'
import basic_svg from './canvas_svg/basic_svg.js'
import basic_bar from './bar/bar.js'
import basic_dispersedPoint from './dispersedPoint/dispersedPoint.js'
import ringArea from './area/ringArea.js'
import packArea from './area/packArea.js'
import tree from './curve/tree.js'
import rectArea from './area/rectArea.js'
import stackBar from './bar/stackBar.js'
import chord from './area/chord.js'
import rectPartition from './area/rectPartition.js'
import arcPartition from './area/arcPartition.js'
import basic_map from './maps/basic_map.js'
import sankey from './bar/sankey_graph.js'
import nightingale_rose from './area/nightingale_rose.js'
import inverted_triangle from './bar/inverted_triangle.js'
import gantt from './bar/gantt.js'
import multi_curve from './curve/multi_curve.js'
import radar from './maps/radar.js'
import group_bar from './bar/group_bar.js'
import plusMinusBar from './bar/plusMinusBar.js'
import polarPoint from './polarPlot/polarPoint.js'
const CDView={
    curve,
    basic_svg,
    basic_bar,
    basic_dispersedPoint,
    ringArea,
    packArea,
    tree,
    rectArea,
    stackBar,
    chord,
    rectPartition,
    arcPartition,
    basic_map,
    sankey,
    nightingale_rose,
    inverted_triangle,
    gantt,
    multi_curve,
    radar,
    group_bar,
    plusMinusBar,
    polarPoint
};
// 在window下加载CDView对象，保证能够通过script标签使用
if (typeof window !== 'undefined') {
   window.CDView=CDView
}
export default CDView

