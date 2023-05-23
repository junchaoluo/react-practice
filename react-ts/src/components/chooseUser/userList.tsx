import { FC } from 'react'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'

type IProps = {
    checkedList: Array<SelectProps>,
    options: Array<SelectProps>,
    isSingle: boolean // 是否单选
}

const UserList: FC<IProps> = (props) => {
    console.log(props)
    return (
        <div>UserList</div>
    )
}
export default UserList;