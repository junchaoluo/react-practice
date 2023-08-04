import { memo, PropsWithChildren, FC, useState } from 'react';
import style from './index.module.scss'
import { Form, Select, Input, Row, Col, DatePicker } from 'antd'

const dateFormat = 'YYYY/MM/DD'
const { Option } = Select

type Compound = {
    recordId: string,
    name: string
}

const Template: FC<PropsWithChildren> = () => {
    const [lastCompound, setLastCompound] = useState<Array<Compound>>([]) // 上次选择的化合物
    const [compoundList, setCompoundList] = useState<Array<Compound>>([]) // 反应物和产物
    // 清除化合物
    const clearMaterialId = () => {
    }

       return <div className={style.content}>
        <Form name="basic">
            <Row gutter={20}>
                <Col span={20}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item name="batchNo" label="样品批号" rules={[{required: true, message: '请输入样品批号'}]}>
                                <Input placeholder="请输入样品批号"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="样品名称" name="samplesName">
                                <Input placeholder="请输入样品名称"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="送样时间" name="samplesTime" rules={[{required: true, message: '请输入选择送样时间'}]}>
                                <DatePicker format={dateFormat}></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="选择化合物" name="materialId">
                                <Select allowClear defaultValue="" onClear={clearMaterialId} readonly>
                                    {
                                        lastCompound.map((item: Compound) => {
                                            return <Option key={item.recordId} label={item.name} value={item.recordId}>
                                                <span>上次选择</span>
                                                <span>{item.name}</span>
                                            </Option>
                                        })
                                    }
                                    {
                                        compoundList.map((item: Compound) => {
                                            return <Option key={item.recordId} label={item.name} value={item.recordId}>
                                                <span>{item.title}</span>
                                                <span>{item.name}</span>
                                            </Option>
                                        })
                                    }
                                    <Option key="abc" value="">化合物选择</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={4}></Col>
            </Row>
        </Form>
       </div>
}

export default memo(Template)