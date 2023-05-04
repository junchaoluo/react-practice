import { Drawer, Form, Space, Input, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'

type IProps = {
    open: boolean,
    handleSure: any,
    closeDrawer: any
}

const HighSearch = (props: IProps) => {
    const { open, handleSure, closeDrawer } = props
    const [form, setForm] = useState({
        code: '',
        productCode: ''
    })

    return (
        <Drawer title="高级筛选" open={open} footer={
            <Space>
                <Button onClick={() => closeDrawer()}>取消</Button>
                <Button type="primary" onClick={() => handleSure(form)}>确定</Button>
            </Space>
        } closable={false} extra={
            <CloseOutlined onClick={() => closeDrawer()} />
        }>
            <Form layout="vertical">
                <Space size="small" direction="vertical">
                    <Form.Item label="项目编号" name="code">
                        <Input placeholder="请输入项目编号"/>
                    </Form.Item>
                    <Form.Item label="产品号" name="productCode">
                        <Input placeholder="请输入产品号"/>
                    </Form.Item>
                </Space>
            </Form>
        </Drawer>
    )
}

export default HighSearch;