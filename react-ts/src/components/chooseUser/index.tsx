import { memo, forwardRef, useState, useEffect, useCallback, FC } from 'react'
import { Modal } from 'antd'
import style from './index.module.scss'
import SearchStaffInput from '@/components/searchStaffInput'
import DeptList from '@/components/chooseUser/deptList'
import UserList from '@/components/chooseUser/userList'
import SelectedList from '@/components/chooseUser/selected'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'

type IProps = {
    visible: boolean, // 弹窗是否显示
    checked?: Array<SelectProps>, // 已选中的
    disabledList?: Array<SelectProps>, // 禁用的
    departmentData?: Array<DepartmentProps>, // 部门数据
    title?: string, // title
    closeModal: () => void
}

const ChooseUser: FC<IProps & HTMLElement> = memo(forwardRef((props:IProps, ref: HTMLElement) => {
    console.log(props, ref)
    const { visible, title = '重庆博腾制药科技股份有限公司', closeModal, disabledList = [], checked = [], departmentData} = props

    const [checkedList, setCheckedList] = useState<Array<SelectProps>>(checked)
    const [department, setDepartment] = useState(departmentData || [])
    const [showUserSelect, setShowUserSelect] = useState(false)

    // 右上角搜索选中
    const SelectUser = (user: SelectProps) => {
        // 查看checked是否有此信息
        const isExist = checkedList?.filter(item => item.id === user.id)
        if(!(isExist && isExist.length > 0)) {
            setCheckedList([...checkedList, user])
        }
    }

    // 删除选中的
    const DeleteSelect = (user: SelectProps) => {
        setCheckedList(checkedList.filter(item => item.id !== user.id))
    }

    const afterOpenChange = useCallback((openVisible: boolean) => {
        console.log(openVisible)
        if(!openVisible) {
            setCheckedList([])
        }
    }, [open])

    return (
        <Modal width={800} afterOpenChange={afterOpenChange} ref={ref} open={visible} bodyStyle={{height: '500px', padding: 0}} style={{padding: 0}} title="选择人员" cancelText="取消" okText="确定" destroyOnClose={true} onOk={() => closeModal()} onCancel={() => closeModal()}>
            <div className={style.header}>
                <div className={style.title}>{title}</div>
                <div className={style.search}>
                    <SearchStaffInput SelectUser={SelectUser} disabledList={disabledList} checkedList={checkedList}/>
                </div>
            </div>
            <div className={style.userManage}>
                <div className={style.userSelect}>
                    {
                        showUserSelect?
                        <UserList checkedList={[]}/>
                        :
                        <DeptList options={department}/>
                    }
                </div>
                <div className={style.userSelected}>
                    <SelectedList checkedList={checkedList} DeleteSelect={DeleteSelect}/>
                </div>
            </div>
        </Modal>
    )
}))

export default ChooseUser;