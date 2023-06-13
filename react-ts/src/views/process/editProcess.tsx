/**
* @file  editProcess
* @date 2023-06-10
*/


import {memo, PropsWithChildren, useCallback, useEffect, useState} from 'react';
import type { FC } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Radio, Table, Button, Select } from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import style from './index.module.scss'

interface DataType {
    id?: string,
    dataType?: number,
    params?: string,
    name?: string,
    type?: number,
    unit?: string
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

const options = [
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
                    <Form.Item name="name" rules={[{required: true, message: '请输入参数名'}]}>
                        <Input value={record.name} placeholder="请输入参数名称"/>
                    </Form.Item>
                )
            }
        },
        {
            title: '参数类型',
            dataIndex: 'type',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Select value={record.type} options={options}></Select>
                )
            }
        },
        {
            title: '单位',
            dataIndex: 'unit',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Input value={record.unit} placeholder="请输入单位名称,使用英文逗号进行分割"/>
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
            setTableData(JSON.parse(location.state.params))
        }
    }, [searchParams, location.state])

    const onValuesChange = (changedValues:any, allValues:any) => {
        setDataType(allValues.dataType)
    }

    // 删除
    const deleteData = useCallback((record:DataType) => {
        console.log(tableData)
        const tempData = tableData.filter((item: DataType) => item.id !== record.id)
        console.log(tempData)
        setTableData(tempData)
    }, [tableData])

    // 新增
    const addRow = useCallback(() => {
        setTableData([...tableData, {
            type: 0,
            id: getUuid()
        }])
    }, [tableData])

    // 保存
    const save = () => {
        // 校验必填
        form.validateFields().then(values => {
            console.log(values)
        }).catch((errorInfo) => {
            console.log(errorInfo)
        })
        // handleCancel()
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
