import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import './index.scss'
import { Tabs, Form, Select, Input, Table, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getMySampleData } from '@/api/sample'

interface DataType {
    index: number,
    name: string
}

interface Page {
    pageNum: number,
    pageSize: number
}

type Params = string | undefined
export interface SearchFormParams {
    detectionItems: Params,
    depts: Params,
    analysts: Params,
    samplesStatuss: Params,
    samplesTimeType: Params,
    batchNo: Params
}

const getData = async (page:Page, data: SearchFormParams) => {
    const { result } = await getMySampleData(page.pageNum, page.pageSize, data)
}

const MySample = (props: PropsWithChildren) => {
    const [tabList, setTabList] = useState([
        {
            label: `全部`,
            key: '1'
        },
        {
            label: '变更待确认',
            key: '2'
        }
    ])
    const [activeKey, setActiveKey] = useState('1')

    const [form] = Form.useForm()
    const [searchList, setSearchList] = useState({
        detectionItems: [], // 检测项
        depts: [], // 检测部门
        analysts: [], // 分析员
        samplesStatuss: [ // 检测状态
          {
            name: '待检测',
            color: '#faad14',
            value: 0
          },
          {
            name: '已撤回',
            color: '#bbbcbf',
            value: 1
          },
          { name: '已拒样', color: '#d90013', value: 2 },
          { name: '已收样', color: '#2f54eb', value: 3 },
          {
            name: '已作废',
            color: '#bbbcbf',
            value: 4
          },

          {
            name: '检测中',
            color: '#2f54eb',
            value: 5
          },
          {
            name: '已完成',
            color: '#30bf78',
            value: 6
          }
        ],
        samplesTimeType: [ // 送检时间
          { label: '本周送检', value: 1 },
          { label: '近2周送检', value: 2 },
          {
            label: '本月送检',
            value: 3
          }
        ]
    })

    const columns: ColumnsType<DataType> = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80,
            render: (text) => <a>{text}</a>
        },
        {
            title: '样品批号',
            dataIndex: 'batchNo',
            key: 'batchNo',
            width: 250,
            render: (text) => <a>{text}</a>
        },
        {
            title: '化合物',
            dataIndex: 'materialName',
            key: 'materialName',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '当前状态',
            dataIndex: 'samplesStatus',
            key: 'samplesStatus',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '编号',
            dataIndex: 'intNo',
            key: 'intNo',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '检测项',
            dataIndex: 'detectionName',
            key: 'detectionName',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '检测部门',
            dataIndex: 'deptName',
            key: 'deptName',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '分析员',
            dataIndex: 'analyzeName',
            key: 'analyzeName',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '实验记录',
            dataIndex: 'testRecord',
            key: 'testRecord',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '分析完成日期',
            dataIndex: 'analysisTime',
            key: 'analysisTime',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '送样日期',
            dataIndex: 'samplesTime',
            key: 'samplesTime',
            width: 150,
            render: (text) => <a>{text}</a>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            fixed:'right',
            width: 250,
            render: (text) => <a>{text}</a>
        },
    ]

    useEffect(() => {
        // 查询下拉框数据
    }, [])

    useEffect(() => {
        // 查询表格数据
    }, [form, activeKey])

    const onValuesChange = useCallback((changeValues, allValues) => {
        console.log(changeValues, allValues)
    }, [form])

    return (
        <div className='my-sample-contanier'>
            <div className='my-sample-tab'>
                <div>当前状态：</div>
                <Tabs type='card' activeKey={activeKey} items={tabList} onChange={(activeKey) => setActiveKey(activeKey)}></Tabs>
            </div>
            <div className='my-sample-search'>
                <Form form={form} onValuesChange={onValuesChange}>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item name='detectionItems'>
                                <Select allowClear={true} options={searchList.detectionItems} placeholder='请选择检测项'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='depts'>
                                <Select allowClear={true} options={searchList.depts} placeholder='请选择检测部门'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='analysts'>
                                <Select allowClear={true} options={searchList.analysts} placeholder='请选择分析员'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='samplesStatuss'>
                                <Select allowClear={true} options={searchList.samplesStatuss} fieldNames={{label: 'name', value: 'value'}} placeholder='请选择检测状态'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='samplesTimeType'>
                                <Select allowClear={true} options={searchList.samplesTimeType} placeholder='请选择送检时间'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='batchNo'>
                                <Input allowClear={true} placeholder='请输入样品批号查询'/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className='my-sample-table'>
                <Table scroll={{
                    y: `calc(100vh - 116px)`
                }} columns={columns} bordered={true} size='small'></Table>
            </div>
        </div>
    )
}

export default MySample