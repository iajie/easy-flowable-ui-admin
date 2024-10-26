import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    ProList, ProFormSelect
} from "@ant-design/pro-components";
import { columns, loadTableData } from "./props";
import { Button, Dropdown, Space, Image, Modal, Drawer, Tag } from "antd";
import { deploymentImage, deploymentState, flowUserTaskList } from "@/pages/Flow/props/service";
import { useRef, useState } from "react";
import { DownOutlined, FileImageFilled, UserOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";

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
                            label: '部署图片',
                            icon: <FileImageFilled/>,
                            key: 'iamge',
                            onClick: async () => {
                                Modal.info({
                                    footer: false,
                                    width: '50%',
                                    centered: true,
                                    closable: true,
                                    content: <Image preview={false} src={deploymentImage(entity.processDefinitionId)}/>
                                })
                            }
                        },
                        {
                            label: '用户任务',
                            icon: <UserOutlined/>,
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