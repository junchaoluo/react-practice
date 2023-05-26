import { createContext } from "react";
import { SelectProps, DepartmentProps } from '@/types/chooseUser'

type contextProps = {
    checkedList?: Array<SelectProps>, // 已选中的
    disabledList?: Array<SelectProps>, // 禁用的
    userList?: Array<SelectProps>, // 禁用的
    department?: Array<DepartmentProps>, // 部门数据
    previousOptions?: Array<Array<DepartmentProps>>, // 部门数据
    isSingle: boolean, // 是否单选
    isDepartmentCheck?: boolean, // 是否可以选择部门
    isUserCheck?: boolean, // 是否可以选择人员
}

const ChooseUseContext = createContext({
    checkedList: [],
    disabledList: [],
    department: [],
    previousOptions: [],
    userList: [],
    isSingle: false,
    isDepartmentCheck: false,
    isUserCheck: false
} as contextProps)

export default ChooseUseContext