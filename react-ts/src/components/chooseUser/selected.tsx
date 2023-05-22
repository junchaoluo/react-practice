import { FC } from 'react'
import { SearchUser, Department } from '@/types/user'
import style from '@/components/customSearchOption/index.module.scss'
import { getUserDept } from '@/util/user'
import { CloseOutlined } from '@ant-design/icons'

type SelectProps = SearchUser & Department & {
    isUser?: boolean,
    checked?: boolean
}

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
                        <li key={item.id}>
                            <div className={style.module} style={{maxWidth: '100%', 'justify-content': 'space-between'}}>
                                <div className={style.moduleContent}>
                                    <div className={style.avatar}>{item.name ? item.name.slice(-1) : item.realName.slice(-1)}</div>
                                    <div className={style.userInfo}>
                                        <div className={style.account}>
                                            <span>{ item.name || item.realName }</span>
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
                            </div>
                        </li>
                        :
                        <li key={item.id}>{item.name}</li>
                    )
                }))
            }
        </>
    )
}
export default SelectedList;