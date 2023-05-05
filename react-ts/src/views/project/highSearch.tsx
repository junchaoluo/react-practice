import { Drawer, Form, Space, Input, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { memo, useState } from 'react'

type IProps = {
    open: boolean,
    handleSure: (form: {
        code: string, productCode: string
    }) => void,
    closeDrawer: () => void
}

const HighSearch = memo((props: IProps) => {
    const { open, handleSure, closeDrawer } = props
    const [form, setForm] = useState({
        code: '',
        productCode: ''
    })

    return (
        <Drawer title="高级筛选" open={open} footer={
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <Space>
                    <Button onClick={() => closeDrawer()}>取消</Button>
                    <Button type="primary" onClick={() => handleSure(form)}>确定</Button>
                </Space>
            </div>
        } closable={false} extra={
            <CloseOutlined onClick={() => closeDrawer()} />
        }>
            <Form layout="vertical">
                <Space size="small" direction="vertical">
                    <Form.Item label="项目编号" name="code">
                        <Input placeholder="请输入项目编号" onChange={(e) => setForm(Object.assign({}, form, {code: e.target.value}))}/>
                    </Form.Item>
                    <Form.Item label="产品号" name="productCode">
                        <Input placeholder="请输入产品号" onChange={(e) => setForm(Object.assign({}, form, {productCode: e.target.value}))}/>
                    </Form.Item>
                </Space>
            </Form>
        </Drawer>
    )
})

export default HighSearch;