import { FC } from 'react'
import style from '@/components/customSearchOption/index.module.scss'
import depStyle from './index.module.scss'
import { getUserDept } from '@/util/user'
import { CloseOutlined, ApartmentOutlined } from '@ant-design/icons'
import { SelectProps, SearchUserProps } from '@/types/chooseUser'

type IProps = {
    checkedList?: Array<SelectProps>,
    title?: string,
    DeleteSelect: (user: SelectProps) => void
}

const SelectedList: FC<IProps> = (props) => {
    
    const { checkedList = [], title='已选人员', DeleteSelect } = props
    const deleteSelected = (user: SelectProps) => {
        DeleteSelect(user)
    }

    return (
        <>
            <div>{title}</div>
            {
                checkedList.map(((item: SelectProps) => {
                    return (
                        item.isUser?
                        <li key={item.id} className={style.module} style={{maxWidth: '100%', justifyContent: 'space-between'}}>
                            <div className={style.moduleContent}>
                                <div className={style.avatar}>{item.name ? item.name.slice(-1) : (item as SearchUserProps).realName.slice(-1)}</div>
                                <div className={style.userInfo}>
                                    <div className={style.account}>
                                        <span>{ item.name || (item as SearchUserProps).realName }</span>
                                        <span className={style.accountText}>{ `(${item.account})` }</span>
                                    </div>
                                    <div className={style.dep}>
                                        <span> { getUserDept(item) }</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cancel} onClick={() => deleteSelected(item)}>
                                <CloseOutlined style={{color: "#bbbcbf", cursor: 'pointer'}}/>
                            </div>
                        </li>
                        :
                        <li key={item.id} className={style.module} style={{maxWidth: '100%', justifyContent: 'space-between'}}>
                            <div className={style.moduleContent}>
                                <div className={depStyle.departmentIcon}>
                                    <ApartmentOutlined style={{color: 'green'}} />
                                </div>
                                <div className={style.userInfo}>
                                    {item.name}
                                </div>
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