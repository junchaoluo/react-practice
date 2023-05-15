import { memo, forwardRef } from 'react'
import { Modal } from 'antd'

type IProps = {
    visible: boolean, // 弹窗是否显示
    checked?: Array<never>, // 已选中的
    disabledList?: Array<never>, // 禁用的
    departmentData: Array<never>, // 部门数据
}

const ChooseUser = memo(forwardRef((props: IProps, ref: any) => {
    console.log(props, ref)
    const {visible} = props
    return (
        <Modal open={visible} title="选择人员"></Modal>
    )
}))

export default ChooseUser;