import style from './index.module.scss'
import { Card } from 'antd'

type IProps = {
    type: 0 | 1 | 2 // 新增、编辑、详情
}

const ProjectMember = (props: IProps) => {
    return (
        <>
            <Card title="项目人员" size="small">
                项目人员
            </Card>
        </>
    )
}

export default ProjectMember