import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/dv.css'
import store from './store/index.js'
import cdview from './CDView/src/index.js'
import './CDView/src/css/cdview.css'
import axios from 'axios'
Vue.prototype.$axios=axios;
Vue.prototype.$cdview = cdview;


Vue.use(ElementUI);
Vue.use(router);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
