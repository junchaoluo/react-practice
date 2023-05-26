import { FC, useContext } from 'react'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'
import ChooseUseContext from '@/components/chooseUser/chooseUserContext'

type IProps = {
}

const UserList: FC<IProps> = (props) => {
    const ctx = useContext(ChooseUseContext)
    const { userList = [], checkedList = [], isSingle = false} = ctx

    console.log(props, userList, checkedList, isSingle)
    return (
        <div>UserList</div>
    )
}
export default UserList;