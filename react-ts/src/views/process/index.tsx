import { memo, PropsWithChildren, FC, useState, useCallback, useEffect } from 'react'
import { Button, Tabs, Input, Table, Pagination, Tag, Popconfirm, message } from 'antd'
import type { TabProps } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import style from './index.module.scss'
import { getProcessList, publishProcess, invalidProcess, recoverProcess, deleteProcess } from '@/api/process'
import { useNavigate } from 'react-router-dom'

const items: TabProps['items'] = [
    {
        key: '0',
        label: `正常`,
    },
    {
        key: '1',
        label: `已作废`,
    },
]

interface DataType {
    id: string,
    [propName: string]: any
}

type PageType = {
    pageNum: number,
    pageSize: number
}

type Params = {
    toVoid: string,
    keyWords: string
}

type OperateType = 0|1|2|3|4

enum OperateEnum {
    '发布',
    '恢复',
    '编辑',
    '作废',
    '删除',
}

// 查询数据
const fetchData = async (pageForm: PageType, params: Params, setDataSource: CallableFunction, setTotal: CallableFunction) => {
    let param = {}
    if(!params.keyWords) {
        param = {
            toVoid: params.toVoid
        }
    }else{
        param = params
    }

    const { result } = await getProcessList(pageForm, param)
    setDataSource(result && result.list || [])
    setTotal(result && +result.total)
}

// 发布/恢复/删除工序
const operateProcess = async (id: string | Array<string> | {
    list: Array<string>
}, type: OperateType, operateFunciton: any) => {
    const {code, description} = await operateFunciton(id)
    if(code === 0) {
        message.success(`${OperateEnum[type]}成功！`)
    }else{
        message.error(description)
    }
}

const Process: FC<PropsWithChildren> = () => {
    const navigate = useNavigate()

    const columns:ColumnsType<DataType> = [
        {
            title: '工序名称',
            dataIndex: 'name',
            width: '150px',
            ellipsis: true,
            render: (text: string, record: DataType, index: number) => {
                return (
                    <Button type="link">{text}</Button>
                )
            }
        },
        {
            title: '参数/操作内容',
            dataIndex: 'params',
            ellipsis: true,
            width: '150px',
            render: (text: string, record: DataType, index: number) => {
                const params = []
                if (record.params && record.dataType === 0) {
                  let paramsObj = JSON.parse(record.params)
                  paramsObj.forEach(p => {
                    p.name && params.push(p.name)
                  })
                }
                return params.length > 0 ? <span>{params.join(',')}</span> : <div dangerouslySetInnerHTML={{__html: record.params}}></div>
            }
        },
        {
            title: '当前版本',
            dataIndex: 'version',
            hidden: true,
            ellipsis: true,
            width: '150px',
            render: (text: string, record: DataType, index: number) => {
                return <span>{`V${text}`}</span>
            }
        },
        {
            title: '当前状态',
            dataIndex: 'status',
            ellipsis: true,
            hidden: true,
            width: '150px',
            render: (text: string, record: DataType, index: number) => {
                {
                    if (record.status === 0) {
                      return (
                        <Tag bordered={false} color="warning">
                            未发布
                        </Tag>
                      )
                    } else {
                      return (
                        <Tag bordered={false} color="success">
                            已发布
                        </Tag>
                      )
                    }
                  }
            }
        },
        {
            title: '发布时间',
            dataIndex: 'updateTime',
            ellipsis: true,
            width: '150px',
            hidden: true
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            ellipsis: true,
            width: '150px',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
            width: '150px',
            hidden: true
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: '300px',
            fixed: 'right',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <>
                        {
                            activeKey === '0' ?
                                record.status === 0?
                                <Popconfirm
                                placement="top"
                                title="是否确认发布该版本？"
                                onConfirm={() => handleOperate(record.id, 0)}
                                okText="发布"
                                cancelText="取消"
                                >
                                    <Button type="link">发布</Button>
                                </Popconfirm>
                                :
                                ''
                            :
                            <Popconfirm
                            placement="top"
                            title="是否确认恢复该版本？"
                            onConfirm={() => handleOperate(record.id, 1)}
                            okText="恢复"
                            cancelText="取消"
                            >
                                <Button type="link">恢复</Button>
                            </Popconfirm>
                        }
                        <Button type="link" onClick={() => handleOperate(record.id, 2, record)}>编辑</Button>
                        {
                            activeKey === '0' ?
                            <Popconfirm
                            placement="top"
                            title="确定要作废吗？"
                            onConfirm={() => handleOperate(record.id, 3)}
                            okText="作废"
                            cancelText="取消"
                            >
                                <Button type="link">作废</Button>
                            </Popconfirm>
                            :
                            ''
                        }
                        <Popconfirm
                            placement="top"
                            icon={<CloseCircleOutlined />}
                            title="工序删除后不可恢复，确定要删除吗？"
                            onConfirm={() => handleOperate(record.id, 4)}
                            okText="删除"
                            cancelText="取消"
                            >
                                <Button type="link">删除</Button>
                            </Popconfirm>
                    </>
                )
            }
        }
    ]
    const [scroll, setScroll] = useState({
        x: 1000,
        y: 'calc(100vh - 350px)'
    })
    const [tableColumns, setTableColumns] = useState(columns)
    const [activeKey, setActiveKey] = useState('0')
    const [keywords, setKeywords] = useState("")
    const [pageForm, setPageForm] = useState({
        pageNum: 1,
        pageSize: 10
    })
    const [dataSource, setDataSource] = useState([])
    const [total, setTotal] = useState(0)

    const getData = useCallback((keywords = '') => {
        fetchData({...pageForm}, {
            toVoid: activeKey,
            keyWords: keywords
        }, setDataSource, setTotal)
    }, [pageForm, activeKey])

    const search = useCallback(async (keywords = '') => {
        setPageForm({...pageForm, pageNum: 1})
        getData(keywords)
    }, [pageForm, getData])

    useEffect(() => {
        if(activeKey === '0') {
            setTableColumns(columns)
        }else{
            setTableColumns(columns.filter((item: ColumnsType) => !item.hidden))
        }
        search()
    }, [activeKey])

    const onChangeTab = useCallback((value: string) => {
        setKeywords('')
        setPageForm({...pageForm, pageNum: 1})
        setActiveKey(value)
    }, [pageForm])

    const onChangePage = useCallback((pageNum: number, pageSize: number) => {
        setPageForm({...pageForm, pageNum, pageSize})
    }, [pageForm])

    /**
     * id: 主键
     * type 0 发布 1 恢复 2 编辑 3 作废 4 删除
     */
    const handleOperate = useCallback((id: string, type: OperateType, record: DataType) => {
        switch(type) {
            case 0:
                operateProcess(id, type, publishProcess)
                break;
            case 1:
                operateProcess({
                    list: [id]
                }, type, recoverProcess)
                break;
            case 2:
                navigate(`edit?id=${id}&&type=1`, {
                    state: {
                        ...record
                    }
                })
                // 编辑跳转页面
                break;
            case 3:
                operateProcess([id], type, invalidProcess)
                break;
            case 4:
                operateProcess(id, type, deleteProcess)
                break;
            default: break;
        }
        search()
    }, [])

    // 新增工序
    const addProcess = useCallback(() => {
        navigate(`edit?type=0`)
    }, [])

    return (
        <div className={style.module}>
            <Tabs activeKey={activeKey} items={items} onChange={onChangeTab} />
            <div className={style.operate}>
                <Button icon={<PlusOutlined />} type="primary" onClick={addProcess}>新增工序</Button>
                <div className={style.search}>
                    <Input value={keywords} onChange={(e: Event) => setKeywords(e.target.value)}/>
                    <Button onClick={() => search(keywords)} type="primary">搜索</Button>
                </div>
            </div>
            <div className={style.content}>
                <div className={style.table}>
                    <Table dataSource={dataSource} pagination={false} scroll={scroll} columns={tableColumns} rowKey={(record) => record.id}/>
                </div>
                <div className={style.page}>
                    <Pagination
                        total={total}
                        showSizeChanger
                        showQuickJumper
                        current={pageForm.pageNum}
                        pageSize={pageForm.pageSize}
                        onChange={onChangePage}
                        showTotal={(total: number) => `总共 ${total} 条`}
                    />
                </div>
            </div>
        </div>
    )
}

export default Process