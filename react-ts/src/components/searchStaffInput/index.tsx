import { forwardRef, memo, FC, useState } from 'react'
import { Select } from 'antd'

const { Option } = Select

type IProps = {
    placeholder?: string
}

const searchStaffInput:FC = memo(forwardRef(({placeholder='请输入查询条件',...rest}: IProps, ref: HTMLElement) => {
    console.log(rest, ref)
    const [value, setValue] = useState('')
    const onSearch = (value: string) => {
        console.log(value)
    }
    return (
        <div ref={ref}>
            <Select showSearch style={{minWidth: '224px'}} showArrow={false} placeholder={placeholder} onSearch={onSearch} value={value}>
                <Option value="1">1</Option>
            </Select>
        </div>
    )
}))
export default searchStaffInput;