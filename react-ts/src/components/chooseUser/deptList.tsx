import { FC, useCallback } from 'react'
import {DepartmentProps, SelectProps} from '@/types/chooseUser'
import { Checkbox } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import style from './index.module.scss'
import { ApartmentOutlined, PartitionOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

type IProps = {
    options: Array<DepartmentProps>,
    onNext: (dep: DepartmentProps) => void,
    isSingle: boolean, // 是否单选
    changeCheckDep: (dep: DepartmentProps, checekd: boolean) => void,
    previousOptions: Array<SelectProps>,
    prevStep: () => void
}

const DeptList: FC<IProps> = (props) => {
    const { options, onNext, changeCheckDep, previousOptions = [], prevStep } = props

    const changeCheck = (item: DepartmentProps, e: CheckboxChangeEvent) => {
        const checked = e.target.checked
        changeCheckDep(item, checked)
    }

    return (
        <div className={style.deptSelect}>
            <ul>
                {
                    previousOptions && previousOptions.length > 0 ?
                    <li className={style.preStep} onClick={() => prevStep()}>
                        <ArrowLeftOutlined />
                        <span className={style.preStepLabel}>返回上一级</span>
                    </li>
                    :
                    ''
                }
                {
                    options.map((item: DepartmentProps) => {
                        return (
                            <li key={item.id} className={style.dept}>
                                <div className={style.deptLeft}>
                                    <Checkbox onChange={(value: CheckboxChangeEvent) => changeCheck(item, value)} label={item.id} checked={item.checked}>{''}</Checkbox>
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