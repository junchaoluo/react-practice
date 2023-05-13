import { Space, Button, Card } from 'antd'
import BasicInfo from "./basicInfo"
import ProjectMember from "./projectMember"
import style from './index.module.scss'
import { getUserDepartment } from '@/api/user'
import { useState, useEffect, useRef } from 'react'
import store from '@/store/index'

const AddProject = () => {
    const userInfo = store.getState().handleUser.userInfo

    const [project, setProject] = useState({
        departments: [],
        departmentId: '',
        departmentName: ''
    })
    const basicInfoRef = useRef()

    // 查询项目信息
    useEffect(() => {
        getUserDepartment(userInfo.id).then((res: {
            result: any
        }) => {
            if (res.result.departmentTier?.hasChildren) return
            const departments = res.result.departmentTier?.departments || []
            const deparmentLength = departments.length
            setProject(Object.assign({}, project, {
                departments: departments,
                departmentId: departments[deparmentLength - 1]?.id,
                departmentName: departments[deparmentLength - 1]?.name,
            }))
        })
    }, [])

    const save = () => {
        console.log('123')
        console.log(basicInfoRef)
    }

    return (
        <div className={style.backGround}>
            <Space direction="vertical" style={{width: '100%'}}>
                <BasicInfo type={0} projectInfo={project} ref={basicInfoRef}></BasicInfo>
                <ProjectMember type={0}></ProjectMember>
            </Space>
            <Card size="small">
                <div className={style.footer}>
                    <Button>取消</Button>
                    <Button type="primary" onClick={save}>保存</Button>
                </div>
            </Card>
        </div>
    )
}

export default AddProject