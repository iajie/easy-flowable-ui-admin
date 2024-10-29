import { list, executionHistory } from "./service";
import { ProColumns } from "@ant-design/pro-table";
import React from "react";
import { Tag } from "antd";

/**
 * 查询表格数据
 * @param params
 */
export const loadTableData = async (params: any) => {
    if (!params.processDefinitionId) {
        return { success: false, data: [] };
    }
    const { success, result } = await list(params.processDefinitionId);
    return {
        success,
        data: result || [],
    };
}

/**
 * 查询任务历史数据
 * @param params
 */
export const loadListData = async (params: any) => {
    const { success, result } = await executionHistory(params.processInstanceId);
    return {
        success,
        data: result || [],
    };
}

export const columns: ProColumns[] = [
    { valueType: 'index', title: '序号', width: 60 },
    { dataIndex: 'name', title: '实例名称', ellipsis: true, },
    {
        dataIndex: 'businessKey',
        align: 'center',
        title: '业务主键',
        width: 140,
        ellipsis: true,
    },
    {
        dataIndex: 'processInstanceVersion',
        title: '流程实例运行版本',
        align: 'center',
        render: dom => React.createElement(Tag, { color: 'success' }, `V ` + dom)
    },
    {
        dataIndex: 'businessKeyStatus',
        align: 'center',
        ellipsis: true,
        title: '业务状态'
    },
    {
        dataIndex: 'status',
        title: '流程实例状态',
        align: 'center',
        width: 120,
        render: (dom, { status }) => React.createElement(Tag,
            { color: status ? 'red' : 'success' },
            status ? '终止' : '激活'
        )
    },
];