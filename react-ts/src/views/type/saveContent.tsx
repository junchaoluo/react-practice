import { ForwardedRef, forwardRef, ForwardRefRenderFunction, memo, useCallback, useEffect, useImperativeHandle, useState, PropsWithChildren } from 'react';
import { Modal, Form, Input, Radio, Space, message } from 'antd'
import { addExperimentClassification, reviseExperimentClassification } from '@/api/type'

type IProps = {
    title?: string,
    visible: boolean,
    type: number, // 0 新增 1 编辑
    record: any,
    closeModal: () => void
} & PropsWithChildren

enum RecordDimensionEnum {
    project = "项目",
    product = "产品",
    taskNo = "任务",
    productAndProject = "产品+项目",
    productAndProjectAndTaskNo = "产品+项目",
}

const SaveContent: ForwardRefRenderFunction<ForwardedRef, IProps>= forwardRef((props, ref) => {
    const {title = '新增实验类型', visible = false, record = {}, type = 0, closeModal} = props
    const [form] = Form.useForm()
    const [submitDisable, setSubmitDisable] = useState(false)
    const values = Form.useWatch([], form)


    useEffect(() => {
        if(type === 1) {
            form.setFieldsValue({...record, recordDimensionform:record.recordDimension})
        }
    }, [type, record,])

    useEffect(() => {
        form.validateFields({validateOnly: true}).then(
            () => {
                setSubmitDisable(false)
            },
            () => {
                setSubmitDisable(true)
            }
        )
    }, [values])

    const handleOk = useCallback(async () => {
        // 点击确定按钮
        const values = form.getFieldsValue()
        const fun = type === 0 ? addExperimentClassification:reviseExperimentClassification
        let param = {
            ...values,
            openFormula: 0,
            openTable: 0
        }
        if(type === 1) {
            param = {
                ...record,
                ...param, 
                recordDimension: param.recordDimensionform, 
                recordDimensionName: RecordDimensionEnum[`${param.recordDimensionform}` as keyof typeof RecordDimensionEnum]
            }
        }
        const { code, description } = await fun(param)
        if(code === 0){
            message.success(`${type === 0 ? '新增':'编辑'}成功！`)
            form.resetFields()
            closeModal()
        }else{
            message.error(description)
        }
    }, [form, type, closeModal])

    return (
        <Modal
            title={title}
            open={visible}
            onOk={handleOk}
            okButtonProps={{disabled: submitDisable}}
            cancelText="取消"
            okText="确定"
            forceRender={true}
            onCancel={() => closeModal()}
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{recordDimensionform:'project'}}
                    >
                        <Form.Item
                            name="name"
                            label="类型名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入类型名称',
                                },
                            ]}
                        >
                            <Input maxLength={10}/>
                        </Form.Item>
                        <Form.Item
                            name="code"
                            label="编号"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入类型编号',
                                },
                            ]}
                        >
                            <Input maxLength={10}/>
                        </Form.Item>
                        <Form.Item label="记录维度">
                            <Space direction="vertical" size={0}>
                                <Form.Item
                                    name="recordDimensionform"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择记录维度',
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value="project">项目</Radio>
                                        <Radio value="product">产品</Radio>
                                        <Radio value="taskNo">任务</Radio>
                                        <Radio value="productAndProject">产品+项目</Radio>
                                        <Radio value="productAndProjectAndTaskNo">产品+项目+任务</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <div style={{color: '#999BA3', fontSize: '12px', lineHeight: '20px'}}>记录维度表示在做该类型实验的时候，实验记录与哪个维度关联</div>
                            </Space>
                        </Form.Item>
                </Form>
        </Modal>
    )
})

export default memo(SaveContent)