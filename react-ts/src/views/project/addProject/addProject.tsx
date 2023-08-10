import { Space, Button, Card, message, ForwardedRef } from 'antd'
import BasicInfo from "../components/basicInfo"
import ProjectMember from "../components/projectMember"
import style from '../index.module.scss'
import { getUserDepartment } from '@/api/user'
import { createProject } from '@/api/project'
import { useState, useEffect, useRef, useCallback } from 'react'
import store from '@/store/index'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useNavigate } from 'react-router'

const AddProject = () => {
    const { userInfo } = useSelector((store) => store.user)
    const navigate = useNavigate()

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
        // 验证基本信息必填
        let basicForm = basicInfoRef.current.basicForm
        basicInfoRef.current.form.validateFields().then(async form => {
            basicForm = {...basicForm, ...form, departmentId: basicForm.departmentId}
            // 验证人员必填
            if(projectMember.current.doValidate) {
                // 必填项已经填写
                const params = {
                    id: basicForm.id,
                    name: basicForm.name,
                    code: basicForm.code,
                    productId: basicForm.productId,
                    productCode: basicForm.productCode,
                    departmentId: basicForm.departmentId,
                    departmentName: basicForm.departmentName,
                    startTime: moment((basicForm.cycle && basicForm.cycle[0])).format('YYYY-MM-DD') || '',
                    endTime: moment((basicForm.cycle && basicForm.cycle[1])).format('YYYY-MM-DD') || '',
                    description: basicForm.description,
                    projectType: basicForm.projectType,
                    user: []
                }
                const data = projectMember.current.dataSource
                params.user = data
                params.user.forEach(item => {
                    item.roleId = item.id
                    item.roleName = item.name
                })
                const { code, description } = await createProject(params)
                if(code === 0) {
                    message.success('新增项目成功！')
                    navigate('/project')
                }else{
                    message.error(description)
                }
            }
        }).catch(v => {
            console.log(v)
        })
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