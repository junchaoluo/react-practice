import { memo, PropsWithChildren, FC } from 'react';
import style from './index.module.scss'
import { Form, Select, Input, Row, Col } from 'antd'

const Template: FC<PropsWithChildren> = () => {
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
                            <Form.Item label="送样时间" name="samplesTime" rules={[{required: true, message: '请输入选择送样时间'}]}></Form.Item>
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                </Col>
                <Col span={4}></Col>
            </Row>
        </Form>
       </div>
}

export default memo(Template)