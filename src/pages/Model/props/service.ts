import { request } from "@umijs/max";

/**
 * 分页查询
 * @param params 
 * @returns 
 */
export const pageQuery = async (params: any) => {
    return request(`/easy-flowable/model/pageQuery`, {
        method: 'POST',
        data: params
    });
}

/**
 * 新增/修改
 * @param params 
 * @returns 
 */
export const save = async (params: any) => {
    return request(`/easy-flowable/model/save`, {
        method: 'POST',
        data: params
    });
}

/**
 * 根据ID删除
 * @param id 
 * @returns 
 */
export const deleteById = async (id: string) => {
    return request(`/easy-flowable/model/remove/${id}`);
}