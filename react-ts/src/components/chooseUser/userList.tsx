import { FC } from 'react'
import { SearchUser, Department } from '@/types/user'

type SelectProps = SearchUser & Department & {
    isUser: boolean
}

type IProps = {
    checkedList: Array<SelectProps>
}

const UserList: FC<IProps> = (props) => {
    console.log(props)
    return (
        <div>UserList</div>
    )
}
export default UserList;