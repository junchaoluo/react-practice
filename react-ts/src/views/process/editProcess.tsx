/**
* @file  editProcess
* @date 2023-06-10
*/


import {memo, PropsWithChildren, useCallback, useEffect, useState} from 'react';
import type { FC } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Radio, Table, Button, Select, message } from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import style from './index.module.scss'
import { addProcess, editProcess } from '@/api/process'

interface DataType {
    id?: string,
    dataType?: number,
    params?: string,
    name?: string,
    type?: number,
    unit?: string,
    selectOption?: selectOption,
}

const dataTypeList = [
    {
        label: '参数',
        value: 0
    },
    {
        label: '文本',
        value: 1
    }
]

type selectOption = {
    label: string,
    value: number,
    type: string
}

const options: Array<selectOption> = [
    {
      label: '文本',
      value: 0,
      type: 'string'
    },
    {
      label: '数字-整数',
      value: 1,
      type: 'noneDecimal'
    },
    {
      label: '数字-1位小数',
      value: 2,
      type: 'oneDecimal'
    },
    {
      label: '数字-2位小数',
      value: 3,
      type: 'twoDecimal'
    },
    {
      label: '数字-4位小数',
      value: 4,
      type: 'fourDecimal'
    },
    {
      label: '布尔',
      value: 5,
      type: 'boolean'
    }
]

function getUuid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

const EditProcess: FC<PropsWithChildren> = (props) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const [form] = Form.useForm()
    const columns: ColumnsType<DataType> = [
        {
            title: '参数名*',
            dataIndex: 'name',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Form.Item key={record.id+'name'} name={`params.${record.id}.name`} rules={[{required: true, message: '请输入参数名'}]}>
                        <Input value={record.name} placeholder="请输入参数名称" onChange={(e) => changeTableData('name', e.target.value, index)}/>
                    </Form.Item>
                )
            }
        },
        {
            title: '参数类型',
            dataIndex: 'type',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Form.Item key={record.id+'type'} name={`params.${record.id}.type`}>
                        <Select value={record.type} options={options} onChange={(e) => changeTableData('type', e, index)}></Select>
                    </Form.Item>
                )
            }
        },
        {
            title: '单位',
            dataIndex: 'unit',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Form.Item key={record.id+'unit'} name={`params.${record.id}.unit`}>
                        <Input value={record.unit} onChange={(e) => changeTableData('unit', e.target.value, index)} placeholder="请输入单位名称,使用英文逗号进行分割"/>
                    </Form.Item>
                )
            }
        },
        {
            title: '删除',
            dataIndex: 'action',
            width: 100,
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Button type="link" onClick={() => deleteData(record)}>删除</Button>
                )
            }
        },
    ]
    
    const [data, setData] = useState({})
    const [tableData, setTableData] = useState<Array<DataType>>([])
    const [dataType, setDataType] = useState(0)

    useEffect(() => {
        if(searchParams.get('type') == 1) {
            //编辑 查看详情
            setData(location.state)
            form.setFieldsValue(location.state)
            setTableData(JSON.parse(location.state.params))
        }
    }, [searchParams, location.state])

    const onValuesChange = (changedValues:any, allValues:any) => {
        setDataType(allValues.dataType)
    }

    // 删除
    const deleteData = useCallback((record:DataType) => {
        const tempData = tableData.filter((item: DataType) => item.id !== record.id)
        setTableData(tempData)
    }, [tableData])

    // 新增
    const addRow = useCallback(() => {
        setTableData([...tableData, {
            type: 0,
            id: getUuid()
        }])
    }, [tableData])

    // 改变
    const changeTableData = (field:string, value: string | number, index:number) => {
        tableData[index][field] = value
        setTableData(tableData)
    }

    // 保存
    const save = () => {
        // 校验必填
        form.validateFields().then(async values => {
            if(form.getFieldValue('dataType') == 0) {
                // 如果是参数
                const paramArr = tableData.map((item: DataType) => {
                    delete item.id
                    item.selectOption = options[Number(item.type)]
                    return item
                })
                form.setFieldValue('params', JSON.stringify(paramArr))
            }
            const param = {
                dataType: form.getFieldValue('dataType'),
                name: form.getFieldValue('name'),
                params: form.getFieldValue('params'),
                version: searchParams.get('type') == 0?1:data.version,
            }
            const func = searchParams.get('type') == 0 ? addProcess:editProcess
            const { code, description } = await func(param)
            if(code === 0) {
                message.success('操作成功！')
                handleCancel()
            }else{
                message.error(description)
            }
        }).catch((errorInfo) => {
        })
    }

    // 取消
    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <div className={style.module}>
            <div className={style.editProcess}>
                <Form form={form} layout="vertical" initialValues={{dataType: 0}} onValuesChange={onValuesChange}>
                    <Form.Item label="工序名称" name="name" rules={[{required: true, message: '请输入工序名称'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="dataType" label="数据类型：">
                        <Radio.Group disabled={searchParams.get('type') == 1} onChange={(e: RadioChangeEvent) => form.setFieldValue('dataType', e.target.value)}>
                            {
                                dataTypeList.map(item => {
                                    return <Radio value={item.value} key={item.value}>{item.label} </Radio>
                                })
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="params">
                        {
                            dataType == 0?
                            <>
                                <Table size="small" pagination={false} scroll={{y: `calc(100vh - 450px)`}} bordered dataSource={tableData} rowKey={(record: DataType) => record.id} columns={columns}/>
                                <div className={style.tableAddRow} onClick={addRow}>
                                    <PlusOutlined />
                                    新增参数
                                </div>
                            </>
                            :
                            <Input/>
                        }
                    </Form.Item>
                </Form>
            </div>
            <div className={style.footer}>
                <Button onClick={handleCancel}>取消</Button>
                <Button style={{marginLeft: '16px'}} type="primary" onClick={save}>确定</Button>
            </div>
        </div>
    )
};

export default memo(EditProcess);
