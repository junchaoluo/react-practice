import { memo, PropsWithChildren, FC, useState, forwardRef, ForwardedRef } from 'react';
import style from '../index.module.scss'
import { Form, Select, Input, Row, Col, DatePicker, InputNumber, Popover, Image } from 'antd'
import CompoundImg from './compoundImg';
import { baseURL } from '@/request'
import { FILE_PREFIX } from '@/api/constant'
// 失败图片地址
import fallbackSrc from '@/assets/images/login-left.png';

const fileSource = `${baseURL}/${FILE_PREFIX}`
const dateFormat = 'YYYY/MM/DD'
const { Option } = Select

export const setImg = (filePath?:string) => {
    return `${fileSource}/file/unencryptedImage?fileName=${filePath}&filePath=${filePath}`
}

// 化合物
export type Compound = {
    recordId?: string,
    structureImgPath?: string,
    name?: string,
    itemNameCn?: string,
    itemNameEn?: string,
    mf?: string,
    mw?: string
}

// 字典
type Dictionaries = {
    label: string,
    value: string
}

// 浓度单位
const concentrationUnitList = ['%', 'g/mL', 'mol/L']
const formItemLayout = { labelCol: { span: 22 }, wrapperCol: { span: 22 } };

const DetectionInfo = forwardRef<ForwardedRef<unknown>, PropsWithChildren>((props, ref) => {
    const [form] = Form.useForm()

    const [lastCompound, setLastCompound] = useState<Array<Compound>>([]) // 上次选择的化合物
    const [compoundList, setCompoundList] = useState<Array<Compound>>([]) // 反应物和产物
    const [compoundItem, setCompoundItem] = useState<Compound>({}) // 化合物
    // 清除化合物
    const clearMaterialId = () => {
        console.log(props, ref)
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
                                true?
                                <Popover placement="leftTop" title="" content={
                                    <div className={style.pop}>
                                        <div className={style.title}>化合物预览</div>
                                        <div className={style.content}>
                                            <div className={style.contentImg}>
                                                <Image height={114} src={setImg(compoundItem.structureImgPath)} fallback={fallbackSrc} />
                                            </div>
                                            <ul className={style.contentInfo}>
                                                <li>名称(英文):{compoundItem.name || compoundItem.itemNameCn || compoundItem.itemNameEn}</li>
                                                <li>MF(分子式):{compoundItem.mf}</li>
                                                <li>MW(分子量):{compoundItem.mw}</li>
                                            </ul>
                                        </div>
                                    </div>
                                } trigger="click">
                                    <>
                                        <CompoundImg/>
                                    </>
                                </Popover>
                                :
                                <>
                                    <CompoundImg/>
                                </>
                            }
                        </div>
                    </Col>
                </Row>
            </Form>
        </>
       )
})

export default memo(DetectionInfo)