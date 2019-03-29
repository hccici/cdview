import Vue from 'vue'
import Router from 'vue-router'
import Basic_curve from '../components/curve/Basic_curve.vue'
import Basic_bar from '../components/bar/Basic_bar.vue'
import Basic_dispersedPoint from '../components/dispersedPoint/Basic_dispersedPoint.vue'
import ringArea from '../components/area/ringArea.vue'
import packArea from '../components/area/packArea.vue'
import tree from '../components/curve/tree.vue'
import Index from '../components/index.vue'
import rectArea from '../components/area/rectArea.vue'
import stackBar from '../components/bar/stackBar.vue'
import chord from '../components/area/chord.vue'
import rectPartition from '../components/area/rectPartition.vue'
import arcPartition from '../components/area/arcPartition.vue'
import basic_map from '../components/maps/basic_map.vue'
import sankey from '../components/bar/sankey.vue'
import inverted_triangle from '../components/bar/inverted_triangle'
import gantt from '../components/bar/gantt'
import simple_radar from '../components/maps/simple_radar'
import publicConfig from '../components/publicConfig/config'
import start from '../components/publicConfig/start'
import polarPoint from '../components/polarPlot/polarPoint'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/publicConfig',
            name: 'publicConfig',
            component: publicConfig
        },
        {
            path: '/start',
            name: 'start',
            component: start
        },
        {
            path: '/Basic_curve',
            name: 'Basic_curve',
            component: Basic_curve
        },
        {
            path: '/Basic_bar',
            name: 'Basic_bar',
            component: Basic_bar
        },
        {
            path: '/Basic_dispersedPoint',
            name: 'Basic_dispersedPoint',
            component: Basic_dispersedPoint
        },
        {
            path: '/ringArea',
            name: 'ringArea',
            component: ringArea
        },
        {
            path: '/packArea',
            name: 'packArea',
            component: packArea
        },
        {
            path: '/tree',
            name: 'tree',
            component: tree
        },
        {
            path: '/rectArea',
            name: 'rectArea',
            component: rectArea
        },
        {
            path: '/stackBar',
            name: 'stackBar',
            component: stackBar
        },
        {
            path: '/chord',
            name: 'chord',
            component: chord
        },
        {
            path: '/rectPartition',
            name: 'rectPartition',
            component: rectPartition
        },
        {
            path: '/arcPartition',
            name: 'arcPartition',
            component: arcPartition
        },
        {
            path: '/basic_map',
            name: 'basic_map',
            component: basic_map
        },
        {
            path: '/sankey',
            name: 'sankey',
            component: sankey
        },
        {
            path: '/inverted_triangle',
            name: 'inverted_triangle',
            component: inverted_triangle
        },
        {
            path: '/gantt',
            name: 'gantt',
            component: gantt
        },
        {
            path: '/simple_radar',
            name: 'simple_radar',
            component: simple_radar
        },
        {
            path: '/polarPoint',
            name: 'polarPoint',
            component: polarPoint
        }
    ]
})
