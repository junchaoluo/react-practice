import { createContext } from "react";
import { SelectProps, DepartmentProps } from '@/types/chooseUser'

type contextProps = {
    checkedList?: Array<SelectProps>, // 已选中的
    disabledList?: Array<SelectProps>, // 禁用的
    userList?: Array<SelectProps>, // 禁用的
    department?: Array<DepartmentProps>, // 部门数据
    previousOptions?: Array<DepartmentProps>, // 部门数据
    isSingle: boolean // 是否单选
}

const ChooseUseContext = createContext({
    checkedList: [],
    disabledList: [],
    department: [],
    previousOptions: [],
    userList: [],
    isSingle: false
} as contextProps)

export default ChooseUseContext