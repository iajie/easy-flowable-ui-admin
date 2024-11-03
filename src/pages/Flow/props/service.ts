import { request } from "@umijs/max";

/**
 * 分页查询
 * @param params
 * @returns
 */
export const pageQuery = async (params: any) => {
    return request(`/easy-flowable/deployment/page`, {
        method: 'POST',
        data: params
    });
}

/**
 * 启动流程
 * @param params
 * @returns
 */
export const startFlow = async (params: any) => {
    return request(`/easy-flowable/processInstance/start`, {
        method: 'POST',
        data: params
    });
}

/**
 * 删除流程定义
 * @param deploymentId 部署ID
 * @returns
 */
export const deleteById = async (deploymentId: string) => {
    return request(`/easy-flowable/deployment/deleteDeployment`, {
        params: {
            deploymentId,
            cascade: true
        }
    });
}

/**
 * 流程定义状态设置
 * @param procInsId 流程定义id
 * @returns
 */
export const deploymentState = async (procInsId: string) => {
    return request(`/easy-flowable/deployment/deploymentState/${procInsId}`);
}

/**
 * 流程定义用户任务节点
 * @param flowKey 流程定义key
 * @returns
 */
export const flowUserTaskList = async (flowKey: string) => {
    return request(`/easy-flowable/deployment/flowUserList/${flowKey}`);
}

/**
 * 流程定义用户任务节点
 * @param procInsId 流程定义id
 * @returns
 */
export const deploymentImage = (procInsId: string) => {
    return `/easy-flowable/deployment/deploymentImage/${procInsId}`;
}

/**
 * 流程定义XML
 * @param procInsId procInsId 流程定义id
 * @returns
 */
export const deploymentXml = async (procInsId: string) => {
    return request(`/easy-flowable/deployment/deploymentXml/${procInsId}`);
}