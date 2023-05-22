import { forwardRef, memo, FC, useState, useCallback } from 'react'
import { Select, Input, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { SelectProps } from 'antd'
import CustomSearchOption from '@/components/customSearchOption'
import { SearchUser } from '@/types/user'
import { debounce } from 'lodash'
import { getUserListByFuzzyKw } from '@/api/project'

const { Option, OptGroup } = Select

type IProps = {
    placeholder?: string,
    SelectUser: (user: SearchUser) => void
}

let timeout: ReturnType<typeof setTimeout> | null

const searchStaffInput:FC<IProps> = memo(forwardRef(({placeholder='请输入查询条件', disabledList = [], checkedList = [], SelectUser,  ...rest}: IProps, ref: HTMLElement) => {
    console.log(rest, ref, placeholder)
    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState('')
    const param = {
        pageIndex: 1,
        pageSize: 10
    }
    const [loading, setLoading] = useState(false)

    const getData = debounce(useCallback(async (newValue: string, reset = false) => {
        if(!newValue) return
        setLoading(true)
        const { result } = await getUserListByFuzzyKw({
            pageIndex: param.pageIndex,
            pageSize: param.pageSize,
            departmentId: '',
            keywords: newValue
        })
        const { list } = result
        const newArr = reset ? [...list] : [...data, ...list]
        const tempOptions = newArr.filter(m => !disabledList.includes(m.id))
        tempOptions.forEach(item => {
            item.name = item.realName
            checkedList.forEach((check: SearchUser) => {
                if (item.id === check.id) {
                item.checked = true
                }
            })
        })
        setData(tempOptions)
        setLoading(false)
    }, []), 500)

    const onSearch = (value: string) => {
        getData(value, true)
    }

    const onChange = (id: string) => {
        try {
            data.forEach((item: SearchUser) => {
                if(item.id === id) {
                    SelectUser(item)
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
                onChange={onChange}>
                    {/* <div>你可能想找</div> */}
                    <OptGroup label='你可能想找' value={'0'}>
                    {
                        data.map((user: SearchUser) => {
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