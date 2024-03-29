import { memo, PropsWithChildren, FC, useState, useEffect, useRef, useCallback } from 'react';
import { cloneDeep } from 'lodash'
import style from '../index.module.scss'
import { Divider, Button, Input, Tree, message, Table, Switch, Select } from 'antd'
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import type { ColumnsType } from 'antd/es/table'
import { getDetectionClassifyItemList, deleteSampleDetect, setCollection } from '@/api/sample'
import { GetDetectionClassifyItemListParams } from '@/interfaces/sample'
import { useSelector } from 'react-redux'

type ElnSamplesDetectDto = {
       samplesStatus?: number,
       detectionItem?: string,
       configItemId: string,
       detectionPurposeObj?: object | null | undefined,
       detectionMethodObj?: object | null | undefined,
       detectionRequirementObj?: object | null | undefined
}

interface GetTreeInterface {
       params: GetDetectionClassifyItemListParams
}

type TreeProps = {
       name: string,
       parentId: string,
       isCare: boolean,
       configItemId: string,
       children?: Array<TreeProps>
} & DataNode

// 获取实验分类检测配置项
const getTreeData = async (params:GetDetectionClassifyItemListParams, setDetectionClassifyItemList:CallableFunction, alist: Array<ElnSamplesDetectDto>,
        type = 'add', setDetectionTree: CallableFunction, setDetectionTreeMap: CallableFunction) => {
       const { result } = await getDetectionClassifyItemList(params)
       setDetectionClassifyItemList(result || [])
       // 处理配置项
       let [detectionTree, detectionTreeMap] = handleDetectiomConfigItem(result, alist = [], type)
       setDetectionTree(detectionTree)
       setDetectionTreeMap(detectionTreeMap)
}

const columnSetMap: Array<{
       key: string,
       fromKey: string,
       label: string,
       prop: string
}> = [
       {
         key: 'detectionPurposeObj',
         fromKey: 'detectionPurpose',
         label: '测试目的',
         prop: 'detectionPurpose'
       },
       {
         key: 'detectionMethodObj', // 表格的obj
         fromKey: 'detectionMethod', // 检测项配置列表数据返回的key
         label: '方法信息', // 表头名称
         prop: 'detectionMethod' // 送样保存数据字段
       },
       {
         key: 'detectionRequirementObj',
         fromKey: 'detectionRequirement',
         label: '检项要求',
         prop: 'detectionRequirement'
       }
     ]

// 处理配置项
const handleDetectiomConfigItem = (aTree = [], alist: Array<ElnSamplesDetectDto>, type = 'add') => {
       const disabledNodes = cloneDeep(alist).map(oItem => {
       if (
              oItem.samplesStatus === 4 ||
              oItem.samplesStatus === 5 ||
              oItem.samplesStatus === 6 ||
              oItem.samplesStatus === 7
       ) {
              const [parentId, ...childrenList] = oItem.detectionItem?.split(',')
              return parentId
       }
       })

       if (type === 'add') {
              // 新增有记录本缓存的时候要查询最新的检测项
              alist.forEach(al => {
                     cloneDeep(aTree).forEach(pn => {
                            if (al.configItemId.includes(pn.id)) {
                                   // 测试目的、方法信息、检测标准
                                   columnSetMap.forEach(columnSet => {
                                          al[columnSet.key] = pn[columnSet.fromKey] ? pn[columnSet.fromKey] : {}
                                   })
                            }
                     })
              })
       }

       let oTreeMap = {}
       aTree = cloneDeep(aTree).map(pNode => {
              oTreeMap[pNode.id] = pNode.name
              pNode.configItemId = pNode.id
              if (disabledNodes.includes(pNode.id)) {
                     pNode.disabled = true
              }
              delete pNode.id
              pNode.children?.forEach(cNode => {
                     oTreeMap[cNode.id] = cNode.name
                     cNode.configItemId = cNode.id
                     if (pNode.disabled) {
                            cNode.disabled = true
                     }
                     delete cNode.id
              })
              // 测试目的、方法信息、检测标准
              columnSetMap.forEach(columnSet => {
                     pNode[columnSet.key] = pNode[columnSet.fromKey] ? pNode[columnSet.fromKey] : {}
                     delete pNode[columnSet.fromKey]
              })
              return pNode
       })
       return [aTree, oTreeMap]
}

const findParentItem = (dataList: Array<TreeProps>, item: TreeProps) => {
       const findItem: TreeProps = dataList.find(data => data.configItemId === item.parentId)
       return findItem
}

interface TableProps {
       detectionItem?: string,
       detectionName?: string,
       isSelf?: boolean, // 是否自检
       dept?: string, // 检测部门id
       analyst?: string, // 分析员id
       analyMethod?: string, // 分析方法
       // standard: string, // 检测标准
       detectionRequirement?: string, // 检项要求
       deptName?: string, // 检测部门名称
       analyzeName?: string, // 分析员名称
       checkUser?: Array<unknown>,
       nowDept?: object
}

const DetectionInfo: FC<PropsWithChildren> = (props) => {
       const { userInfo } = useSelector((store) => store.user)

       const [detectionClassifyItemList, setDetectionClassifyItemList] = useState([])
       // 检测项树数据
       const [detectionTree, setDetectionTree] = useState<Array<TreeProps>>([])
       // 检测项枚举集合
       const [detectionTreeMap, setDetectionTreeMap] = useState({})
       const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
       const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
       // tree的宽度
       const [treeWidth, setTreeWidth] = useState<number>(230)

       // 查询tree的检测项数据
       useEffect(() => {
              getTreeData({}, setDetectionClassifyItemList, [], '', setDetectionTree, setDetectionTreeMap)
       }, [])

       const [keywords, setKeywords] = useState<string>('')

       // 是否关注
       const changeCare = async (v: TreeProps) => {
              if(v.isCare) {
                     // 取消关注
                     const { code } = await deleteSampleDetect([v.configItemId])
                     if(code === 0) {
                            message.success('取消关注成功！')
                     }
              }else {
                     // 关注
                     const { code } = await setCollection([{
                            sampleDetectId: v.configItemId
                     }])
                     if(code === 0) {
                            message.success('关注成功！')
                     }
              }
              getTreeData({}, setDetectionClassifyItemList, [], '', setDetectionTree, setDetectionTreeMap)
       }
       
       const [detectionTable, setDetectionTable] = useState([])
       const onCheck = useCallback((checkedKeysNodes: Array<string>, e:{checked: boolean, checkedNodes: Array<TreeProps>, node: TreeProps, event: Event}) => {
              const checked = e.checked
              const node = e.node
              const configItemId = node.configItemId
              if(checked) {
                     // 选中 拼接名称
                     if(node.parentId === '0') {
                            // 选中父级
                            setSelectedKeys([...selectedKeys, configItemId])
                            setCheckedKeys([...checkedKeys, configItemId])
                            setDetectionTable([...detectionTable, node])
                     }else {
                            // 选中子级 查询子级的父级是否选中 没选中给选中 选中了就继续执行子级选中操作
                            const parentConfigItemId = findParentItem(detectionTree, node).configItemId
                            const parentName = findParentItem(detectionTree, node).name
                            const exsit = selectedKeys.includes(parentConfigItemId || '')
                            const arr = [configItemId]
                            if(exsit) {
                                   // 选中了就直接拼接名称
                                   const table = detectionTable.find(table => table.configItemId.includes(parentConfigItemId))
                                   let name = table.name
                                   const childNameList = name.substring(name.indexOf('(') + 1, name.indexOf(')'))
                                   let childName = []
                                   if(childNameList) {
                                          if(childNameList.includes(';')) {
                                                 childName = childNameList.split(';')
                                          }else{
                                                 childName = [childNameList]
                                          }
                                   }
                                   childName.push(node.name)
                                   name = `${parentName}(${childName.join(';')})`
                                   const newConfigItemId = `${table.configItemId},${configItemId}`
                                   detectionTable.forEach(item => {
                                          if(item.configItemId.includes(parentConfigItemId)) {
                                                 item.name = name
                                                 item.configItemId = newConfigItemId
                                          }
                                   })
                                   setDetectionTable(detectionTable)
                            }else{
                                   arr.push(parentConfigItemId)
                                   // 没选中就新增一条表格数据 拼接父级和子级名称和configItemId
                                   const parent = findParentItem(detectionTree, node)
                                   const name = `${parent.name}(${node.name})`
                                   const newConfigItemId = `${parent.configItemId},${configItemId}`
                                   setDetectionTable([...detectionTable, {
                                          ...node,
                                          name: name,
                                          configItemId: newConfigItemId
                                   }])
                            }
                            setSelectedKeys([...selectedKeys, ...arr])
                            setCheckedKeys([...checkedKeys, ...arr])
                     }
              }else{
                     // 取消选中 拼接名称
                     let arr = []
                     if(node.parentId === '0') {
                            // 取消选中的父级 全部子级也取消
                            const childId = [...node.children?.map(item => item.configItemId) || [], configItemId]
                            arr = selectedKeys.filter(select => childId?.every(child => select !== child))
                            // 取消选中 数据也减少
                            const tableData = detectionTable.filter(table => !table.configItemId.includes(configItemId))
                            setDetectionTable(tableData)
                     }else {
                            // 取消选中的子级
                            arr = selectedKeys.filter(select => select !== configItemId)
                            // 取消选中的子级 将子级名称去掉 将configItemId也去掉
                            const tableData = detectionTable.map(table => {
                                   if(table.configItemId.includes(configItemId)) {
                                          let configItemIdList = table.configItemId.split(',')
                                          configItemIdList.splice(configItemIdList.indexOf(configItemId), 1)
                                          table.configItemId = configItemIdList.join(',')
                                          let parentName = table.name.substring(0, table.name.indexOf('('))
                                          let childNameList = table.name.substring(table.name.indexOf('(') + 1, table.name.indexOf(')'))
                                          let childName = []
                                          if(childNameList) {
                                                 if(childNameList.includes(';')) {
                                                        // 多个
                                                        childName = childNameList.split(';')
                                                        childName?.splice(childName.indexOf(node.name), 1)
                                                 }else{
                                                        childName = []
                                                 }
                                          }
                                          if(childName.length > 0) {
                                                 table.name = `${parentName}(${childName.join(';')})`
                                          }else{
                                                 table.name = `${parentName}`
                                          }
                                   }
                                   console.log(table)
                                   return table
                            })
                            setDetectionTable(tableData)
                     }
                     setSelectedKeys(arr)
                     setCheckedKeys(arr)
              }
       }, [selectedKeys, checkedKeys, detectionTable, detectionTree])

       console.log(detectionTable)

       const columns: ColumnsType<any> = [
              {
                     key: 'name',
                     dataIndex: 'name',
                     title: '检测项目',
                     width: 120,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'isSelf',
                     dataIndex: 'isSelf',
                     title: '是否自检',
                     ellipsis: true,
                     width: 120,
                     render: (text, record, index) => {
                            return (
                                   <Switch size='small' defaultChecked={record.isSelf} checked={record.isSelf} onChange={(checked) => changeSelf(checked, record)} />
                            )
                     }
              },
              {
                     key: 'analyst',
                     dataIndex: 'analyst',
                     title: '检测部门/人',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            if(record.isSelf) {
                                   return <span>{record.analyzeName}</span>
                            }else{
                                   return (
                                          <div>
                                                 {
                                                        record.analyst?
                                                        <div>{record.analyzeName}</div>
                                                        :
                                                        (
                                                               record.dept?
                                                               <div>{record.deptName}</div>
                                                               :
                                                               ''
                                                        )
                                                 }
                                          </div>
                                   )
                            }
                     }
              },
              {
                     key: 'detectionPurpose',
                     dataIndex: 'detectionPurpose',
                     title: '测试目的',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return (
                                   <div>
                                          {
                                                 record.required?
                                                 <div>必填</div>
                                                 :
                                                 ''
                                          }
                                          <Select></Select>
                                   </div>
                            )
                     }
              },
              {
                     key: 'detectionMethod',
                     dataIndex: 'detectionMethod',
                     title: '方法信息',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'detectionRequirement',
                     dataIndex: 'detectionRequirement',
                     title: '检项要求',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'detectionRemark',
                     dataIndex: 'detectionRemark',
                     width: 120,
                     title: '备注',
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'action',
                     dataIndex: 'action',
                     title: '操作',
                     width: 120,
                     fixed: 'right',
                     render: (text, record, index) => {
                            return (
                                   <Button type='link' onClick={() => deleteDetectionTable(index)}>删除</Button>
                            )
                     }
              },
       ] 
       // 是否自检
       const changeSelf = useCallback((checked: boolean, record) => {
              let arr = detectionTable.map(item => {
                     if(item.configItemId === record.configItemId) {
                            item.isSelf = checked
                            if(checked) {
                                   console.log(userInfo)
                                   item.analyst = userInfo.id
                                   item.analyzeName = userInfo.name || userInfo.nickname
                                   item.dept = userInfo.departmentList[userInfo.departmentList.length - 1]
                                   item.deptName = userInfo.departmentName
                            }else{
                                   item.analyst = ''
                                   item.analyzeName = ''
                                   item.dept = ''
                                   item.deptName = ''
                            }
                     }
                     return item
              })
              setDetectionTable(arr)
       }, [detectionTable, userInfo])

       // 删除检测项
       const deleteDetectionTable = (index: number) => {
              const arr = detectionTable.filter((item, i) => i !== index)
              setDetectionTable(arr)
       }

       return (
              <div className={style.detection}>
                     <div className={style.header}>
                            <Divider type="vertical" className={style.dividerClass} />
                            <div className={style.title}>检测标准</div>
                     </div>
                     <div className={style.detectionContent}>
                            <div className={style.tree}>
                                   <div className={style.treeHeader}>
                                          <div className={style.treeHeaderTitle}>
                                                 <div className='title6'>检测项</div>
                                                 <Button type='link'>重置</Button>
                                          </div>
                                          <div className={style.treeHeaderSearch}>
                                                 <Input placeholder='搜索检测项' value={keywords} onChange={(event) => {
                                                        setKeywords(event.target.value)
                                                 }} suffix={<SearchOutlined />}/>
                                          </div>
                                   </div>
                                   <div className={style.treeContent} style={{width: `${treeWidth}px`}}>
                                          <Tree
                                                 checkable
                                                 autoExpandParent={true}
                                                 checkedKeys={checkedKeys}
                                                 fieldNames={{
                                                        title: 'name',
                                                        key: 'configItemId',
                                                        children: 'children'
                                                 }}
                                                 checkStrictly={true}
                                                 onCheck={onCheck}
                                                 showIcon={true}
                                                 selectedKeys={selectedKeys}
                                                 treeData={detectionTree}
                                                 blockNode={true}
                                                 titleRender={(v) => {
                                                        return (
                                                               <div className='flex-between'>
                                                                      <div className='single-ellipsis hover-opacity' style={{width: `${treeWidth - 130}px`}}>{v.name}</div>
                                                                      <div onClick={() => changeCare(v)}>
                                                                             {
                                                                                    v.isCare?
                                                                                    <div>
                                                                                           <StarFilled style={{color: 'rgb(250, 173, 20)'}} />
                                                                                    </div>
                                                                                    :
                                                                                    (
                                                                                           v.parentId === '0'?
                                                                                           <div className='hover-block'>
                                                                                                  <StarOutlined />
                                                                                           </div>
                                                                                           :
                                                                                           ''
                                                                                    )
                                                                             }
                                                                      </div>
                                                               </div>
                                                        )
                                                 }}
                                                 />
                                   </div>
                            </div>
                            <div className={style.table}>
                                   <Table 
                                          dataSource={detectionTable}
                                          columns={columns}
                                          pagination={false}
                                          size='small'
                                          expandable={{
                                                 childrenColumnName: 'aa'
                                          }}
                                          scroll={{
                                                 x: `calc(100% - ${treeWidth}px - 48px)`,
                                                 y: '510px'
                                          }}
                                   />
                            </div>
                     </div>
              </div>
       )
}

export default memo(DetectionInfo)