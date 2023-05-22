import { FC } from 'react'
import {Department} from '@/types/user'
import { Checkbox } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import style from './index.module.scss'
import { ApartmentOutlined, PartitionOutlined } from '@ant-design/icons'

type IProps = {
    options: Array<Department>
}

const DeptList: FC<IProps> = (props) => {
    const { options } = props

    return (
        <div className={style.deptSelect}>
            <ul>
                {
                    options.map((item: Department) => {
                        return (
                            <li key={item.id} className={style.dept}>
                                <div className={style.deptLeft}>
                                    <Checkbox label={item.id} value={item.id}>{''}</Checkbox>
                                    <div className={style.departmentIcon}>
                                        <ApartmentOutlined style={{color: 'green'}} />
                                    </div>
                                    <div className={style.name}>{item.name}</div>
                                </div>
                                <div className={style.nextDept}>
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