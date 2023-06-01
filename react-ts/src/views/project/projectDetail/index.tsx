import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom'
import { getProjectDetailById } from '@/api/project'
import style from './index.module.scss'
import { Tag, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import ProjectExpriments from './components/projectExpriments'
import ProjectInfo from './components/projectInfo'

export type ProjectProps = {
  id?: string,
  type?: 0 | 1,
  code?: string,
  isArchive?: 0 | 1,
  startTime?: '',
  endTime?: '',
  projectUser?: '',
  projectCode: '',
  [propName: string]: unknown
}

const getProjectDetail = async (id: string) => {
  const { result } = await getProjectDetailById(id)
  return result || {}
}

const ProjectDetail: FC<PropsWithChildren> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [project, setProject] = useState<ProjectProps>({})
  const [activeKey, setActiveKey] = useState('0')
  const [total, setTotal] = useState(0)
  const [items, setItems] = useState<TabsProps>([
    {
      key: '0',
      label: `实验记录(${total})`
    },
    {
      key: '1',
      label: `项目概况`
    }
  ])

  useEffect(() => {
    // 是页面，所以进来之后直接执行就可以
    async function fetchData() {
      const result = await getProjectDetail(searchParams.get('projectId'))
      const projectUser = result.pmUserProjectInfos.map(m => {
          if (m.roleName === 'PM') {
            return m.userName
          }
        }).join(',')
      result.projectUser = projectUser
      setProject({
        ...result,
        type: searchParams.get('type'),
        projectCode: searchParams.get('projectCode')
      })
    }
    fetchData()
    setActiveKey(`${searchParams.get('type')}`)
  }, [searchParams])

  const changeTab = useCallback((key: string) => {
    setActiveKey(key)
  }, [])


  return (
    <>
        <div className={style.container}>
          <div className={style.header}>
            <div className={style.headerTitle}>
              <div className={style.code}>{project.code}</div>
              <div className={style.status}>
                <Tag bordered={false} color={project.isArchive === 1?'success':'warning'}>
                  {project.isArchive === 1?'已完成':'进行中'}
                </Tag>
              </div>
            </div>
            <div className={style.headerInfo}>
              <div>项目周期：{ project.startTime } - { project.endTime }</div>
              <div className={style.projectManager}>项目经理：{ project.projectUser }</div>
            </div>
            <Tabs activeKey={activeKey} items={items} onChange={changeTab} />
          </div>
          <div className={style.content}>
            {
              project.id?
              (
                activeKey === '0'?
                <ProjectExpriments project={project}/>
                :
                <ProjectInfo project={project}/>
              )
              :
              ''
            }
          </div>
        </div>
    </>
  )
}

export default ProjectDetail