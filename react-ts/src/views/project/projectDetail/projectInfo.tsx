import React, { memo } from 'react';
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const ProjectInfo: FC<IProps> = () => {
  return <div>ProjectInfo</div>
}

export default memo(ProjectInfo)