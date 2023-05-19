import { FC, memo } from 'react'
import { SearchUser } from '@/types/user'

type IProps = {
    user: SearchUser
}

const CustomSearchOption: FC<IProps> = memo(() => {
    return (
        <div>CustomSearchOption</div>
    )
})
export default CustomSearchOption;