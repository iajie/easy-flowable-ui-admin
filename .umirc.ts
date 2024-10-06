import { defineConfig } from '@umijs/max';

export default defineConfig({
	publicPath: "/",
	fastRefresh: true,
	hash: true,
	history: {
		type: 'hash'
	},
	antd: {},
	access: {},
	model: {},
	initialState: {},
	request: {},
	layout: {
		title: 'Easy-Flowable',
	},
	proxy: {
		'/easy-flowable': {
			target: 'http://localhost:8083/easy-flowable/',
			changeOrigin: true,
			pathRewrite: { '^/easy-flowable': '' }
		}
	},
	routes: [
		{ path: '/', redirect: '/home', },
		{ name: '首页', path: '/home', component: './Home', },
		{ name: '流程模型', path: '/model', icon: '', component: './Model', },
		{ name: '流程管理', path: '/flow', component: './Flow', },
	],
	npmClient: 'npm',
});
