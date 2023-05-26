import { FC, useContext } from 'react'
// import style from '@/components/customSearchOption/index.module.scss'
import style from './index.module.scss'
import { getUserDept } from '@/util/user'
import { CloseOutlined, ApartmentOutlined } from '@ant-design/icons'
import { SelectProps, SearchUserProps } from '@/types/chooseUser'
import ChooseUseContext from '@/components/chooseUser/chooseUserContext'

type IProps = {
    title?: string,
    DeleteSelect: (user: SelectProps) => void
}

const SelectedList: FC<IProps> = (props) => {
    const ctx = useContext(ChooseUseContext)
    const { DeleteSelect, title='已选人员' } = props
    const { checkedList = [] } = ctx
    const deleteSelected = (user: SelectProps) => {
        DeleteSelect(user)
    }

    return (
        <>
            <div>{title}</div>
            {
                checkedList.map(((item: SelectProps) => {
                    return (
                        
                        <li key={item.id} className={style.module} style={{maxWidth: '100%', justifyContent: 'space-between'}}>
                            <div className={style.moduleContent}>
                            {
                                item.isUser?
                                <>
                                    <div className={style.avatar}>{item.name ? item.name.slice(-1) : (item as SearchUserProps).realName.slice(-1)}</div><div className={style.userInfo}>
                                        <div className={style.account}>
                                            <span>{item.name || (item as SearchUserProps).realName}</span>
                                            <span className={style.accountText}>{`(${item.account})`}</span>
                                        </div>
                                        <div className={style.dep}>
                                            <span> {getUserDept(item)}</span>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className={style.departmentIcon}>
                                        <ApartmentOutlined style={{ color: 'green' }} />
                                    </div>
                                    <div className={style.userInfo}>
                                        {item.name}
                                    </div>
                                </>
                            }
                            </div>
                            <div className={style.cancel} onClick={() => deleteSelected(item)}>
                                <CloseOutlined style={{color: "#bbbcbf", cursor: 'pointer'}}/>
                            </div>
                        </li>
                    )
                }))
            }
        </>
    )
}
export default SelectedList;