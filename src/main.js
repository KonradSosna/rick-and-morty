import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import VueCompositionApi from '@vue/composition-api';
import { provide } from '@vue/composition-api';
import VueApollo from '@vue/apollo-option'
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClientProvider, vueApolloProvider } from './graphql/client';

Vue.use(VueCompositionApi);

Vue.use(VueApollo);

Vue.config.productionTip = false;

new Vue({
  setup() {
    provide(DefaultApolloClient, apolloClientProvider);
  },
  vueApolloProvider,
  router,
  render: h => h(App)
}).$mount('#app');