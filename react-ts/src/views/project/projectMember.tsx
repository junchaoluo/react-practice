import style from './index.module.scss'
import { Card, Table, Divider, Tooltip  } from 'antd'
import { useEffect, useState, memo, useRef } from 'react'
import { getProjectRoleList } from '@/api/project'
import type { ColumnsType } from 'antd/es/table';
import {
    UsergroupDeleteOutlined,
    HighlightOutlined
  } from '@ant-design/icons';
  import ChooseUser from '@/components/chooseUser'

type IProps = {
    type: 0 | 1 | 2 // 新增、编辑、详情
}

type RoleType = {
    id: string,
    isCheck: number, // 是否必填的角色id
    name: string, // 岗位
    type: number,
}

type DataType = RoleType & {
    user: Array<never>, // 人员配置
}

const ProjectMember = memo((props: IProps) => {
    const columns: ColumnsType<DataType> = [
        {
            title: '岗位',
            dataIndex: 'name',
            width: 250,
            key: 'name'
        },
        {
            title: '人员设置',
            dataIndex: 'user',
            key: 'user',
            render: (text: string, record: any, index: number) => {
                return (
                    <div>123</div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 100,
            render: (text: string, record: any, index: number) => {
                return (
                    <div className={style.action}>
                        <Tooltip title="选择人员">
                            <UsergroupDeleteOutlined style={{fontSize: '20px', color: '#999ba3'}} onClick={() => showChooseUserModal()}/>
                        </Tooltip>
                        <Divider type="vertical"/>
                        <Tooltip title="清除全部">
                            <HighlightOutlined style={{fontSize: '20px', color: '#999ba3'}} />
                        </Tooltip>
                    </div>
                )
            },
        }
    ]
    const [roleList, setRoleList] = useState<Array<RoleType>>([])
    const [dataSource, setDataSource] = useState<Array<DataType>>([])

    useEffect(() => {
        // 查询项目人员的岗位
        if(props.type === 0) {
            getRoleList()
        }
    }, [])

    const getRoleList = () => {
        getProjectRoleList().then((res: {
            result: Array<never>
        }) => {
            setRoleList(res.result || [])
            let arr: DataType[] = []
            arr = res.result.map((item: RoleType) => {
                const obj: DataType = {
                    id: '',
                    isCheck: 0,
                    name: '',
                    type: 0,
                    user: []
                }
                obj.id = item.id
                obj.isCheck = item.isCheck
                obj.name = item.name
                obj.type = item.type
                obj.user = []
                return obj
            })
            setDataSource(arr || [])
        })
    }
    const [chooseUserModal, setChooseUserModal] = useState(false) // 选择人员弹窗
    const chooseUserRef = useRef()
    const showChooseUserModal = () => {
        setChooseUserModal(true)
    }

    return (
        <>
            <Card title='项目人员' size="small">
                <Table dataSource={dataSource} columns={columns} size="small" pagination={false} />
                <ChooseUser ref={chooseUserRef} visible={chooseUserModal} closeModal={() => setChooseUserModal(false)}/>
            </Card>
        </>
    )
})

export default ProjectMember