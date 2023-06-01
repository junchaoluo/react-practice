import { memo, useCallback, useState } from 'react';
import type { FC, ReactNode } from 'react'
import { ProjectProps } from '../index'
import style from '../index.module.scss'
import { Input, Table, Page, Tooltip, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import {getExperimentByConditionAndAuthV2} from '@/api/project'

interface IProps {
    project: ProjectProps,
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
    const { project } = props
    const navigate = useNavigate()
    const [keywords, setKeywords] = useState('')
    const [tableData, setTableData] = useState([])
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
            render: (record) => {
                return (
                    <Button type="link" onClick={viewExpriment(record.id)}>
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

    const viewExpriment = useCallback((id: string) => {
        navigate('/aaa')
    }, [])

    // 点击搜索按钮
    const search = useCallback(async () => {
        fetchData(pageForm, {
            code: keywords,
            projectCode: project.projectCode,
            projectId: project.projectId
        })
    }, [project.id, keywords, pageForm])

    return (
        <div className={style.table}>
            <div className={style.search}>
                <Input value={keywords} onChange={(e: Event) => setKeywords(e?.target?.value)}/>
            </div>
            <div>
                <Table dataSource={tableData} columns={columns}/>
            </div>
        </div>
    )
}

export default memo(ProjectExpriments)