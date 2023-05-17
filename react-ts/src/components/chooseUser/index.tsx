import { memo, forwardRef } from 'react'
import { Modal } from 'antd'
import style from './index.module.scss'
import SearchStaffInput from '@/components/searchStaffInput'

type IProps = {
    visible: boolean, // 弹窗是否显示
    checked?: Array<never>, // 已选中的
    disabledList?: Array<never>, // 禁用的
    departmentData: Array<never>, // 部门数据
    title?: string, // title
    closeModal: () => void
}

const ChooseUser = memo(forwardRef((props:IProps, ref: HTMLElement) => {
    console.log(props, ref)
    const { visible, title = '重庆博腾制药科技股份有限公司', closeModal} = props
    return (
        <Modal width={800} ref={ref} open={visible} title="选择人员" destroyOnClose={true} onCancel={() => closeModal}>
            <div className={style.header}>
                <div className={style.title}>{title}</div>
                <div className={style.search}>
                    <SearchStaffInput/>
                </div>
            </div>
        </Modal>
    )
}))

export default ChooseUser;