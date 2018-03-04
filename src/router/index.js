import Vue from 'vue'
import Router from 'vue-router'
import goods from '../components/goods/goods.vue';
import sell from '../components/sell/sell.vue';
import ratings from '../components/ratings/ratings.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/goods'
  },
  {
    path: '/goods',
    component: goods
  },
  {
    path: '/ratings',
    component: ratings
  },
  {
    path: '/sell',
    component: sell
  }
];

export default new Router({
  linkActiveClass: 'active',
  routes
});
