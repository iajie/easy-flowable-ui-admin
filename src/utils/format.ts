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

export const actionOptions = [
  { label: '审批', value: 'AGREE' },
  { label: '评论', value: 'ADD_COMMENT' },
  { label: '驳回', value: 'REJECT' },
  { label: '驳回到指定节点', value: 'REJECT_TO_TASK' },
  { label: '委派', value: 'DELEGATE' },
  { label: '转办', value: 'ASSIGN' },
  // { label: '前加签', value: 'BEFORE_SIGN' },
  // { label: '后加签', value: 'AFTER_SIGN' },
];