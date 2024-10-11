import { DeleteOutlined, DeploymentUnitOutlined, EditOutlined, FileAddTwoTone } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProFormSelect, ProFormText, ProFormTextArea, ProList } from "@ant-design/pro-components"
import { Alert, Button, Space, Image, Popover, Tag, Popconfirm, message, Modal } from "antd"
import React from "react"
import { useModel, history } from '@umijs/max';
import { loadTableData, typeOptions } from "./props"
import { save, deleteById, deploymentModel } from "./props/service";
import defaultImg from '@/assets/default.png';
import './index.less';
import { EasyFlowable } from "easy-flowable-react"

export default () => {

    const { initialState } = useModel('@@initialState');
    const { users, groups } = initialState;
    const list = React.useRef<ActionType>();
    const [state, setState] = React.useState<{ dataInfo: any; open: boolean; title: string; }>({
        open: false,
        title: '',
        dataInfo: {}
    });

    const reloadTable = () => {
        // @ts-ignore
        list.current?.reloadAndRest();
    }


    return <PageContainer title="流程模型">
        <ProList ghost
                 itemCardProps={{
                     ghost: true,
                 }}
            grid={{ gutter: 16, column: 4 }}
            request={loadTableData}
            actionRef={list}
            style={{ padding: 0 }}
            rowKey="id"
            pagination={{ pageSize: 8, pageSizeOptions: [8, 16, 32], showSizeChanger: true }}
            search={{}}
            metas={{
                title: {
                    dataIndex: 'name',
                    title: '模型名称'
                },
                subTitle: {
                    valueType: 'select',
                    dataIndex: 'modelType',
                    // @ts-ignore
                    request: async () => typeOptions,
                    title: '流程类型'
                },
                avatar: {
                    render: (dom, record) => <Tag
                        color={record.publishVersion > 0 ? 'success' : 'blue'}>
                        {record.publishVersion > 0 ? `V${record.publishVersion}` : '暂未部署'}
                    </Tag>,
                    search: false,
                },
                type: {
                    dataIndex: 'key',
                    title: '流程标识'
                },
                content: {
                    search: false,
                    render: (dom, record) => {
                        return <Space direction="vertical">
                            <Image width='100%' height="100px" preview={false} src={record.thumbnail || defaultImg} />
                            <Popover title={record.remarks && '描述'} content={record.remarks && record.remarks}>
                                <Space direction="vertical">
                                    <span>流程标识: {record.key}</span>
                                    <span>最后更新时间：{record.updateTime}</span>
                                </Space>
                            </Popover>
                        </Space>
                    }
                },
                actions: {
                    search: false,
                    cardActionProps: 'actions',
                    render: (dom, record) => [
                        <Popconfirm title="提示" description="是否部署该模型？部署后启动的流程将以最新版本为主！" onConfirm={async () => {
                            const res = await deploymentModel(record.id);
                            if (res.success) {
                                message.success('部署成功！');
                                reloadTable();
                            } else {
                                message.error(res.message);
                            }
                        }}>
                            <Button type='link' key={'deployment_' + record.id} icon={<DeploymentUnitOutlined />}>部署</Button>
                        </Popconfirm>,
                        <Button type='link' key={'history_' + record.id} onClick={() => {
                            const { id, name, modelEditorXml } = record;
                            history.push('/modelHistory', { modelId: id, title: name, xml: modelEditorXml });
                        }}>历史版本</Button>,
                        <Popover content="可视化编辑器">
                            <Button type='link' key={'edit_' + record.id} icon={<EditOutlined />} onClick={() => {
                                setState({ dataInfo: record, open: true, title: record.name })
                            }}>编辑</Button>
                        </Popover>,
                        <Popconfirm title="提示" description="是否确认删除该模型？" onConfirm={async () => {
                            const res = await deleteById(record.id);
                            if (res.success) {
                                message.success('删除成功！');
                                reloadTable();
                            } else {
                                message.error(res.message);
                            }
                        }}>
                            <Button type='link' danger key={'delete_' + record.id} icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                    ],
                },
            }}
            headerTitle={<ModalForm title="创建一个新的业务流程模型" width="30%" onFinish={async (params) => {
                const res = await save(params);
                if (res.success) {
                    message.success('新增成功！');
                    reloadTable();
                } else {
                    message.error(res.message);
                }
                return res.success;
            }} trigger={<Button icon={<FileAddTwoTone />}>新增模型</Button>}>
                <Alert message="您需要为新模型命名，并且您可以在这个操作中添加描述信息。" />
                <ProFormSelect name="modelType" label="模型类型" options={typeOptions} rules={[{ required: true, message: '模型标识不能为空' }]} />
                <ProFormText name="name" label="模型名称" rules={[{ required: true, message: '模型名称不能为空' }, { max: 60, message: '模型名称长度最多60个字符' }]} />
                <ProFormText name="key" label="模型标识" rules={[{ required: true, message: '模型标识不能为空' }, { max: 60, message: '模型标识长度最多60个字符' }]} />
                <ProFormTextArea name="remarks" label="描述" rules={[{ max: 400, message: '模型标识长度最多400个字符' }]} />
            </ModalForm>} />
        <Modal title={false} open={state.open}
            closable={false}
            onCancel={() => setState({ ...state, open: false })}
            centered width="100%"
            keyboard mask={false}
            footer={false}>
            <EasyFlowable
                height={89}
                toolbar={{
                    isBase64: true,
                    save: async (xml, base64) => {
                        const { success, result } = await save({ ...state.dataInfo, modelEditorXml: xml, thumbnail: base64 });
                        if (success) {
                            setState({ ...state, open: false });
                            reloadTable();
                        }
                    }
                }}
                panel={{
                    users,
                    groups,
                }}
                data={state.dataInfo.modelEditorXml}
                flowKey={state.dataInfo.key}
                flowName={state.dataInfo.name} />
        </Modal>
    </PageContainer>
}