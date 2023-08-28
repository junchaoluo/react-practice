import { memo, PropsWithChildren, FC, useState, useEffect, useRef } from 'react';
import { cloneDeep } from 'lodash'
import style from '../index.module.scss'
import { Divider, Button, Input, Tree, message, Table, Switch } from 'antd'
import { SearchOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import type { ColumnsType } from 'antd/es/table'
import { getDetectionClassifyItemList, deleteSampleDetect, setCollection } from '@/api/sample'
import { GetDetectionClassifyItemListParams } from '@/interfaces/sample'

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
              })
              return pNode
       })
       return [aTree, oTreeMap]
}

const findParentItem = (dataList: Array<TreeProps>, item: TreeProps) => {
       const findItem: TreeProps = dataList.find(data => data.configItemId === item.parentId)
       return findItem
}

const DetectionInfo: FC<PropsWithChildren> = (props) => {
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

       const onCheck = (checkedKeysNodes: Array<string>, e:{checked: boolean, checkedNodes: Array<TreeProps>, node: TreeProps, event: Event}) => {
              console.log('onCheck', checkedKeys, e);
              const checked = e.checked
              const node = e.node
              const configItemId = node.configItemId
              if(checked) {
                     // 选中 拼接名称
                     if(node.parentId === '0') {
                            // 选中父级
                            setSelectedKeys([...selectedKeys, configItemId])
                            setCheckedKeys([...checkedKeys, configItemId])
                            let obj = {
                                   name: node.name
                            }
                            setDetectionTable([...detectionTable, node])
                     }else {
                            // 选中子级 查询子级的父级是否选中 没选中给选中 选中了就继续执行子级选中操作
                            const parentConfigItemId = findParentItem(detectionTree, node).configItemId
                            const exsit = selectedKeys.includes(parentConfigItemId || '')
                            const arr = [configItemId]
                            if(exsit) {
                                   // 选中了就直接拼接名称
                            }else{
                                   arr.push(parentConfigItemId)
                                   // 没选中就新增一条表格数据
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
                     }else {
                            // 取消选中的子级
                            arr = selectedKeys.filter(select => select !== configItemId)
                     }
                     setSelectedKeys(arr)
                     setCheckedKeys(arr)
              }
       };

       const columns: ColumnsType<any> = [
              {
                     key: 'name',
                     dataIndex: 'name',
                     title: '检测项目',
                     ellipsis: true,
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
                                   <Switch size='small' defaultChecked={record.isSelf} checked={record.isSelf} onChange={() => changeSelf(record)} />
                            )
                     }
              },
              {
                     key: 'name',
                     dataIndex: 'name',
                     title: '检测部门/人',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'isSelf',
                     dataIndex: 'isSelf',
                     title: '测试目的',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'name',
                     dataIndex: 'name',
                     title: '方法信息',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'isSelf',
                     dataIndex: 'isSelf',
                     title: '检项要求',
                     width: 120,
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'name',
                     dataIndex: 'name',
                     width: 120,
                     title: '备注',
                     ellipsis: true,
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
              {
                     key: 'isSelf',
                     dataIndex: 'isSelf',
                     title: '操作',
                     width: 120,
                     fixed: 'right',
                     render: (text, record, index) => {
                            return <span>{text}</span>
                     }
              },
       ] 
       const [detectionTable, setDetectionTable] = useState([])

       const changeSelf = (record) => {
              detectionTable.forEach(item => {
                     if(item.configItemId === record.configItemId) {
                            item.isSelf = record.isSelf
                            item.analyst = ''
                            item.analyzeName = ''
                            item.dept = ''
                            item.deptName = ''
                     }
              })
              setDetectionTable(detectionTable)
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