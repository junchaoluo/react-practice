import { FC, useContext, useEffect } from 'react'
import { SelectProps, DepartmentProps, SearchUserProps } from '@/types/chooseUser'
import ChooseUseContext from '@/components/chooseUser/chooseUserContext'
import style from './index.module.scss'
import { Checkbox } from 'antd'
import { ApartmentOutlined, PartitionOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { getUserDept } from '@/util/user'

type IProps = {
    prevStep: () => void,
    changeCheckItem: (item: SelectProps, checekd: boolean, type: number) => void,
}

const UserList: FC<IProps> = (props) => {
    const ctx = useContext(ChooseUseContext)
    const { userList = [], checkedList = [], isSingle = false, isUserCheck} = ctx
    const { prevStep, changeCheckItem } = props

    const changeCheck = (item: SelectProps, e: CheckboxChangeEvent) => {
        const checked = e.target.checked
        item.isUser = true
        changeCheckItem(item, checked, 1)
    }

    return (
        <div>
            <ul>
                <li className={style.preStep} onClick={() => prevStep()}>
                    <ArrowLeftOutlined />
                    <span className={style.preStepLabel}>返回上一级</span>
                </li>
                {
                    userList.map((item: SelectProps) => {
                        return (
                            <li key={item.id} className={style.module}>
                                <div className={style.moduleContent}>
                                    {
                                        isUserCheck?
                                        <Checkbox onChange={(value: CheckboxChangeEvent) => changeCheck(item, value)} label={item.id} checked={item.checked}>{''}</Checkbox>
                                        :
                                        ''
                                    }
                                    <div className={style.avatar}>{item.name ? item.name.slice(-1) : (item as SearchUserProps).realName.slice(-1)}</div><div className={style.userInfo}>
                                        <div className={style.account}>
                                            <span>{item.name || (item as SearchUserProps).realName}</span>
                                            <span className={style.accountText}>{`(${item.account})`}</span>
                                        </div>
                                        <div className={style.dep}>
                                            <span> {getUserDept(item)}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
export default UserList;