import { memo, forwardRef, useState, useEffect, useCallback, FC } from 'react'
import { Modal } from 'antd'
import style from './index.module.scss'
import SearchStaffInput from '@/components/searchStaffInput'
import DeptList from '@/components/chooseUser/deptList'
import UserList from '@/components/chooseUser/userList'
import SelectedList from '@/components/chooseUser/selected'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'
import { getUserList, UserSearchParam } from '@/api/user'

type IProps = {
    visible: boolean, // 弹窗是否显示
    checked?: Array<SelectProps>, // 已选中的
    disabledList?: Array<SelectProps>, // 禁用的
    departmentData?: Array<DepartmentProps>, // 部门数据
    title?: string, // title
    closeModal: () => void,
    isSingle: boolean // 是否单选
}

const ChooseUser: FC<IProps & HTMLElement> = memo(forwardRef((props:IProps, ref: HTMLElement) => {
    const { visible, title = '重庆博腾制药科技股份有限公司', closeModal, disabledList = [], checked = [], departmentData = [], isSingle = false} = props

    const [checkedList, setCheckedList] = useState<Array<SelectProps>>(checked) // 选中的人员
    const [department, setDepartment] = useState<Array<DepartmentProps>>(departmentData) // 部门数据
    const [previousOptions, setPreviousOptions] = useState<Array<SelectProps>>([]) // 上一步数据
    const [userList, setUserList] = useState<Array<SelectProps>>([]) // 人员数据
    const [showUserSelect, setShowUserSelect] = useState(false) // 展示人员还是部门数据

    useEffect(() => {
        setDepartment(departmentData)
    }, [departmentData])

    const afterOpenChange = useCallback((openVisible: boolean) => {
        if(!openVisible) {
            setCheckedList([])
        }
    }, [visible])

    // 右上角搜索选中
    const SelectUser = useCallback((user: SelectProps) => {
        // 查看checked是否有此信息
        const isExist = checkedList?.filter(item => item.id === user.id)
        if(!(isExist && isExist.length > 0)) {
            setCheckedList([...checkedList, user])
        }
    }, [checkedList])

    // 删除选中的
    const DeleteSelect = useCallback((user: SelectProps) => {
        setCheckedList(checkedList.filter(item => item.id !== user.id))
    }, [checkedList])

    // 部门点击下级
    const onNext = useCallback((dep: DepartmentProps) => {
        setPreviousOptions([...previousOptions, dep])
        if(!dep.childNode || dep.childNode.length === 0){
            // childNode 无的话就是最后一级，就可以查询人员了
            setShowUserSelect(true)
            getStaffList(dep.id, true)
        }else{
            // 否则显示下一级部门列表
            setShowUserSelect(false)
            setDepartment(dep.childNode)
        }
    }, [])

    const getStaffList = async (id: string, reset: boolean) => {
        const param:UserSearchParam = { departmentId: id, keywords: '', pageIndex: 1, pageSize: 1000 }
        const { result } = await getUserList(param)
        const { list } = result
        const options = reset ? [...list] : [...userList, ...list]
        const newArr = options.map(r => {
            r.name = r.realName
            r.checked = checkedList.findIndex(o => o.id === r.id) > -1
            return r
        })
        setUserList(newArr.filter(m => !disabledList.includes(m.id)) || [])
    }

    // 选中部门数据
    const changeCheckDep = (dep: DepartmentProps, checked: boolean) => {
        if(checked){
            // 选中
            dep.checked = true
            setCheckedList([...checkedList, dep])
        }else{
            // 取消选中
        }
    }

    // 返回上一级
    const prevStep = () => {
        setShowUserSelect(false)
        const popDepar = previousOptions.pop() as DepartmentProps
        setDepartment(popDepar)
    }

    return (
        <Modal width={800} afterOpenChange={afterOpenChange} ref={ref} open={visible} bodyStyle={{height: '500px', padding: 0}} style={{padding: 0}} title="选择人员" cancelText="取消" okText="确定" destroyOnClose={true} onOk={() => closeModal()} onCancel={() => closeModal()}>
            <div className={style.header}>
                <div className={style.title}>{title}</div>
                <div className={style.search}>
                    <SearchStaffInput SelectUser={SelectUser} isSingle={isSingle} disabledList={disabledList} checkedList={checkedList}/>
                </div>
            </div>
            <div className={style.userManage}>
                <div className={style.userSelect}>
                    {
                        showUserSelect?
                        <UserList isSingle={isSingle} options={userList} checkedList={[]}/>
                        :
                        <DeptList
                            isSingle={isSingle} 
                            options={department} 
                            onNext={onNext} 
                            previousOptions={previousOptions} 
                            changeCheckDep={changeCheckDep}
                            prevStep={prevStep}/>
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