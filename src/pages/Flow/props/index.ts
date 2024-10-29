import { pageQuery } from "./service";
import {ProColumns} from "@ant-design/pro-components";
import React from "react";
import {Tag} from "antd";
import { typeOptions } from "@/pages/Model/props";

/**
 * 查询表格数据
 * @param params
 */
export const loadTableData = async (params: any) => {
    const page = { current: params.current || 1, size: params.pageSize || 10 };
    const queryParams: any = {
        name: params.name,
        modelType: params.modelType,
        flowKey: params.key,
    };
    const { success, result } = await pageQuery({ ...page, params: queryParams });
    return {
        success,
        total: result.totalRow || 0,
        data: result.records || [],
    };
}

export const columns: ProColumns[] = [
    { valueType: 'index', title: '序号' },
    { dataIndex: 'name', title: '定义名称' },
    { dataIndex: 'key', title: '定义标识' },
    { dataIndex: 'modelType', title: '流程类型', valueType: 'select', request: () => typeOptions },
    {
        dataIndex: 'version',
        search: false,
        title: '定义版本',
        render: (dom, { version }) => {
            if (version) {
                return React.createElement(Tag, { color: 'success' }, 'V ' + dom);
            }
            return React.createElement(Tag, {}, '未定义');
        }
    },
    {
        dataIndex: 'suspensionState',
        title: '定义状态',
        search: false,
        render: (dom) => {
            if (dom == 1) {
                return React.createElement(Tag, { color: 'success' }, '激活');
            } else if (dom == 2) {
                return React.createElement(Tag, { color: 'error' }, '终止');
            }
            return React.createElement(Tag, {}, '未定义');
        }
    },
];