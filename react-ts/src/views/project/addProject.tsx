import { Space, Button, Card } from 'antd'
import BasicInfo from "./basicInfo"
import ProjectMember from "./projectMember"
import style from './index.module.scss'
import { getUserDepartment } from '@/api/user'
import { useState, useEffect, useRef, useCallback } from 'react'
import store from '@/store/index'
import { useSelector } from 'react-redux'

const AddProject = () => {
    const { userInfo } = useSelector((store) => store.user)

    const [project, setProject] = useState({
        departments: [],
        departmentId: '',
        departmentName: ''
    })
    const basicInfoRef = useRef<ForwardedRef>()
    const projectMember = useRef<ForwardedRef>()

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

    const save = useCallback(() => {
        console.log(basicInfoRef.current.getFieldsValue())
        console.log(projectMember.current)
    }, [])

    return (
        <div className={style.backGround}>
            <Space direction="vertical" style={{width: '100%'}}>
                <BasicInfo type={0} projectInfo={project} ref={basicInfoRef}></BasicInfo>
                <ProjectMember type={0} ref={projectMember}></ProjectMember>
                <Card size="small">
                    <div className={style.footer}>
                        <Button>取消</Button>
                        <Button type="primary" onClick={save}>保存</Button>
                    </div>
                </Card>
            </Space>
        </div>
    )
}

export default AddProject