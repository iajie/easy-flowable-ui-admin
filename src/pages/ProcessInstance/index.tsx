import React from "react";
import './index.less';
import { useLocation } from '@umijs/max';
import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    ModalForm,
    ProFormText,
    DrawerForm,
    ProList,
    ProDescriptions
} from "@ant-design/pro-components";
import { columns, loadTableData, loadListData } from "./props";
import { stateSet, businessStatus } from "./props/service";
import { Button, message, Space, Tag } from "antd";
import { useModel } from "@umijs/max";

export default () => {

    const { initialState } = useModel('@@initialState');
    const { users } = initialState;
    const { state }: any = useLocation();
    const table = React.useRef<ActionType>();

    const actionColumns: ProColumns[] = [{
        title: '操作',
        align: 'center',
        render: (dom, entity) => <Space>
            <Button onClick={ async () => {
                const { success } = await stateSet(entity.processInstanceId);
                if (success) {
                    table.current?.reloadAndRest();
                }
            } } style={{ color: entity.status ? '#87d068' : '#ff4d4f' }} type='text'>
                {entity.status ? '激活' : '终止'}
            </Button>
            <ModalForm
                width="30%"
                request={() => ({ status: entity.businessKeyStatus })}
                onFinish={async ({ status }) => {
                    const { success } = await businessStatus(entity.processInstanceId, status);
                    if (success) {
                        message.success("业务状态修改成功");
                        table.current?.reloadAndRest();
                    }
                    return success;
                }}
                trigger={<Button type='text' style={{ color: '#108ee9' }}>设置业务状态</Button>}>
                <ProFormText label="业务状态" name="status" rules={[{ required: true, message: '业务状态不能为空' }]}/>
            </ModalForm>
            <DrawerForm
                title={entity.name}
                drawerProps={{ destroyOnClose: true }}
                submitter={{
                    resetButtonProps: false,
                    searchConfig: { submitText: '执行' },
                    render: (props, dom) => <Space>
                        {dom}
                        <Button type="primary" danger>流程作废</Button>
                    </Space>
                }}
                trigger={<Button type='text' style={{ color: 'purple' }}>执行历史</Button>}>
                <ProList grid={{ column: 1 }}
                    params={{ processInstanceId: entity.processInstanceId }}
                    metas={{
                        avatar: {
                            render: (dom, { duration }) => {
                                if (duration || duration === 0) {
                                    if (duration < 1000) {
                                        return <Tag color='success'>耗时：{duration}毫秒</Tag>
                                    } else if (duration >= 1000 && duration < 60 * 1000) {
                                        return <Tag color='success'>耗时：{duration/1000}秒</Tag>
                                    } else if (duration >= 60 * 1000 && duration < 60 * 60 * 1000) {
                                        return <Tag color='success'>耗时：{duration/(60 * 1000)}分钟</Tag>
                                    } else if (duration >= 60 * 60 * 1000 && duration < 24 * 60 * 60 * 1000) {
                                        return <Tag color='success'>耗时：{duration/(60 * 60 * 1000)}小时</Tag>
                                    } else if (duration >= 24 * 60 * 60 * 1000) {
                                        return <Tag color='success'>耗时：{duration/(24 * 60 * 60 * 1000)}天</Tag>
                                    }
                                }
                                return <Tag color='orange'>待办</Tag>
                            }
                        },
                        title: {
                            dataIndex: 'taskName'
                        },
                        subTitle: {
                            dataIndex: 'assignee',
                            valueType: 'select',
                            request: () => users,
                            render: (dom, entity, index) => <Tag color={index > 0 ? 'geekblue' : 'cyan'}>
                                {index > 0 ? '执行人' : '发起人'}：{dom}
                            </Tag>
                        },
                        content: {
                            render: (dom, entity) => <ProDescriptions column={3}>
                                {entity.comment && <>
                                    <ProDescriptions.Item label="流程执行类型">
                                        <Tag color="purple">{entity.comment.executeTypeValue}</Tag>
                                    </ProDescriptions.Item>
                                    <ProDescriptions.Item label="审批意见" ellipsis>{entity.comment.commentContent}</ProDescriptions.Item>
                                </>}
                                <ProDescriptions.Item label="任务节点">{entity.taskDefKey}</ProDescriptions.Item>
                                <ProDescriptions.Item label="开始时间">{entity.startTime}</ProDescriptions.Item>
                                <ProDescriptions.Item label="结束时间">{entity.endTime}</ProDescriptions.Item>
                            </ProDescriptions>
                        },
                    }}
                    request={loadListData}/>
            </DrawerForm>
        </Space>
    }];

    return <PageContainer>
        <ProTable
            headerTitle={state?.name || '流程运行实例列表'}
            params={{ processDefinitionId: state?.processDefinitionId }}
            request={loadTableData}
            search={false}
            scroll={{ y: 670 }}
            columns={columns.concat(actionColumns)}
            pagination={false}
            rowKey="processInstanceId"
            actionRef={table}/>
    </PageContainer>

}