import React, { useRef } from "react";
import './index.less';
import { useLocation } from '@umijs/max';
import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    ModalForm,
    DrawerForm,
    ProList,
    ProFormInstance,
    ProDescriptions,
    ProFormTextArea,
    ProFormRadio,
    ProFormDependency,
    ProFormUploadButton,
    ProFormSelect,
    ProField,
    ProFormItem
} from "@ant-design/pro-components";
import { columns, loadTableData, loadListData } from "./props";
import { stateSet, getAttachment, addAttachment, delAttachment, executeTask } from "./props/service";
import { Button, message, Space, Tag, Descriptions } from "antd";
import { useModel } from "@umijs/max";
import { actionOptions, actionType } from "@/utils/format";

export default () => {

    const { initialState } = useModel('@@initialState');
    const actionFormRef = useRef<ProFormInstance>();
    const listRef = useRef<ActionType>();
    const { users, groups } = initialState;
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
                {entity.status ? '激活' : '挂起'}
            </Button>
            <DrawerForm
                title={entity.name}
                drawerProps={{ destroyOnClose: true }}
                submitter={{
                    resetButtonProps: false,
                    searchConfig: { submitText: '执行' },
                    render: (props, dom) => <Space>
                        <ModalForm
                            modalProps={{
                                mask: false,
                                maskClosable: false,
                                destroyOnClose: true,
                                onCancel: async () => {
                                    const attachmentId = actionFormRef.current?.getFieldValue('attachmentId');
                                    if (attachmentId) {
                                        await delAttachment(attachmentId[0].response.result);
                                    }
                                }
                            }}
                            formRef={actionFormRef}
                            title="流程审批"
                            layout="horizontal"
                            labelCol={{ span: 3 }}
                            trigger={<Button type="primary">执行</Button>}
                            request={() => ({ flowCommentType: 'AGREE' })}
                            onFinish={async (values) => {
                                let attachmentId, commentContent = values.commentContent;
                                if (values.attachmentId) {
                                    const file = values.attachmentId[0];
                                    commentContent = JSON.stringify({
                                        message: values.commentContent,
                                        filename: file.name
                                    });
                                    attachmentId = file.response.result;
                                }
                                const { success } = await executeTask({
                                    ...values, commentContent, attachmentId,
                                    processInstanceId: entity.processInstanceId,
                                    taskId: entity.taskId
                                });
                                if (success) {
                                    message.success('执行成功！');
                                    listRef.current?.reloadAndRest();
                                }
                                return success;
                            }}>
                            <ProFormRadio.Group name="flowCommentType" label="操作" options={actionOptions} rules={[{ required: true, message: '执行操作不能为空' }]}/>
                            <ProFormDependency name={['flowCommentType']}>
                                {({flowCommentType}) => {
                                    if (flowCommentType == 'REJECT_TO_TASK') {
                                        return <ProFormItem name="rejectToTaskId" label="节点" rules={[{ required: true, message: '驳回节点不能为空' }]}>
                                            <ProTable
                                                search={false}
                                                options={false}
                                                pagination={false}
                                                columns={[ {valueType: 'radio', title: '节点'} ]}/>
                                        </ProFormItem>
                                    } else if (flowCommentType == 'DELEGATE' || flowCommentType == 'ASSIGN') {
                                        return <ProFormSelect name="userId" rules={[{ required: true, message: '执行人不能为空' }]} label="执行人" request={() => users}/>
                                    }
                                }}
                            </ProFormDependency>
                            <ProFormTextArea label="审批意见" rules={[{ required: true, message: '审批意见不能为空' }]} name="commentContent"/>
                            <ProFormUploadButton
                                name="attachmentId"
                                fieldProps={{
                                    onRemove: async (file) => {
                                        const { success } = await delAttachment(file.response.result);
                                        return success;
                                    }
                                }}
                                label="附件" max={1}
                                action={addAttachment(entity.taskId, entity.processInstanceId)} />
                        </ModalForm>
                        <ModalForm
                            width="25%"
                            onFinish={async (values) => {
                                const { success } = await executeTask({
                                    ...values, flowCommentType: 'CANCELLATION',
                                    processInstanceId: entity.processInstanceId,
                                    taskId: entity.taskId
                                });
                                return success;
                            }}
                            trigger={<Button type="primary" danger>流程作废</Button>}>
                            <ProFormTextArea name="commentContent" label="作废原因" rules={[{ required: true, message: '作废原因不能为空' }]}/>
                        </ModalForm>

                    </Space>
                }}
                trigger={<Button type='text' style={{ color: 'purple' }}>执行历史</Button>}>
                <ProList
                    grid={{ column: 1 }}
                    actionRef={listRef}
                    params={{ processInstanceId: entity.processInstanceId }}
                    metas={{
                        avatar: {
                            render: (dom, { duration, assignee }) => {
                                if (duration || duration === 0) {
                                    if (duration < 1000) {
                                        return <Tag color='success'>耗时：{duration}毫秒</Tag>
                                    } else if (duration >= 1000 && duration < 60 * 1000) {
                                        return <Tag color='success'>耗时：{duration/1000}秒</Tag>
                                    } else if (duration >= 60 * 1000 && duration < 60 * 60 * 1000) {
                                        return <Tag color='success'>耗时：{(duration/(60 * 1000)).toFixed(0)}分钟</Tag>
                                    } else if (duration >= 60 * 60 * 1000 && duration < 24 * 60 * 60 * 1000) {
                                        return <Tag color='success'>耗时：{(duration/(60 * 60 * 1000)).toFixed(2)}小时</Tag>
                                    } else if (duration >= 24 * 60 * 60 * 1000) {
                                        return <Tag color='warning'>耗时：{(duration/(24 * 60 * 60 * 1000)).toFixed(2)}天</Tag>
                                    }
                                }
                                return <Tag color='orange'>{assignee ? '待办' : '任务待签收'}</Tag>
                            }
                        },
                        title: {
                            dataIndex: 'taskName'
                        },
                        subTitle: {
                            dataIndex: 'assignee',
                            render: (dom, { assignee, candidateUsers, candidateGroups }) => {
                                if (candidateGroups && candidateGroups.length) {
                                    return <Tag color="purple">候选组:
                                        <ProField text={candidateGroups} mode="read" request={() => groups}/>
                                    </Tag>
                                }
                                return <Tag color="purple">
                                    {assignee ? '执行人: ' : '候选人: '}
                                    <ProField text={assignee ?? candidateUsers} mode="read" request={() => users}/>
                                </Tag>
                            }
                        },
                        content: {
                            render: (dom, entity) => <ProDescriptions column={3}>
                                <ProDescriptions.Item label="任务节点">{entity.taskDefKey}</ProDescriptions.Item>
                                <ProDescriptions.Item label="开始时间">{entity.startTime}</ProDescriptions.Item>
                                <ProDescriptions.Item label="结束时间">{entity.endTime}</ProDescriptions.Item>
                            </ProDescriptions>
                        },
                        actions: {
                            render: (dom, { comments, taskName }) => <Space>
                                {(comments && comments.length) ?
                                <ModalForm
                                    submitter={{ render: false }}
                                    title={`${taskName}-审批意见`}
                                    trigger={<Button type="text" style={{ color: '#ff7a45' }}>审批意见</Button>}>
                                    <div style={{ maxHeight: '600px', overflow: 'auto', scrollbarWidth: 'thin' }}>
                                        <Descriptions bordered size="small" style={{ width: '100%' }} column={2}>
                                            {
                                                comments.map(item => {
                                                    const action = actionType.find(i => i.value == item.flowCommentType);
                                                    let commentContent = item.commentContent, filename;
                                                    if (item.attachmentId) {
                                                        const content = JSON.parse(commentContent);
                                                        filename = content.filename;
                                                        commentContent = content.message;
                                                    }
                                                    return <>
                                                        <Descriptions.Item label="操作类型">
                                                            <Tag color={action.color}>{action.label}</Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="操作人">{item.assigneeName}</Descriptions.Item>
                                                        <Descriptions.Item label="操作时间">{item.commentTime}</Descriptions.Item>
                                                        { action.value == '6' && <Descriptions.Item label="委派人">
                                                            <ProField mode='read' text={item.userId} valueType="select" request={() => users}/>
                                                        </Descriptions.Item> }
                                                        { action.value == '7' && <Descriptions.Item label="转办人">
                                                            <ProField mode='read' text={item.userId} valueType="select" request={() => users}/>
                                                        </Descriptions.Item> }
                                                        <Descriptions.Item span={3} label="意见">{commentContent}</Descriptions.Item>
                                                        {filename && <Descriptions.Item span={3} label="附件">
                                                            <a target={'_blank'} href={getAttachment(item.attachmentId)}>{filename}</a>
                                                        </Descriptions.Item>}
                                                    </>
                                                })
                                            }
                                        </Descriptions>
                                    </div>
                                </ModalForm> : null}
                            </Space>
                        }
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
            scroll={{ y: 600 }}
            columns={columns(users).concat(actionColumns)}
            pagination={false}
            rowKey="processInstanceId"
            actionRef={table}/>
    </PageContainer>

}