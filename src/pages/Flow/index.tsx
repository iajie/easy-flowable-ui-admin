import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    ProList, ProFormSelect, ProFormText, ProFormRadio, ModalForm, ProFormList, ProFormGroup
} from "@ant-design/pro-components";
import { columns, loadTableData } from "./props";
import { Button, Dropdown, Space, Image, Modal, Drawer, Tag, message } from "antd";
import { deploymentImage, deploymentState, flowUserTaskList, startFlow } from "@/pages/Flow/props/service";
import { useRef, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useModel, history } from "@umijs/max";

export default () => {

    const { initialState } = useModel('@@initialState');
    const { users, groups } = initialState;
    const userOptions = users.concat({ value: '${initiator}', label: '流程发起人' })
    const table = useRef<ActionType>();
    const [userTask, setUserTask] = useState<{ open: boolean; list: any[]; }>({
        open: false,
        list: []
    });

    const actionColumn: ProColumns[] = [
        {
            title: '操作',
            align: 'center',
            render: (dom, entity) => <Space>
                <Button onClick={ async () => {
                    const { success } = await deploymentState(entity.processDefinitionId);
                    if (success) {
                        table.current?.reloadAndRest();
                    }
                } }
                    style={{ color: entity.suspensionState == 2 ? '#bae637' : '#ff4d4f' }} type='link'>
                    {entity.suspensionState == 2 ? '激活' : '终止'}
                </Button>
                <Dropdown menu={{ items: [
                        {
                            label: <ModalForm
                                request={async () => ({
                                    processDefinitionId: entity.processDefinitionId,
                                    flowKey: entity.key,
                                    skipFirstNode: true,
                                })}
                                onFinish={ async (values) => {
                                    const variables: any = {};
                                    if (values.variables && values.variables.length) {
                                        values.variables.forEach(item => {
                                            variables[item.key] = item.value;
                                        });
                                    }
                                    const { success } = await startFlow({ ...values, variables });
                                    if (success) {
                                        message.success('流程启动成功!');
                                    }
                                    return success;
                                }}
                                title="启动流程"
                                trigger={<Button type="link" style={{ color: '#ff7a45' }}>🚀 启动流程</Button>}>
                                <ProFormText label="流程定义ID" disabled name="processDefinitionId"/>
                                <ProFormText label="流程标识" disabled name="flowKey"/>
                                <ProFormText label="业务主键" name="businessKey"
                                             rules={[{ required: true, message: '业务主键不能为空' }]}
                                             tooltip="该参数一般为主表中ID，且在流程实例中唯一，建议使用UUID或雪花算法生成"/>
                                <ProFormRadio.Group label="是否跳过开始节点" name="skipFirstNode"
                                                    options={[{ label: '是', value: true }, { lebel: '否', value: false }]}/>
                                <ProFormText label="流程名称" name="processName" tooltip="在流程引擎中名称"/>
                                <ProFormList name="variables" creatorButtonProps={{ creatorButtonText: '添加流程变量' }}>
                                    <ProFormGroup >
                                        <ProFormText label="key" name="key" rules={[{ required: true, message: '流程变量key不能为空' }]} />
                                        <ProFormText label="value" name="value" width="md" rules={[{ required: true, message: '流程变量value不能为空' }]} />
                                    </ProFormGroup>
                                </ProFormList>
                            </ModalForm>,
                            key: 'start',
                        },
                        {
                            label: <Button type="link" style={{ color: '#5b8c00' }}>🏞️ 部署图片</Button>,
                            key: 'iamge',
                            onClick: async () => {
                                Modal.info({
                                    footer: false, width: '50%', centered: true,
                                    closable: true, icon: null,
                                    content: <Image preview={false} src={deploymentImage(entity.processDefinitionId)}/>
                                })
                            }
                        },
                        {
                            label: <Button type="link" style={{ color: '#08979c' }}>👨 用户任务</Button>,
                            key: 'userTask',
                            onClick: async () => {
                                const result = await flowUserTaskList(entity.key);
                                if (result.success) {
                                    setUserTask({
                                        open: true,
                                        list: result.result
                                    })
                                }
                            }
                        },
                        {
                            label: <Button type="link" style={{ color: '#6d37be' }}>🎸 流程实例</Button>,
                            key: 'processInstance',
                            onClick: () => {
                                history.push('/processInstance', { processDefinitionId: entity.processDefinitionId, name: entity.name })
                            }
                        },
                ] }}>
                    <Button type="link">更多<DownOutlined /></Button>
                </Dropdown>
            </Space>
        }
    ];

    return <PageContainer>
        <ProTable
            actionRef={table}
            request={loadTableData}
            scroll={{ y: 670 }}
            rowKey="processDefinitionId"
            columns={ columns.concat(actionColumn) }/>
        <Drawer open={userTask.open} onClose={() => setUserTask({ ...userTask, open: false })} title="用户任务列表">
            <ProList
                metas={{
                    title: {
                        dataIndex: 'name'
                    },
                    subTitle: {
                        dataIndex: 'id',
                        render: (dom, entity) => <Tag color='success'>{entity.id}</Tag>
                    },
                    description: {
                        render: (dom, entity) => {
                            if (entity.candidateUsers.length) {
                                return <ProFormSelect
                                    readonly
                                    fieldProps={{
                                        value: entity.candidateUsers
                                    }}
                                    label="候选人"
                                    mode="multiple"
                                    request={async () => users}/>;
                            } else if (entity.candidateGroups.length) {
                                return <ProFormSelect
                                    readonly
                                    fieldProps={{
                                        value: entity.candidateGroups
                                    }}
                                    label="候选组"
                                    mode="multiple"
                                    request={async () => groups}/>;
                            }
                            return <ProFormSelect
                                readonly label="执行人"
                                fieldProps={{
                                    value: entity.assignee
                                }}
                                request={async () => userOptions}/>;
                        }
                    }
                }}
                dataSource={userTask.list}/>
        </Drawer>
    </PageContainer>
}