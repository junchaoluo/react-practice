import { forwardRef, memo, FC, useState, useCallback, useEffect, useContext } from 'react'
import { Select, Input, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { SelectProps } from 'antd'
import CustomSearchOption from '@/components/customSearchOption'
import { debounce } from 'lodash'
import { getUserListByFuzzyKw } from '@/api/project'
import { SelectProps as SelectUserProps, DepartmentProps } from '@/types/chooseUser'
import ChooseUseContext from '@/components/chooseUser/context/chooseUserContext'

const { Option, OptGroup } = Select

type IProps = {
    placeholder?: string,
    SelectUser: (user: SelectUserProps) => void
}

const searchStaffInput:FC<IProps> = memo(forwardRef(({placeholder = '请输入搜索', SelectUser,  ...rest}: IProps, ref: HTMLElement) => {
    const ctx = useContext(ChooseUseContext)
    const { disabledList = [], checkedList = []} = ctx

    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)


    const getData = debounce(useCallback(async (newValue: string, reset = false) => {
        if(!newValue) return
        setLoading(true)
        const { result } = await getUserListByFuzzyKw({
            pageIndex: 1,
            pageSize: 1000,
            departmentId: '',
            keywords: newValue
        })
        const { list } = result
        const newArr = reset ? [...list] : [...data, ...list]
        const tempOptions = newArr.filter(m => !disabledList.includes(m.id))
        tempOptions.forEach(item => {
            item.name = item.realName
            checkedList.forEach((check: SelectUserProps) => {
                if (item.id === check.id) {
                    item.checked = true
                }
            })
        })
        setData(tempOptions)
        setLoading(false)
    }, [checkedList, disabledList, data]), 500)

    const onSearch = (value: string) => {
        getData(value, true)
    }

    const onChange = (id: string) => {
        try {
            data.forEach((item: SelectUserProps) => {
                if(item.id === id) {
                    SelectUser({...item, isUser: true, checked: true})
                    setValue('')
                    setData([])
                    throw Error()
                }
            })
        }catch(e) {
            console.log(e)
        }
    }
    return (
        <>
            <Spin spinning={loading}/>
            <div>
                <Select ref={ref} showSearch style={{minWidth: '300px'}} showArrow={false} filterOption={false} placeholder={placeholder} value={value}
                onSearch={onSearch}
                onChange={onChange}
                onBlur={() => setData([])}>
                    {/* <div>你可能想找</div> */}
                    <OptGroup label='你可能想找' value={'0'}>
                    {
                        data.map((user: SelectUserProps) => {
                            return (
                                <Option key={user.id} label={user.realName || user.name} value={user.id}>
                                    <CustomSearchOption user={user}/>
                                </Option>
                            )
                        })
                    }
                    </OptGroup>
                </Select>
            </div>
        </>
    )
}))
export default searchStaffInput;