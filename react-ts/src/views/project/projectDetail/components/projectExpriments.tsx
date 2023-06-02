import { memo, useCallback, useEffect, useState } from 'react';
import type { FC, ReactNode } from 'react'
import { ProjectProps } from '../index'
import style from '../index.module.scss'
import { Input, Table, Pagination, Tooltip, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import {getExperimentByConditionAndAuthV2} from '@/api/project'

interface IProps {
    project: ProjectProps,
    returnTotal: (total: number) => void
    children?: ReactNode
}


const fetchData = async (page: {
    pageIndex: number,
    pageSize: number
   }, data: any) => {
        const { result } = await getExperimentByConditionAndAuthV2(page, data)
        return result
}

const ProjectExpriments: FC<IProps> = (props) => {
    const { project, returnTotal } = props
    const navigate = useNavigate()
    const [keywords, setKeywords] = useState('')
    const [tableData, setTableData] = useState([])
    const [total, setTotal] = useState(0)
    const [pageForm, setPageForm] = useState({
        pageIndex: 1,
        pageSize: 20
    })

    const columns: ColumnsType<any> = [
        {
            title: '实验记录编号',
            dataIndex: 'code',
            key: 'code',
            ellipsis: true,
            width: 130,
            render: (text, record) => {
                return (
                    <Button type="link" onClick={() => viewExpriment(record.id)}>
                        {record.code}
                    </Button>
                )
            }
        },
        {
            title: '模板名称',
            dataIndex: 'templateName',
            ellipsis: true,
            key: 'templateName'
        },
        {
            title: '项目编号',
            dataIndex: 'projectCode',
            ellipsis: true,
            key: 'projectCode'
        },
        {
            title: '产品号',
            dataIndex: 'productCode',
            ellipsis: true,
            key: 'productCode'
        },
        {
            title: '实验目的',
            dataIndex: 'experimentalPurpose',
            ellipsis: true,
            key: 'experimentalPurpose'
        },
        {
            title: '反应方程',
            dataIndex: 'structureImgPath',
            ellipsis: true,
            key: 'structureImgPath'
        },
        {
            title: '最后修改时间',
            width: 130,
            dataIndex: 'updateTime',
            ellipsis: true,
            key: 'updateTime'
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            ellipsis: true,
            key: 'createUser'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            ellipsis: true,
            key: 'createTime'
        },
        {
            title: '状态',
            dataIndex: 'status',
            ellipsis: true,
            key: 'status'
        },
    ]

    useEffect(() => {
        search()
    }, [project.id])

    const viewExpriment = useCallback((id: string) => {
        navigate('/aaa')
    }, [])

    // 点击搜索按钮
    const search = useCallback(async () => {
        const result = await fetchData({
            pageIndex: pageForm.pageIndex,
            pageSize: pageForm.pageSize
        }, {
            code: keywords,
            projectCode: project.projectCode,
            projectId: project.id
        })
        setTableData(result?.list || [])
        setTotal(Number(result?.total))
        returnTotal(result?.total)
    }, [project.projectCode, project.id, keywords, pageForm.pageIndex, pageForm.pageSize])

    const changePage = useCallback((pageIndex:number, pageSize:number) => {
        setPageForm({...pageForm, pageIndex: pageIndex, pageSize: pageSize})
        search()
    }, [pageForm, search])

    return (
        <div className="`${style.table} ${style.contentContainer}`">
            <div className={style.search}>
                <Input style={{width: '25%'}} value={keywords} onChange={(e: Event) => setKeywords(e?.target?.value)}/>
                <Button style={{marginLeft: '16px'}} onClick={search} type="primary">搜索</Button>
            </div>
            <div>
                <Table scroll={{y: '100%'}} pagination={false} rowKey={(record: any) => record.id} dataSource={tableData} columns={columns}/>
                <Pagination
                    total={total}
                    current={pageForm.pageIndex}
                    pageSize={pageForm.pageSize}
                    showSizeChanger
                    showQuickJumper
                    onChange={changePage}
                    showTotal={(total) => `总共 ${total} 条`}
                />
            </div>
        </div>
    )
}

export default memo(ProjectExpriments)