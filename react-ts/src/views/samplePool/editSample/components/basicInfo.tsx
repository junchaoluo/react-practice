import { memo, PropsWithChildren, FC, useState, Fragment } from 'react';
import style from '../index.module.scss'
import { Form, Select, Input, Row, Col, DatePicker, InputNumber, Popover } from 'antd'

const dateFormat = 'YYYY/MM/DD'
const { Option } = Select

// 化合物
type Compound = {
    recordId: string,
    name: string
}

// 字典
type Dictionaries = {
    label: string,
    value: string
}

// 浓度单位
const concentrationUnitList = ['%', 'g/mL', 'mol/L']
const formItemLayout = { labelCol: { span: 22 }, wrapperCol: { span: 22 } };

const DetectionInfo: FC<PropsWithChildren> = () => {
    const [form] = Form.useForm()

    const [lastCompound, setLastCompound] = useState<Array<Compound>>([]) // 上次选择的化合物
    const [compoundList, setCompoundList] = useState<Array<Compound>>([]) // 反应物和产物
    // 清除化合物
    const clearMaterialId = () => {
    }

    // 样品类型
    const [samplesTypeList, setSamplesTypeList] = useState<Array<Dictionaries>>([])
    // 外观形态
    const [exteriorList, setExteriorList] = useState<Array<Dictionaries>>([])
    // 样品状态
    const [samplePhysicalStatusList, setSamplePhysicalStatusList] = useState<Array<Dictionaries>>([])


       return (
        <>
            <Form name="basic" {...formItemLayout} layout="vertical">
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
                                    <DatePicker format={dateFormat} placeholder="选择送样时间"></DatePicker>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="选择化合物" name="materialId">
                                    <Select placeholder="请选择化合物" allowClear onClear={clearMaterialId} readOnly>
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
                                        <Option key="abc" value="abc">化合物选择</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                <Form.Item label="样品类型" name="samplesType" rules={[{required: true, message: '请选择样品类型'}]}>
                                    <Select placeholder="请选择样品类型" allowClear>
                                        {
                                            samplesTypeList.map((item: Dictionaries) => {
                                                return <Option key={item.value} label={item.label} value={item.value}></Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="外观形态" name="exterior">
                                    <Select placeholder="请选择外观形态" allowClear>
                                        {
                                            exteriorList.map((item: Dictionaries) => {
                                                return <Option key={item.value} label={item.label} value={item.value}></Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="浓度" name="concentration" rules={[{required: true, message: '请输入浓度'}]}>
                                    <Row>
                                        <Col span={16}>
                                            <InputNumber placeholder="请输入浓度" defaultValue={100.00} precision={2} min={0} max={100}/>
                                        </Col>
                                        <Col span={8}>
                                            <Select placeholder="请选择浓度单位" allowClear defaultValue="%">
                                                {
                                                    concentrationUnitList.map((item: string) => {
                                                        return <Option key={item} label={item} value={item}></Option>
                                                    })
                                                }
                                            </Select>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                            <Form.Item label="样品状态" name="samplePhysicalStatus">
                                    <Select placeholder="请选择样品状态" allowClear>
                                        {
                                            samplePhysicalStatusList.map((item: Dictionaries) => {
                                                return <Option key={item.value} label={item.label} value={item.value}></Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={4}>
                        <div className={style.compoundImg}>
                            {
                                form.getFieldValue('materialId')?
                                ''
                                :
                                ''
                            }
                        <Popover placement="leftTop" title="" content="" trigger="click">
                        </Popover>
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
       )
}

export default memo(DetectionInfo)