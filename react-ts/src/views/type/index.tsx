import { FC, ForwardedRef, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import style from './index.module.scss'
import { Button, Table, Pagination, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined } from '@ant-design/icons'
import { getExperimentClassification, deleteExperimentClassification, addExperimentClassification, reviseExperimentClassification } from '@/api/type'
import SaveContent from './saveContent'

type Page = {
    pageNum: number,
    pageSize: number
}

interface DataType {
    id: string,
    [propName: string]: unknown
}

const fetchData = async (page: Page, setTableData: CallableFunction, setTotal: CallableFunction) => {
    const { result } = await getExperimentClassification(page, {keywords: ''})
    setTableData(result && result.list || [])
    setTotal(result && result.total || 0)
}

const Type: FC<PropsWithChildren> = () => {
    const [tableData, setTableData] = useState<DataType[]>([])
    const [total, setTotal] = useState<number>(0)
    const [pageForm, setPageForm] = useState<Page>({
        pageNum: 1,
        pageSize: 10
    })
    const columns: ColumnsType<DataType> = [
        {
            title: '类型名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '记录维度',
            dataIndex: 'recordDimensionName',
            key: 'recordDimensionName'
        },
        {
            title: '更新人',
            dataIndex: 'updateUser',
            key: 'updateUser'
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <>
                        <Button type="link" onClick={() => handleDelete(record)}>删除</Button>
                        <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    </>
                )
            }
        },
    ]
    const [visible, setVisible] = useState(false)
    const [type, setType] = useState(0) // 0新增 1编辑

    const getData = useCallback(() => {
        fetchData(pageForm, setTableData, setTotal)
    }, [pageForm])

    useEffect(() => {
        getData()
    }, [getData])

    // 页码改变
    const changePage = useCallback((pageNum: number, pageSize: number) => {
        setPageForm({...pageForm, pageNum, pageSize})
    }, [pageForm])

    // 删除
    const handleDelete = useCallback(async (record: DataType) => {
        const idArr = [record.id]
        const nameList = [record.name]
        const nameStr = nameList.join()
        const oParams = {
            bname: `实验类型-【${nameStr}】`,
            bmodule: '实验类型',
            bcontent: '删除实验类型',
            newValue: '',
            rawValue: JSON.stringify({ name: nameStr }),
            bid: null,
            boperationType: 'delete',
            list: idArr,
            bsystem: 'eln'
        }
        const { code, description } = await deleteExperimentClassification(oParams)
        if(code === 0) {
            setPageForm({...pageForm, pageNum: 1})
            getData()
        }else{
            message.error(description)
        }
    }, [getData, pageForm])

    const addType = useCallback(() => {
        setType(0)
        setEditRecord({})
        setVisible(true)
    }, [])

    // 编辑
    const [editRecord, setEditRecord] = useState({})
    const handleEdit = useCallback(async (record: DataType) => {
        // 数据
        setType(1)
        setEditRecord(record)
        setVisible(true)
    }, [])

    const closeModal = useCallback(async () => {
        setPageForm({
            ...pageForm,
            pageNum: 1
        })
        setVisible(false)
    }, [pageForm])

    return (
        <div className={style.module}>
            <div className={style.operate}>
                <Button icon={<PlusOutlined />} onClick={addType} type="primary">新增类型</Button>
            </div>
            <div className={style.content}>
                <div className={style.table}>
                    <Table pagination={false} rowKey={(record: any) => record.id} dataSource={tableData} columns={columns}/>
                </div>
                <div className={style.page}>
                    <Pagination
                        total={total}
                        current={pageForm.pageNum}
                        pageSize={pageForm.pageSize}
                        showSizeChanger
                        showQuickJumper
                        onChange={changePage}
                        showTotal={(total: number) => `总共 ${total} 条`}
                    />
                </div>
            </div>
            {
                visible?
                    <SaveContent record={editRecord} type={type} closeModal={closeModal} visible={visible}/>
                    :
                    ''
            }
        </div>
    )
}

export default Type;