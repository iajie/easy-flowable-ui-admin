import { request } from "@umijs/max";

/**
 * 流程实例列表（运行）
 * @param processDefinitionId 流程定义ID
 */
export async function list(processDefinitionId: string) {
    return request(`/easy-flowable/processInstance/list/${processDefinitionId}`)
}

/**
 * 设置流程实例状态
 * @param processInstanceId
 */
export const stateSet = async (processInstanceId: string) => {
    return request(`/easy-flowable/processInstance/stateSet/${processInstanceId}`)
}

/**
 * 设置业务状态
 * @param processInstanceId
 * @param status
 */
export const businessStatus = async (processInstanceId: string, status: string) => {
    return request(`/easy-flowable/processInstance/businessStatus`, {
        params: { processInstanceId, status }
    })
}

/**
 * 获取可回退的业务节点
 * @param processInstanceId
 */
export const backUserTasks = async (processInstanceId: string) => {
    return request(`/easy-flowable/processInstance/backUserTasks/${processInstanceId}`)
}

/**
 * 获取实例执行历史
 * @param processInstanceId
 */
export const executionHistory = async (processInstanceId: string) => {
    return request(`/easy-flowable/processInstance/executionHistory/${processInstanceId}`)
}

export const getAttachment = (attachmentId) => `easy-flowable/task/getAttachment/${attachmentId}`;