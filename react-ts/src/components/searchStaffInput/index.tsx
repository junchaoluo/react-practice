import { forwardRef, memo, FC, useState } from 'react'
import { Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { SelectProps } from 'antd'

const { Option } = Select

type IProps = {
    placeholder?: string
}

let timeout: ReturnType<typeof setTimeout> | null

const searchStaffInput:FC<{placeholder:string}> = memo(forwardRef(({placeholder='请输入查询条件',...rest}: IProps, ref: HTMLElement) => {
    console.log(rest, ref)
    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState('')
    const onSearch = (value: string) => {
        console.log(value)
    }
    return (
        <div ref={ref}>
            <Select showSearch style={{minWidth: '224px'}} showArrow={false} filterOption={false} placeholder={placeholder} value={value}
            onSearch={onSearch}
            onChange={(value: string) => setValue(value)}>
                <Option value="1">1</Option>
            </Select>
        </div>
    )
}))
export default searchStaffInput;