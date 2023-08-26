import { PropsWithChildren, useEffect, useState } from 'react'
import './index.scss'
import { Tabs, Form, Select, Input, Table, Row, Col } from 'antd'

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

    useEffect(() => {

    }, [])

    return (
        <div className='my-sample-contanier'>
            <div className='my-sample-tab'>
                <div>当前状态：</div>
                <Tabs type='card' activeKey={activeKey} items={tabList} onChange={(activeKey) => setActiveKey(activeKey)}></Tabs>
            </div>
            <div className='my-sample-search'>
                <Form form={form}>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Form.Item name='detectionItems'>
                                <Select options={searchList.detectionItems} placeholder='请选择检测项'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='depts'>
                                <Select options={searchList.depts} placeholder='请选择检测部门'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='analysts'>
                                <Select options={searchList.analysts} placeholder='请选择分析员'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='samplesStatuss'>
                                <Select options={searchList.samplesStatuss} fieldNames={{label: 'name', value: 'value'}} placeholder='请选择检测状态'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='samplesTimeType'>
                                <Select options={searchList.samplesTimeType} placeholder='请选择送检时间'></Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item name='batchNo'>
                                <Input placeholder='请输入样品批号查询'/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className='my-sample-table'></div>
        </div>
    )
}

export default MySample