import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import './index.scss'
import { Tabs, Form, Select, Input, Table, Row, Col, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DownOutlined, RightOutlined, PrinterOutlined } from '@ant-design/icons'
import { getMySampleData } from '@/api/sample'

interface DataType {
    id: string,
    index: number,
    name: string,
    parentNode?: number,
    code: string,
    elnSamplesSendList: Array<DataType>
}

interface Page {
    pageNum: number,
    pageSize: number
}

interface TabsProps {
    label: string,
    name: string,
    key: string,
    count: number
}

type Params = string | undefined
export interface SearchFormParams {
    detectionItems: Array<string>,
    depts: Array<string>,
    analysts: Array<string>,
    samplesStatuss: Array<string>,
    samplesTimeType: Params,
    batchNo: Params
}

const printRowData = (row: DataType) => {
    console.log(row)
}

const samplesStatuss = [ // 检测状态
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
        ]

const columns: ColumnsType<DataType> = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        className: 'col-span-expand',
        render: (text, record, index) => {
            if(record.parentNode === 1) {
                return (
                    <div style={{display: 'flex'}}>
                        <div style={{marginRight: '24px'}}>送样单：{record.code}</div>
                        <div onClick={() => printRowData(record)}>
                            <PrinterOutlined style={{color: 'rgb(220, 222, 224)', fontSize: '16px'}}/>
                            <Button type='link'>打印</Button>
                        </div>
                    </div>
                )
            }else{
                return <span>{text}</span>
            }
        },
        onCell: (record, index) => {
            if(record.parentNode === 1) {
                return {
                    colSpan: 12
                }
            }
            return {};
        },
    },
    {
        title: '样品批号',
        dataIndex: 'batchNo',
        key: 'batchNo',
        width: 250,
ellipsis: true,
    },
    {
        title: '化合物',
        dataIndex: 'materialName',
        key: 'materialName',
        width: 150,
ellipsis: true
    },
    {
        title: '当前状态',
        dataIndex: 'samplesStatus',
        key: 'samplesStatus',
        width: 150,
        ellipsis: true,
        render: (text) => {
            let status = samplesStatuss.find(item => text === item.value)
            return <span style={{color: status?.color}}>{status?.name}</span>
        }
    },
    {
        title: '编号',
        dataIndex: 'intNo',
        key: 'intNo',
        width: 150,
ellipsis: true
    },
    {
        title: '检测项',
        dataIndex: 'detectionName',
        key: 'detectionName',
        width: 150,
ellipsis: true
    },
    {
        title: '检测部门',
        dataIndex: 'deptName',
        key: 'deptName',
        width: 150,
ellipsis: true
    },
    {
        title: '分析员',
        dataIndex: 'analyzeName',
        key: 'analyzeName',
        width: 150,
ellipsis: true
    },
    {
        title: '实验记录',
        dataIndex: 'testRecord',
        key: 'testRecord',
        width: 150,
ellipsis: true
    },
    {
        title: '分析完成日期',
        dataIndex: 'analysisTime',
        key: 'analysisTime',
        width: 150,
ellipsis: true
    },
    {
        title: '送样日期',
        dataIndex: 'samplesTime',
        key: 'samplesTime',
        width: 150,
ellipsis: true
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed:'right',
        width: 250,
ellipsis: true
    },
]

// 展开行的图标
const ExpandIcon = (props: {
    expanded: boolean,
    record: any,
    parentNode?: number,
    onExpand: Function
}) => {
    if(props.record.parentNode === 1) {
        return props.expanded?<DownOutlined onClick={(e) => props.onExpand(props.record, e)}/>:<RightOutlined onClick={(e) => props.onExpand(props.record, e)}/>
    }
    return <span></span>
}

const getData = async (page:Page, data: SearchFormParams, setTableData: CallableFunction, setTotal: CallableFunction, activeKey:string, tabList: Array<TabsProps>, setTabList: CallableFunction) => {
    const { result } = await getMySampleData(page.pageNum, page.pageSize, data)
    setTotal(Number(result.total))
    let index = 1
    let i = 1
    let arr = result.list?.map(item => {
        item.parentNode = 1
          item.onlyCode = i
          ++i
          item.elnSamplesSendList &&
            item.elnSamplesSendList.forEach(aItem => {
                aItem.onlyCode = i
              ++i
              aItem.index = index++
            })
            return item
    })
    setTableData(arr || [])
    let tabs = tabList.map(tab => {
        if(tab.key === activeKey) {
            tab.count = Number(result.total)
            tab.label = `${tab.name}(${Number(result.total)})`
        }
        return tab
    })
    setTabList(tabs)
}

const MySample = (props: PropsWithChildren) => {
    const [tabList, setTabList] = useState<Array<TabsProps>>([
        {
            label: `全部`,
            name: `全部`,
            key: '1',
            count: 0
        },
        {
            label: '变更待确认',
            name: `全部`,
            key: '2',
            count: 0
        }
    ])
    const [activeKey, setActiveKey] = useState('1')

    const [form] = Form.useForm()
    const [searchList, setSearchList] = useState({
        detectionItems: [], // 检测项
        depts: [], // 检测部门
        analysts: [], // 分析员
        samplesStatuss: samplesStatuss,
        samplesTimeType: [ // 送检时间
          { label: '本周送检', value: 1 },
          { label: '近2周送检', value: 2 },
          {
            label: '本月送检',
            value: 3
          }
        ]
    })

    const [searchParam, setSearchParam] = useState<SearchFormParams>({
        detectionItems: [],
        depts: [],
        analysts: [],
        samplesStatuss: [],
        samplesTimeType: '',
        batchNo: ''
    })
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<Page>({
        pageNum: 1,
        pageSize: 20
    })

    useEffect(() => {
        // 查询下拉框数据

    }, [])

    useEffect(() => {
        // 查询表格数据
        getData(page, searchParam, setTableData, setTotal, activeKey, tabList, setTabList)
    }, [form, activeKey, page, searchParam])

    const onValuesChange = useCallback((changeValues, allValues) => {
        setSearchParam({
            ...searchParam,
            ...changeValues
        })
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
                        <Col span={8}>
                            <Form.Item name='detectionItems'>
                                <Select allowClear={true} options={searchList.detectionItems} placeholder='请选择检测项' mode='multiple'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='depts'>
                                <Select allowClear={true} options={searchList.depts} placeholder='请选择检测部门' mode='multiple'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='analysts'>
                                <Select allowClear={true} options={searchList.analysts} placeholder='请选择分析员' mode='multiple'></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item name='samplesStatuss'>
                                <Select allowClear={true} options={searchList.samplesStatuss} fieldNames={{label: 'name', value: 'value'}} placeholder='请选择检测状态' mode='multiple'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='samplesTimeType'>
                                <Select allowClear={true} options={searchList.samplesTimeType} placeholder='请选择送检时间'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name='batchNo'>
                                <Input allowClear={true} placeholder='请输入样品批号查询'/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className='my-sample-table'>
                <Table
                scroll={{
                    y: `calc(100vh - 384px)`
                }}
                columns={columns}
                bordered={true}
                size='small'
                dataSource={tableData}
                rowKey={function(record: DataType) {
                    return record.id
                }}
                expandable={{
                    childrenColumnName: 'elnSamplesSendList',
                    defaultExpandAllRows: true,
                    expandIcon: ExpandIcon
                }}
                pagination={{
                    current: page.pageNum,
                    pageSize: page.pageSize,
                    total: total,
                    showTitle: true,
                    onChange(pageNum, pageSize) {
                        setPage({
                            ...page,
                            pageNum,
                            pageSize
                        })
                    },
                }}></Table>
            </div>
        </div>
    )
}

export default MySample