import { Space } from 'antd'
import BasicInfo from "./basicInfo"
import ProjectMember from "./projectMember"
import style from './index.module.scss'

const AddProject = () => {
    return (
        <div className={style.backGround}>
            <Space direction="vertical" style={{width: '100%'}}>
                <BasicInfo type={0}></BasicInfo>
                <ProjectMember type={0}></ProjectMember>
            </Space>
        </div>
    )
}

export default AddProject