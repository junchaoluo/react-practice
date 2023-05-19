import { forwardRef, memo, FC, useState } from 'react'
import { Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { SelectProps } from 'antd'
import CustomSearchOption from '@/components/customSearchOption'
import { SearchUser } from '@/types/user'

const { Option } = Select

type IProps = {
    placeholder?: string
}

let timeout: ReturnType<typeof setTimeout> | null

const searchStaffInput:FC<IProps> = memo(forwardRef(({placeholder='请输入查询条件',...rest}: IProps, ref: HTMLElement) => {
    console.log(rest, ref, placeholder)
    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState('')
    const onSearch = (value: string) => {
        console.log(value)
    }

    const onChange = (user: SearchUser) => {
        console.log(user)
    }
    return (
        <div ref={ref}>
            <Select showSearch style={{minWidth: '224px'}} showArrow={false} filterOption={false} placeholder={placeholder} value={value}
            onSearch={onSearch}
            onChange={onChange}>
                <div>你可能想找</div>
                {
                    data.forEach((user: SearchUser) => {
                        return (
                            <Option key={user.id} label={user.realName || user.name} value={user}>
                                <CustomSearchOption user={user}/>
                            </Option>
                        )
                    })
                }
            </Select>
        </div>
    )
}))
export default searchStaffInput;