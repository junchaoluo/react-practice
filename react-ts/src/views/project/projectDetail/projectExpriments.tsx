import React, { memo } from 'react';
import type { FC, ReactNode } from 'react'
import { ProjectProps } from './index'

interface IProps {
    project: ProjectProps,
    children?: ReactNode
}

const ProjectExpriments: FC<IProps> = (props) => {
    console.log(props)
    return <div>Template</div>
}

export default memo(ProjectExpriments)