import style from '../index.module.scss'
import { Card, Table, Divider, Tooltip  } from 'antd'
import { useEffect, useState, memo, useRef, useCallback, ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { getProjectDetailById, getProjectRoleList, getProjectRoleUserListById } from '@/api/project'
import type { ColumnsType } from 'antd/es/table';
import {
    UsergroupDeleteOutlined,
    HighlightOutlined,
    CloseOutlined
  } from '@ant-design/icons';
import ChooseUser from '@/components/chooseUser'
import { getDeptTree } from '@/api/user'
import { SelectProps, DepartmentProps } from '@/types/chooseUser'
type IProps = {
    projectId?: string,
    type: 0 | 1 | 2 // 新增、编辑、详情
}

type RoleType = {
    id: string,
    isCheck: number, // 是否必填的角色id
    name: string, // 岗位
    type: number,
}

type DataType = RoleType & {
    user: Array<SelectProps>, // 人员配置
}

const getRoleList = async (setRoleList: any, setDataSource: any) => {
    const res = await getProjectRoleList()
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
    // 必填的角色id
    const requiredIds = res.result.map(r => r.isCheck === '1' && r.id)
    return requiredIds || []
}

const getProjectDetail = async (projectId:string, requiredIds: Array<string>, setRoleList: Function, setDataSource: Function) => {
    const {result} = await getProjectRoleUserListById(projectId)
    const roleist = result.map(r => {
        r.isCheck = requiredIds.indexOf(r.roleId) > -1 ? 1 : 0
        r.name = r.roleName
        r.user = r.user || []
        r.user.map(u => {
            return (u.realName = u.name)
        })
        return r
    })
    setRoleList(roleist)
    setDataSource(roleist)
}

const ProjectMember = memo(forwardRef((props: IProps, ref: ForwardedRef) => {
    const {type, projectId = ''} = props
    const [columns, setColumns] = useState<ColumnsType<DataType>>([
        {
            title: '岗位',
            dataIndex: 'name',
            width: 250,
            key: 'name',
            render: (text: string, record: DataType, index: number) => {
                return (
                    <>
                        {
                            record.isCheck?
                            <div>
                                <span style={{color: red}}>*</span>
                                <span>{text}</span>
                            </div>
                            :
                            <span>{text}</span>
                        }
                    </>
                )
            }
        },
        {
            title: '人员设置',
            dataIndex: 'user',
            key: 'user',
            render: (text: string, record: DataType, index: number) => {
                if(type !== 2) {
                    return (
                        <div>
                            <ul>
                                {
                                    record.user.map((item: SelectProps, i: number) => {
                                        return (
                                            <li className={style.projectMemberUser} key={i}>
                                                <span>{item.name}</span>
                                                <CloseOutlined onClick={() => deleteRowUser(index, item)}/>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    )
                }else{
                    return (
                        <div>
                            {record.user.map(item => item.name).join('，')}
                        </div>
                    )
                }
            }
        },
    ])
    const [roleList, setRoleList] = useState<Array<RoleType>>([])
    const [dataSource, setDataSource] = useState<Array<DataType>>([])
    const [departmentData, setDepartmentData] = useState([])
    const [selectIndex, setSelectIndex] = useState<number>(0) // 选择的哪一行

    useImperativeHandle(ref, () => ({
        dataSource,
        doValidate: doValidate()
    }))

    useEffect(() => {
        // 查询项目人员的岗位
        let requiredIds: Array<string> = []
        async function getRole() {
            requiredIds = await getRoleList(setRoleList, setDataSource)
        }
        getRole()
        if(type !== 0) {
            // 根据projectId获取岗位列表
            getProjectDetail(projectId, requiredIds, setRoleList, setDataSource)
        }
        if(type !== 2) {
            console.log(type)
            setColumns([...columns, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 100,
                render: (text: string, record: any, index: number) => {
                    return (
                        <div className={style.action}>
                            <Tooltip title="选择人员">
                                <UsergroupDeleteOutlined style={{fontSize: '20px', color: '#999ba3'}} onClick={() => showChooseUserModal(index, record)}/>
                            </Tooltip>
                            <Divider type="vertical"/>
                            <Tooltip title="清除全部">
                                <HighlightOutlined onClick={() => deleteRowUser(index, {}, true)} style={{fontSize: '20px', color: '#999ba3'}} />
                            </Tooltip>
                        </div>
                    )
                },
            }])
        }
    }, [type, projectId])
    const [chooseUserModal, setChooseUserModal] = useState(false) // 选择人员弹窗
    const [checked, setChecked] = useState<Array<SelectProps>>([]) // 选中那一行的已选人员
    const showChooseUserModal = useCallback(async (index: number, record: {
        user: Array<SelectProps>
    }) => {
        const { result } = await getDeptTree()
        setChecked(record.user)
        setSelectIndex(index)
        setDepartmentData(result || [])
        setChooseUserModal(true)
    }, [dataSource])

    // 选择人员弹窗点击确定按钮
    const confirm = useCallback((select: Array<SelectProps>) => {
        const arr = dataSource.map((item, index) => {
            if(index === selectIndex) {
                item.user = select
            }
            return item
        })
        setDataSource(arr)
        setChooseUserModal(false)
    }, [setChooseUserModal, selectIndex, dataSource])

    /**
     * index: 删除的index
     * item: 删除的人员
     * isAll: 是否清楚行数据全部
     */
    const deleteRowUser = useCallback((index: number, item: SelectProps, isAll = false) => {
        const arr = dataSource.filter((data, dataIndex) => {
            if(dataIndex === index) {
                if(isAll) {
                    data.user = []
                }else{
                    data.user = data.user.filter((user) => {
                        if(user.id !== item.id){
                            return user
                        }
                    })
                }
            }
            return data
        })
        setDataSource(arr)
    }, [dataSource])

    // 验证校验必填
    const doValidate = useCallback(() => {
        let flag = true
        flag = !dataSource.some(item => item.isCheck === 1 && item.user.length === 0)
        return flag
    }, [dataSource])

    return (
        <>
            <Card title='项目人员' size="small">
                <Table dataSource={dataSource} rowKey={(record: any) => record.id} columns={columns} size="small" pagination={false} />
                {
                    chooseUserModal?
                    <ChooseUser visible={chooseUserModal} checked={checked} disabledList={[]} departmentData={departmentData} isDepartmentCheck={false} closeModal={() => setChooseUserModal(false)} confirm={confirm}/>
                    :
                    ''
                }
            </Card>
        </>
    )
}))

export default ProjectMember