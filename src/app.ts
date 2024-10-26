/**
 * @author MoJie
 * @description 运行时配置
 * @date 2024-10-10 15:03:12
 */
import logo from './assets/logo.png';
import avatar from './assets/logo-full.png';
import { Button, Dropdown, Modal, notification } from 'antd';
import { history, RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { isLogin, users, groups } from './utils/easy-flowable.service';
import React from "react";
import { LogoutOutlined } from "@ant-design/icons";

interface InitialStateProps {
    /**
     * @description 用户列表
     */
    users?: { label: string; value: string; }[];
    /**
     * @description 用户名称
     */
    username?: string | null;
    /**
     * @description 候选组
     */
    groups?: { label: string; value: string; }[];
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<InitialStateProps> {
    const initData: InitialStateProps = {};
    // 加载layout，先查看是否需要登录
    const { success, result } = await isLogin();
    const username = sessionStorage.getItem('username');
    if (success && result && !username) {
        history.push('/login');
    } else {
        initData.username = username;
        const usersData = await users();
        initData.users = usersData.result;
        const groupsData = await groups();
        initData.groups = groupsData.result;
    }
    return initData;
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
    return {
        logo,
        title: 'Easy-Flowable',
        menu: {
            locale: false,
        },
        // layout: 'mix',
        footerRender: (props) => React.createElement('div', {
            style: {
                lineHeight: "40px",
                borderBlockStart: "1px solid rgba(5, 5, 5, 0.06)",
                position: "fixed",
                bottom: "0px",
                width: "100%",
                textAlign: "center",
                background: "none",
            },
            dangerouslySetInnerHTML: {
                __html: 'Copyright © 2024 Easy-Flowable'
            }
        }),
        avatarProps: {
            src: avatar,
            size: 'large',
            title: initialState?.username,
            render: (props, dom) => React.createElement(Dropdown, {
                menu: {
                    items: [
                        {
                            key: 'logout',
                            label: React.createElement(Button, {
                                type: 'link',
                                danger: true,
                                icon: React.createElement(LogoutOutlined),
                                onClick: () => {
                                    const modal = Modal.confirm({
                                        title: '提示',
                                        content: '是否退出登录！',
                                        onCancel: () => modal.destroy(),
                                        onOk: async () => {
                                            modal.destroy();
                                            sessionStorage.clear();
                                            history.push('/login');
                                        }
                                    });
                                },
                            }, '退出登录'),
                        },
                    ]
                }
            }, dom)
        },
    };
};

export const request: RequestConfig = {
    requestInterceptors: [(url, options) => {
        options.headers = { ...options.headers, tenantId: 'easy-flowable' };
        return { url, options };
    }],
    responseInterceptors: [((response) => {
        const { data, status, headers }: any = response;
        if (headers['content-type'].indexOf('image') !== -1) {
            return response;
        }
        if (data.success && status == 200) {
            return response;
        } else {
            notification.error({
                message: '操作失败',
                description: data.message,
            });
        }
        return response;
    })],
    errorConfig: {
        errorHandler: ({ response }: any) => {
            if (response.status === 401) {
                history.push('/login');
            }
        }
    }
};