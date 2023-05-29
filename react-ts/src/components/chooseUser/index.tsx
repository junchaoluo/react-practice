import { memo, forwardRef, useState, useEffect, useCallback, FC, useImperativeHandle, ForwardedRef } from 'react'
import { Modal } from 'antd'
import style from './index.module.scss'
import SearchStaffInput from '@/components/searchStaffInput'
import DeptList from '@/components/chooseUser/deptList'
import UserList from '@/components/chooseUser/userList'
import SelectedList from '@/components/chooseUser/selected'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'
import { getUserList, UserSearchParam } from '@/api/user'
import ChooseUserContext from './context/chooseUserContext'

type IProps = {
    visible: boolean, // 弹窗是否显示
    checked?: Array<SelectProps>, // 已选中的
    disabledList?: Array<SelectProps>, // 禁用的
    departmentData?: Array<DepartmentProps>, // 部门数据
    title?: string, // title
    closeModal: () => void,
    confirm: (select: Array<SelectProps> | SelectProps) => void,
    isSingle: boolean, // 是否单选
    isDepartmentCheck?: boolean, // 是否可以选择部门
    isUserCheck?: boolean, // 是否可以选择人员
}

const getStaffList = async (id: string, reset: boolean, checkedList: Array<SelectProps>, userList: Array<SelectProps>, disabledList: Array<SelectProps>) => {
    const param:UserSearchParam = { departmentId: id, keywords: '', pageIndex: 1, pageSize: 1000 }
    const { result } = await getUserList(param)
    const { list } = result
    const options = reset ? [...list] : [...userList, ...list]
    const newArr = options.map(r => {
        r.name = r.realName
        r.checked = checkedList.findIndex(o => o.id === r.id) > -1
        return r
    })
    const arr: Array<SelectProps> = newArr.filter(m => !disabledList.includes(m.id)) || []
    return arr
}

const ChooseUser: FC<IProps & HTMLElement> = memo(forwardRef((props:IProps, ref: ForwardedRef) => {
    const { visible, title = '重庆博腾制药科技股份有限公司', closeModal, disabledList = [], checked = [], departmentData = [], isSingle = false, isDepartmentCheck = true, isUserCheck = true, confirm} = props

    const [checkedList, setCheckedList] = useState<Array<SelectProps>>(checked) // 选中的人员
    const [department, setDepartment] = useState<Array<DepartmentProps>>(departmentData) // 部门数据
    const [previousOptions, setPreviousOptions] = useState<Array<Array<DepartmentProps>>>([[]]) // 上一步数据
    const [userList, setUserList] = useState<Array<SelectProps>>([]) // 人员数据
    const [showUserSelect, setShowUserSelect] = useState(false) // 展示人员还是部门数据

    useImperativeHandle(ref, () => ({
        checkedList
    }), [visible])

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
        // userList和departmentList的check值改变
        const userArr = userList.map(item =>{
            if(item.id === user.id) {
                item.checked = false
            }
            return item
        })
        setUserList(userArr)
        const departmentArr = department.map(item =>{
            if(item.id === user.id) {
                item.checked = false
            }
            return item
        })
        setDepartment(departmentArr)
    }, [checkedList, userList, department])

    // 部门点击下级
    const onNext = useCallback(async (dep: DepartmentProps) => {
        const arr1 = [...previousOptions]
        arr1.push(department)
        setPreviousOptions(arr1)
        if(!dep.childNode || dep.childNode.length === 0){
            // childNode 无的话就是最后一级，就可以查询人员了
            setShowUserSelect(true)
            const arr: Array<SelectProps> = await getStaffList(dep.id, true, checkedList, userList, disabledList)
            setUserList(arr)
        }else{
            // 否则显示下一级部门列表
            setShowUserSelect(false)
            setDepartment(dep.childNode)
        }
    }, [checkedList, userList, disabledList, department, previousOptions])
    
    // 返回上一级
    const prevStep = useCallback(() => {
        setShowUserSelect(false)
        const popDepar = previousOptions.pop() as Array<DepartmentProps>
        setDepartment(popDepar)
    }, [previousOptions])

    // 选中部门/人员数据 type = 0 部门 1 人员
    const changeCheckItem = useCallback((item: SelectProps, checked: boolean, type: number) => {
        item.checked = checked
        if(checked){
            // 选中
            setCheckedList([...checkedList, item])
        }else{
            // 取消选中
            setCheckedList(checkedList.filter(i => i.id !== item.id))
        }
    }, [checkedList])

    return (
        <Modal width={800} afterOpenChange={afterOpenChange} ref={ref} open={visible} bodyStyle={{height: '500px', padding: 0}} style={{padding: 0}} title="选择人员" cancelText="取消" okText="确定" destroyOnClose={true} onOk={() => confirm(checkedList)} onCancel={() => closeModal()}>
            <ChooseUserContext.Provider
             value={{
                checkedList: checkedList,
                disabledList: disabledList, 
                department: department, 
                previousOptions: previousOptions, 
                userList: userList, 
                isSingle: isSingle, 
                isDepartmentCheck: isDepartmentCheck, 
                isUserCheck: isUserCheck,
                prevStep: prevStep
            }}>
                <div className={style.header}>
                    <div className={style.title}>{title}</div>
                    <div className={style.search}>
                        <SearchStaffInput SelectUser={SelectUser}/>
                    </div>
                </div>
                <div className={style.userManage}>
                    <div className={style.userSelect}>
                        {
                            showUserSelect?
                            <UserList changeCheckItem={changeCheckItem} prevStep={prevStep}/>
                            :
                            <DeptList
                                onNext={onNext} 
                                changeCheckItem={changeCheckItem}
                                prevStep={prevStep}/>
                        }
                    </div>
                    <div className={style.userSelected}>
                        <SelectedList DeleteSelect={DeleteSelect}/>
                    </div>
                </div>
            </ChooseUserContext.Provider>
        </Modal>
    )
}))

export default ChooseUser;