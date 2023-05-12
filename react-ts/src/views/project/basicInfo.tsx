import style from './index.module.scss'
import { Card, Form, Row, Col,  Select, Input, AutoComplete, DatePicker } from 'antd'
import { useState } from 'react'

const { RangePicker } = DatePicker;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

type IProps = {
    type: 0 | 1 | 2 // 新增、编辑、详情
}

const BasicInfo = (props: IProps) => {
    // 项目类型
    const projectTypeList: Array<{
        value: string
    }> = [
        { value: 'B类' },
        { value: 'A类' },
        { value: '自主立项' },
        { value: 'FTE类' },
        { value: 'C类' }
    ]
    const[form] = Form.useForm()
    const [initialValues, setInitialValues] = useState({
        departmentIds: ''
    })
    // 产品数据
    const [productOptions, setProductOptions] = useState([])

    // 产品号搜索
    const searchProduct = (value: string) => {
        console.log(value)
    }

    return (
        <>
            <Card title="基础信息" size="small">
                <Form from={form} initialValues={initialValues} {...layout}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item label="产品号" name="productId">
                                <Select showSearch placeholder="请选择产品号" allowClear showArrow={false} onSearch={searchProduct} options={productOptions}></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="项目编号" name="code">
                                <Input placeholder="请输入项目编号"/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                             <Form.Item label="项目类型" name="projectType">
                                <AutoComplete
                                    popupClassName="请输入内容"
                                    options={projectTypeList}
                                >
                                </AutoComplete>
                             </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item label="项目周期" name="cycle">
                                <RangePicker format="YYYY/MM/DD" placeholder={['开始日期', '结束日期']} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="所属部门" name="departmentIds"></Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Item label="项目描述" name="description"></Form.Item>
                    </Row>
                </Form>
            </Card>
        </>
    )
}

export default BasicInfo