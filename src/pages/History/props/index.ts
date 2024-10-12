import { ProColumns } from "@ant-design/pro-table";
import { pageQuery } from "./service";
import React from "react";
import { Tag } from "antd";

export const columns: ProColumns[] = [
	{ valueType: 'index', title: '序号' },
	{ dataIndex: 'version', title: '发布版本', render: dom => React.createElement(Tag, { color: 'success' }, `V ` + dom) },
	{ dataIndex: 'createTime', title: '发布时间' },
	{ dataIndex: 'createBy', title: '操作人' },
	{ dataIndex: 'remarks', title: '备注' },
];

/**
 * 查询表格数据
 * @param params
 */
export const loadTableData = async (params: any) => {
	if (!params.modelId) {
		return { success: false, data: [] };
	}
	const page = { current: params.current || 1, size: params.pageSize || 10 };
	const queryParams: any = {
		modelId: params.modelId,
	};
	const { success, result } = await pageQuery({ ...page, params: queryParams });
	return {
		success,
		total: result.totalRow || 0,
		data: result.records || [],
	};
}