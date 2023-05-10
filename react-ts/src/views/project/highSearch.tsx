import { Drawer, Form, Space, Input, Button, DatePicker } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { memo, useState } from 'react'

const { RangePicker } = DatePicker

type IProps = {
    open: boolean,
    handleSure: (form: {
        code: string, productCode: string, time: string[]
    }) => void,
    closeDrawer: () => void
}

const HighSearch = memo((props: IProps) => {
    const [form] = Form.useForm()

    const { open, handleSure, closeDrawer } = props

    const reset = () => {
        form.resetFields()
        onOk()
    }

    const onOk = () => {
        const param = form.getFieldsValue();
        handleSure(param)
    }

    return (
        <Drawer title="高级筛选" open={open} footer={
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <Space>
                    <Button onClick={() => reset()}>重置</Button>
                    <Button type="primary" onClick={() => onOk()}>确定</Button>
                </Space>
            </div>
        } closable={false} extra={
            <CloseOutlined onClick={() => closeDrawer()} />
        }>
            <Form layout="vertical" form={form}>
                <Space size="small" direction="vertical">
                    <Form.Item label="项目编号" name="code">
                        <Input placeholder="请输入项目编号"/>
                    </Form.Item>
                    <Form.Item label="产品号" name="productCode">
                        <Input placeholder="请输入产品号"/>
                    </Form.Item>
                    <Form.Item label="创建时间" name="time">
                        <RangePicker format="YYYY-MM-DD" placeholder={['开始时间','结束时间']} onChange={(date: 'YYYY-MM-DD', dateString: string[]) => form.setFieldValue('time', dateString)}/>
                    </Form.Item>
                </Space>
            </Form>
        </Drawer>
    )
})

export default HighSearch;