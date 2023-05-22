import { FC, memo } from 'react'
import style from './index.module.scss'
import { getUserDept } from '@/util/user'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'

type IProps = {
    user: SelectProps
}

const CustomSearchOption: FC<IProps> = memo((props) => {
    const { user } = props
    return (
        <div className={style.module}>
            <div className={style.avatar}>{user.name ? user.name.slice(-1) : user.realName.slice(-1)}</div>
            <div className={style.userInfo}>
                <div className={style.account}>
                    <span>{ user.name || user.realName }</span>
                    <span className={style.accountText}>{ `(${user.account})` }</span>
                    {
                        user.checked?
                        <span className={style.hasChecked}>已选择</span>
                        :
                        ''
                    }
                </div>
                <div className={style.dep}>
                    <span> { getUserDept(user) }</span>
                </div>
            </div>
        </div>
    )
})
export default CustomSearchOption;