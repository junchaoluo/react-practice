import { FC, useCallback } from 'react'
import {DepartmentProps} from '@/types/chooseUser'
import { Checkbox } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import style from './index.module.scss'
import { ApartmentOutlined, PartitionOutlined } from '@ant-design/icons'

type IProps = {
    options: Array<DepartmentProps>,
    onNext: (dep: DepartmentProps) => void,
    isSingle: boolean // 是否单选
}

const DeptList: FC<IProps> = (props) => {
    const { options, onNext } = props

    const changeCheck = useCallback(() => {

    }, [])

    return (
        <div className={style.deptSelect}>
            <ul>
                {
                    options.map((item: DepartmentProps) => {
                        return (
                            <li key={item.id} className={style.dept}>
                                <div className={style.deptLeft}>
                                    <Checkbox onChange={(value) => changeCheck(item, value)} label={item.id} value={item.id}>{''}</Checkbox>
                                    <div className={style.departmentIcon}>
                                        <ApartmentOutlined style={{color: 'green'}} />
                                    </div>
                                    <div className={style.name}>{item.name}</div>
                                </div>
                                <div className={style.nextDept} onClick={() => onNext(item)}>
                                    <PartitionOutlined />
                                    <div className={style.nextLabel}>下级</div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
export default DeptList;