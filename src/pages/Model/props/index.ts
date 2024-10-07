import { SelectProps } from "antd";
import { pageQuery } from "./service";

/**
 * 查询表格数据
 * @param params 
 */
export const loadTableData = async (params: any) => {
    const page = { current: params.current || 1, size: params.pageSize || 10 };
    const queryParams: any = {
        name: params.name,
        modelType: params.modelType,
        key: params.key,
    };
    const { success, result } = await pageQuery({ ...page, params: queryParams });
    return {
        success,
        total: result.totalRow || 0,
        data: result.records || [],
    };
}


export const typeOptions: SelectProps['options'] = [
    { label: '假勤', value: 11 },
    { label: '战略规划', value: 0 },
    { label: '组织设计', value: 1 },
    { label: '人力资源', value: 2 },
    { label: '产品开发', value: 3 },
    { label: '市场营销', value: 4 },
    { label: '销售服务', value: 5 },
    { label: '财务管理', value: 6 },
    { label: 'IT支持', value: 7 },
    { label: '法律事务', value: 8 },
    { label: '政务审批', value: 9 },
    { label: '其他', value: 10 },
];