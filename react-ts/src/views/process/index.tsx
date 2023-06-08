import { memo, PropsWithChildren, FC, useState, useCallback, useEffect } from 'react'
import { Button, Tabs, Input, Table, Pagination, Tag } from 'antd'
import type { TabProps } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import style from './index.module.scss'
import { getProcessList } from '@/api/process'

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

const Process: FC<PropsWithChildren> = () => {
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
                return params.length > 0 ? <span>{params.join(',')}</span> : <div domPropsInnerHTML={record.params}></div>
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
                            <Button type="link">发布</Button>
                            :
                            <Button type="link">恢复</Button>
                        }
                        <Button type="link">编辑</Button>
                        {
                            activeKey === '0' ?
                            <Button type="link">作废</Button>
                            :
                            ''
                        }
                        <Button type="link">删除</Button>
                    </>
                )
            }
        }
    ]
    const [scroll, setScroll] = useState({
        x: 1000,
        y: 480
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

    const search = useCallback(async (keywords: string) => {
        setPageForm({...pageForm, pageNum: 1})
        getData(keywords)
    }, [pageForm, getData])

    useEffect(() => {
        if(activeKey === '0') {
            setTableColumns(columns)
        }else{
            setTableColumns(columns.filter((item: ColumnsType) => !item.hidden))
        }
    }, [activeKey])

    const onChangeTab = useCallback((value: string) => {
        setKeywords('')
        setPageForm({...pageForm, pageNum: 1})
        setActiveKey(value)
        search()
    }, [pageForm])

    const onChangePage = useCallback((pageNum: number, pageSize: number) => {
        setPageForm({...pageForm, pageNum, pageSize})
    }, [pageForm, getData])

    return (
        <div className={style.module}>
            <Tabs activeKey={activeKey} items={items} onChange={onChangeTab} />
            <div className={style.operate}>
                <Button icon={<PlusOutlined />} type="primary">新增工序</Button>
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