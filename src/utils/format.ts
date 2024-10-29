/**
 * 操作枚举
 */
export enum FLOW_ACTION {
  AGREE = 'AGREE',
  REBUT = 'REBUT',
  REVOCATION = 'REVOCATION',
  REJECT = 'REJECT',
  REJECT_TO_TASK = 'REJECT_TO_TASK',
  DELEGATE = 'DELEGATE',
  ASSIGN = 'ASSIGN',
  CANCELLATION = 'CANCELLATION',
  ADD_COMMENT = 'ADD_COMMENT',
  DEL_COMMENT = 'DEL_COMMENT',
}

export const actionType = [
  { label: '启动流程', value: '0', color: 'lime' },
  { label: '同意', value: '1', color: 'green' },
  { label: '拒绝', value: '2', color: 'purple' },
  { label: '撤回', value: '3', color: 'orange' },
  { label: '驳回', value: '4', color: 'magenta' },
  { label: '驳回到指定节点', value: '5', color: 'volcano' },
  { label: '委派', value: '6', color: 'blue' },
  { label: '转办', value: '7', color: 'cyan' },
  { label: '终止', value: '8', color: 'red' },
  { label: '前加签', value: '9', color: 'blue' },
  { label: '后加签', value: '10', color: 'blue' },
  { label: '作废', value: '11', color: 'red' },
  { label: '评论', value: '12', color: 'geekblue' },
];