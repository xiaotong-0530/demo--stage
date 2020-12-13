import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
Vue.use(Vuex);

//Element Ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app
  }
});
