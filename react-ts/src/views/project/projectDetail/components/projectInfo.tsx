import React, { memo } from 'react';
import type { FC, ReactNode } from 'react'
import { ProjectProps } from '../index'

interface IProps {
    project: ProjectProps,
    children?: ReactNode
}

const ProjectInfo: FC<IProps> = (props) => {
    console.log(props)
    return <div>ProjectInfo</div>
}

export default memo(ProjectInfo)