import { useSelector } from 'react-redux'
import user from '../../store/user/index'
import style from './index.module.scss'
import { useCallback, useState, useEffect } from 'react'
import { Divider, Button, Input, Table, Pagination, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined, VideoCameraAddOutlined, SettingOutlined } from '@ant-design/icons'
import { getProjectListByPage, getArchiveProjectListByPage, getProjectByAdvanceCondition, findProjectByAdvanceConditionArchive } from '../../api/project'
import HighSearch from './highSearch'

const Project = () => {
    const statusList = [
        {
            label: '进行中',
            key: 0
        },
        {
            label: '已归档',
            key: 1
        }
    ]

    const [searchValue, setSearchValue] = useState('')
    const [searchForm, setSearchForm] = useState({
        pageIndex: 1,
        pageSize: 20
    })

    
    const [status, setStatus] = useState(0)
    const changeStatus = useCallback((key) => {
        setStatus(key)
        const data = Object.assign({}, searchForm, {
            pageIndex: 1
        })
        setSearchForm(data)
    }, [])

    const [dataSource, setDataSource] = useState([])
    const [total, setTotal] = useState(0)
    const [columns, setColumns] = useState([
        {
            title: '项目编号',
            key: 'code',
            dataIndex: 'code',
            viewAlways: true,
            isVisible: true,
            ellipsis: true,
            width: 170,
            render: (text, record, index:number) => {
                return (
                    <Button type="link">{record.code}</Button>
                )
            }
        },
        {
            title: '起止时间',
            key: 'startTime',
            dataIndex: 'startTime',
            isVisible: true,
            ellipsis: true,
            width: 230,
            render: (text, record, index:number) => {
                return (
                    <>
                        <span>{record.startTime}</span>
                        <span>{record.endTime}</span>
                    </>
                )
            }
        },
        {
            title: '实验记录数',
            key: 'notebookQuantity',
            dataIndex: 'notebookQuantity',
            isVisible: true,
            ellipsis: true,
            width: 150
        },
        {
            title: 'PM',
            key: 'PM',
            dataIndex: 'PM',
            isVisible: true,
            ellipsis: true,
            width: 230,
            render: (text, record, index:number) => {
                const pmArr: Array<string> = []
                record.pmUserProjectInfos.forEach(item => {
                    pmArr.push(item.userName)
                })
                return (
                    <span>{pmArr.length > 0 ? pmArr.join('，') : '-'}</span>
                )
            }
        },
        {
            title: '所属部门',
            key: 'departmentName',
            dataIndex: 'departmentName',
            isVisible: true,
            ellipsis: true,
            width: 150
        },
        {
            title: '项目类型',
            key: 'projectType',
            dataIndex: 'projectType',
            isVisible: true,
            ellipsis: true,
            width: 150
        },
        {
            title: '项目成员数',
            key: 'userQuantity',
            dataIndex: 'userQuantity',
            isVisible: true,
            ellipsis: true,
            width: 150
        },
        {
            title: '创建人',
            key: 'createUser',
            dataIndex: 'createUser',
            isVisible: true,
            ellipsis: true,
            width: 150
        },
        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
            isVisible: true,
            ellipsis: true,
            width: 150
        }
    ])
    const [tableColumns, setTableColumns] = useState([])
    const [scroll, setScroll] = useState({
        x: 1000,
        y: 450
    })

    const handleTableRow = useCallback((record: any, type: number) => {
        console.log(record)
        switch(type) {
            case 0:
                // 查看
                break;
            case 1: 
                // 编辑
                break;
            case 2:
                // 结束
                break;
            case 3:
                // 恢复
                break;
            default: break;
        }
    }, [])

    const operationRender = useCallback((record: any) => {
        return (
            <>
                <Button type="link" onClick={() => handleTableRow(record, 0)}>查看</Button>
                {
                    status === 0 
                    && (record.canArchive?
                        (
                        <>
                            <Button type="link" disabled={!record.canEdit} onClick={() => handleTableRow(record, 1)}>编辑</Button>
                            <Popconfirm title={`请确认是否将项目${record.code}完结`} description="项目完结后请进入「已完成」项目列表中查看" onConfirm={() => handleTableRow(record, 2)}>
                                <Button type="link">结束</Button>
                            </Popconfirm>
                        </>
                        )
                        :
                        <>
                            <Button type="link" disabled={!record.canEdit} onClick={() => handleTableRow(record, 1)}>编辑</Button>
                            <Button type="link" disabled={true}>结束</Button>
                        </>
                        )
                }
                {
                    status === 1 && (record.canRenew?
                        <Popconfirm title={`请确认是否将项目${record.code}恢复`} description="项目恢复后请进入「进行中」项目列表中查看" onConfirm={() => handleTableRow(record, 3)}>
                            <Button type="link">恢复</Button>
                        </Popconfirm>
                        :
                        <Button type="link" disabled={true}>恢复</Button>
                    )
                }
            </>
        )
    }, [status])

    useEffect(() => {
        setTableColumns(
            columns.filter(item => item.isVisible).concat(
                [{
                    title: '操作',
                    key: 'operation',
                    dataIndex: 'operation',
                    fixed: 'right',
                    width: 220,
                    render: (text, record, index:number) => {
                        return operationRender(record)
                    }
                }]
            )
        )
    }, [columns, operationRender])

    const getData = useCallback(() => {
        const searchParams = Object.assign({}, searchForm)
        delete searchParams.time
        if (status === 0) {
            // 进行中
            getProjectListByPage(
            { pageIndex: searchForm.pageIndex, pageSize: searchForm.pageSize },
            {
                keywords: searchValue,
                ...searchParams
            }
            ).then(({ result }) => {
                setDataSource((result && result.list) || [])
                setTotal((result && +result.total) || 0)
            })
        } else {
            // 已完成
            getArchiveProjectListByPage(
            {
                pageIndex: searchForm.pageIndex,
                pageSize: searchForm.pageSize
            },
            {
                keywords: searchValue,
                ...searchParams
            }
            ).then(({ result }) => {
                setDataSource((result && result.list) || [])
                setTotal((result && +result.total) || 0)
            })
        }
    }, [searchForm, searchValue, status])

    const search = useCallback(() => {
        setSearchForm(Object.assign({}, searchForm, {
            pageIndex: 1
        }))
    }, [ searchForm])

    useEffect(() => {
        getData()
    }, [getData])

    const changePage = useCallback((page: number, pageSize: number) => {
        const data = Object.assign({}, searchForm, {
            pageIndex: page,
            pageSize: pageSize
        })
        setSearchForm(data)
    }, [])

    // 高级搜索
    const [open, setOpen] = useState(false)
    const handleSure = (form: {
        code: string,
        productCode: string
    }) => {
        // 高级搜索
        const searchParams = Object.assign({}, searchForm, form, {
            pageIndex: 1
        })
        if (status === 0) {
            // 进行中
            getProjectByAdvanceCondition(searchParams, searchParams).then(({ result }) => {
                setDataSource((result && result.list) || [])
                setTotal((result && +result.total) || 0)
                setOpen(false)
            })
        } else {
            // 已完成
            findProjectByAdvanceConditionArchive(searchParams, searchParams).then(({ result }) => {
                setDataSource((result && result.list) || [])
                setTotal((result && +result.total) || 0)
                setOpen(false)
            })
        }
    }

    return (
        <div className='page-conetnt'>
            <div className={style.header}>
                <span>当前状态：</span>
                <div className={style.status}>
                    {
                        statusList.map(item => {
                            return <div key={item.key} className={item.key === status ? `${style.active} ${style.tabLabel}`:`${style.tabLabel}`} onClick={() => changeStatus(item.key)}>{item.label}</div>
                        })
                    }
                </div>
            </div>
            <Divider dashed={true} style={{borderColor: 'rgba(5, 5, 5, 0.2)',borderWidth: '1.5px 0 0'}}/>
            <div className={style.searchModule}>
                <Button type="primary" icon={<PlusOutlined/>}>新增项目</Button>
                <div className={style.search}>
                    <Input placeholder="请输入项目编号查询" prefix={<SearchOutlined />} value={searchValue} onChange={(event: Event) => setSearchValue(((event.target) as HTMLInputElement).value)} />
                    <Button type="primary" className={style.marginLeft12} onClick={() => search()}>搜索</Button>
                    <div className={`${style.marginLeft12} ${style.searchIcon}`} onClick={() => setOpen(true)}>
                        <VideoCameraAddOutlined/>
                    </div>
                    <div className={`${style.marginLeft12} ${style.searchIcon}`}>
                        <SettingOutlined/>
                    </div>
                </div>
            </div>
            <div className={style.contentModule}>
                <Table dataSource={dataSource} columns={tableColumns}  scroll={scroll} pagination={false}></Table>
                <div className={style.pagination}>
                    <Pagination
                        total={total}
                        showSizeChanger
                        showQuickJumper
                        defaultCurrent={searchForm.pageIndex}
                        defaultPageSize={searchForm.pageSize}
                        pageSize={searchForm.pageSize}
                        current={searchForm.pageIndex}
                        onChange={changePage}
                        showTotal={(total) => `共 ${total} 条`}
                    />
                </div>
            </div>
            <HighSearch open={open} handleSure={handleSure} closeDrawer={() => setOpen(false)}/>
        </div>
    )
}

export default Project;