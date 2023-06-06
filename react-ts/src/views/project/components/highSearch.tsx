import { Drawer, Form, Space, Input, Button, DatePicker, Tag } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import style from '../index.module.scss'

const { RangePicker } = DatePicker

type IProps = {
    open: boolean,
    handleSure: (form: {
        code: string, productCode: string, time: string[]
    }) => void,
    closeDrawer: () => void
}

type TimeTag = {
    label: string,
    value: number
}

const HighSearch = memo((props: IProps) => {
    const { open, handleSure, closeDrawer } = props

    const [form] = Form.useForm()
    const [time, setTime] = useState<dayjs[]>([])
    const timeTagList: TimeTag[] = [
        {
            label: '一周',
            value: 0
        },
        {
            label: '一个月',
            value: 1
        },
        {
            label: '三个月',
            value: 2
        },
        {
            label: '半年',
            value: 3
        },
    ]

    const setTimeValue = (date: dayjs[], dateString: string[]) => {
        setTime(date)
        form.setFieldValue('time', date)
    }

    const timeQuickChange = (item: TimeTag) => {
        switch(item.value) {
            case 0:
                setTime([dayjs().add(-7, 'd'), dayjs()])
                form.setFieldValue('time', [dayjs().add(-7, 'd'), dayjs()])
                break;
            case 1:
                setTime([dayjs().add(-1, 'month'), dayjs()])
                form.setFieldValue('time', [dayjs().add(-1, 'month'), dayjs()])
                break;
            case 2:
                setTime([dayjs().add(-3, 'month'), dayjs()])
                form.setFieldValue('time', [dayjs().add(-3, 'month'), dayjs()])
                break;
            case 3:
                setTime([dayjs().add(-6, 'month'), dayjs()])
                form.setFieldValue('time', [dayjs().add(-6, 'month'), dayjs()])
                break;
        }
    }

    const reset = () => {
        form.resetFields()
        setTime([])
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
                        <RangePicker format="YYYY-MM-DD" value={time} placeholder={['开始时间','结束时间']} onChange={(date: dayjs[], dateString: string[]) => setTimeValue(date, dateString)}/>
                        <div className={style.timetagList}>
                            {
                                timeTagList.map((item: TimeTag) => {
                                    return <Tag key={item.label} color="blue" bordered={false} onClick={() => timeQuickChange(item)}>{item.label}</Tag>
                                })
                            }
                        </div>
                    </Form.Item>
                </Space>
            </Form>
        </Drawer>
    )
})

export default HighSearch;