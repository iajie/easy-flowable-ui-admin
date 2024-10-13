import React from "react";
import { useLocation } from '@umijs/max';
import { ActionType, ProTable, ProColumns } from "@ant-design/pro-components";
import { rollback } from './props/service';
import { columns, loadTableData } from "./props";
import {Button, message, Modal, Popconfirm} from "antd";
import {EasyFlowable} from "easy-flowable-react";

export default () => {

	const { state }: any = useLocation();
	const table = React.useRef<ActionType>();

	const actionColumns: ProColumns[] = [{
		title: '操作',
		valueType: 'option',
		render: (dom, entity) => [
			<Button key={"view_" + entity.id} onClick={() => {
				Modal.info({
					title: false, closable: false, centered: true, icon: null,
					width: '100%', keyboard: true, mask: false, footer: false,
					content: <EasyFlowable height={89} data={entity.modelEditorXml}/>
				});
			}} type="link">查看</Button>,
			// <Button key={"compare_" + entity.id} type="link">比较</Button>,
			<Popconfirm title="提示" key={"rollback_" + entity.id} description="是否回滚该版本？" onConfirm={async () => {
				const res = await rollback(entity.id);
				if (res.result === true) {
					message.success('回滚成功');
				} else {
					message.error(res.message);
				}
			}}>
				<Button type="link">回滚</Button>
			</Popconfirm>
		]
	}];

	return <ProTable
		headerTitle={state?.title || '流程部署历史'}
		params={{ modelId: state?.modelId }}
		request={loadTableData}
		search={false}
		columns={columns.concat(actionColumns)}
		pagination={{}}
		rowKey="id"
		actionRef={table}/>

}