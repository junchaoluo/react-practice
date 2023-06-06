import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom'
import { getProjectDetailById } from '@/api/project'
import style from './index.module.scss'
import { Tag, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import ProjectExpriments from './components/projectExpriments'
import BasicInfo from './components/basicInfo'
import ProjectMember from '@/views/project/components/projectMember'
import dayjs from 'dayjs'

export type ProjectProps = {
  id?: string,
  type?: 1 | 2, // 0 1 2新增编辑详情
  code?: string,
  isArchive?: 0 | 1,
  startTime?: '',
  endTime?: '',
  projectUser?: '',
  projectCode: '',
  [propName: string]: unknown
}

const dateFormat = 'YYYY-MM-DD';

const getProjectDetail = async (id: string) => {
  const { result } = await getProjectDetailById(id)
  return result || {}
}

const ProjectDetail: FC<PropsWithChildren> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [project, setProject] = useState<ProjectProps>({})
  const [activeKey, setActiveKey] = useState('0')
  const [items, setItems] = useState<TabsProps>([
    {
      key: '2',
      label: `实验记录(0)`
    },
    {
      key: '1',
      label: `项目概况`
    }
  ])
  const basicRef = useRef()
  const ProjectMemberRef = useRef()

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
        departmentIds: result.departments.map(item => item.id) || [],
        cycle: [dayjs(result.startTime, dateFormat), dayjs(result.endTime, dateFormat)],
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

  // 获取实验记录数据总数
  const getTotal = useCallback((total: number) => {
    const tempItems: Array<TabsProps> = items.map((item: TabsProps) => {
      if(item.key === '2'){
        item.label = `实验记录(${total})`
      }
      return item
    })
    setItems(tempItems)
  }, [items])


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
                activeKey === '2'?
                <ProjectExpriments project={project} returnTotal={getTotal}/>
                :
                <>
                  <BasicInfo project={project} ref={basicRef}/>
                  <ProjectMember projectId={project.id} type={Number(project.type)} ref={ProjectMemberRef}/>
                </>
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