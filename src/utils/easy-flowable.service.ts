import { request } from '@umijs/max';

/**
 * 是否需要登录
 */
const isLogin = async () => request(`/easy-flowable/isLogin`);

/**
 * 用户列表
 */
const users = async () => request(`/easy-flowable/users`);

/**
 * 用户列表
 */
const groups = async () => request(`/easy-flowable/groups`);

/**
 * 用户列表
 */
const login = async (params: { username: string; password: string; }) => request(`/easy-flowable/login`, {
    method: 'POST',
    data: params
});

export {
    isLogin,
    users,
    groups,
    login
}