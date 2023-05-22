import { memo, forwardRef, useState, useEffect, useCallback } from 'react'
import { Modal } from 'antd'
import style from './index.module.scss'
import SearchStaffInput from '@/components/searchStaffInput'
import { SearchUser, Department } from '@/types/user'

type UserProps = SearchUser
type DepartmentProps = Department

type IProps = {
    visible: boolean, // 弹窗是否显示
    checked?: Array<UserProps>, // 已选中的
    disabledList?: Array<UserProps>, // 禁用的
    departmentData?: Array<DepartmentProps>, // 部门数据
    title?: string, // title
    closeModal: () => void
}

const ChooseUser = memo(forwardRef((props:IProps, ref: HTMLElement) => {
    console.log(props, ref)
    const { visible, title = '重庆博腾制药科技股份有限公司', closeModal, disabledList = [], checked = [], departmentData = []} = props

    const [checkedList, setCheckedList] = useState(checked)
    const [department, setDepartment] = useState(departmentData)

    useEffect(() => {
        getDepartmentData()
    }, [visible])

    const getDepartmentData = useCallback(() => {
        console.log('123')
    }, [])

    // 右上角搜索选中
    const SelectUser = (user: SearchUser) => {
        // 查看checked是否有此信息
        const isExist = checked?.filter(item => item.id === user.id)
        if(!(isExist && isExist.length > 0)) {
            setCheckedList([...checkedList, user])
        }
    }

    return (
        <Modal width={800} ref={ref} open={visible} bodyStyle={{height: '500px', padding: 0}} style={{padding: 0}} title="选择人员" cancelText="取消" okText="确定" destroyOnClose={true} onOk={() => closeModal()} onCancel={() => closeModal()}>
            <div className={style.header}>
                <div className={style.title}>{title}</div>
                <div className={style.search}>
                    <SearchStaffInput SelectUser={SelectUser} disabledList={disabledList} checkedList={checkedList}/>
                </div>
            </div>
            <div className={style.userManage}>
                <div className={style.userSelect}></div>
                <div className={style.userSelected}>
                    {
                        checkedList.map((item: SearchUser) => {
                            return <div key={item.id}>{item.name}</div>
                        })
                    }
                </div>
            </div>
        </Modal>
    )
}))

export default ChooseUser;