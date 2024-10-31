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
		{ name: '首页', icon: '🌈', path: '/home', component: './Home', },
		{ name: '流程模型', path: '/model', icon: '🗜️', component: './Model', },
		{ name: '流程部署历史', path: '/modelHistory', icon: '📚️', component: './History', },
		{ name: '流程定义', icon: '🖼️️', path: '/flow', component: './Flow', },
		{ name: '流程实例(运行)', icon: '🎐', path: '/processInstance', component: './ProcessInstance', },
		{ name: '流程实例(已完成)', icon: '🧭', path: '/processHistory', component: './ProcessHistory', },
		{ name: '登录', path: '/login', layout: false, component: './Login', },
	],
	npmClient: 'npm',
});

