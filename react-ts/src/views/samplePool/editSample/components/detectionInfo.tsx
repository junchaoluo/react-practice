import { memo, PropsWithChildren, FC, useState, useEffect } from 'react';
import { cloneDeep } from 'lodash'
import style from '../index.module.scss'
import { Divider, Button, Input, Tree } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import { getDetectionClassifyItemList } from '@/api/sample'
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

// 获取实验分类检测配置项
const getTreeData = async (params:GetDetectionClassifyItemListParams, setDetectionClassifyItemList:CallableFunction, alist: Array<ElnSamplesDetectDto>,
        type = 'add', setDetectionTree: CallableFunction, setDetectionTreeMap: CallableFunction) => {
       const { result } = await getDetectionClassifyItemList(params)
       setDetectionClassifyItemList(result || [])
       // 处理配置项
       let [detectionTree, detectionTreeMap] = handleDetectiomConfigItem(result = [], alist = [], type)
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
const handleDetectiomConfigItem = (aTree, alist: Array<ElnSamplesDetectDto>, type) => {
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

const treeData: DataNode[] = [
       {
         title: '0-0',
         key: '0-0',
         children: [
           {
             title: '0-0-0',
             key: '0-0-0',
             children: [
               { title: '0-0-0-0', key: '0-0-0-0' },
               { title: '0-0-0-1', key: '0-0-0-1' },
               { title: '0-0-0-2', key: '0-0-0-2' },
             ],
           },
           {
             title: '0-0-1',
             key: '0-0-1',
             children: [
               { title: '0-0-1-0', key: '0-0-1-0' },
               { title: '0-0-1-1', key: '0-0-1-1' },
               { title: '0-0-1-2', key: '0-0-1-2' },
             ],
           },
           {
             title: '0-0-2',
             key: '0-0-2',
           },
         ],
       },
       {
         title: '0-1',
         key: '0-1',
         children: [
           { title: '0-1-0-0', key: '0-1-0-0' },
           { title: '0-1-0-1', key: '0-1-0-1' },
           { title: '0-1-0-2', key: '0-1-0-2' },
         ],
       },
       {
              title: '0-1',
              key: '0-1',
              children: [
                { title: '0-1-0-0', key: '0-1-0-0' },
                { title: '0-1-0-1', key: '0-1-0-1' },
                { title: '0-1-0-2', key: '0-1-0-2' },
              ],
            },
       {
         title: '0-2',
         key: '0-2',
       },
     ];
const BasicInfo: FC<PropsWithChildren> = (props) => {
       // const [treeData, setTreeData] = useState([])
       const [detectionClassifyItemList, setDetectionClassifyItemList] = useState([])
       // 检测项树数据
       const [detectionTree, setDetectionTree] = useState([])
       // 检测项枚举集合
       const [detectionTreeMap, setDetectionTreeMap] = useState({})
       const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
       const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']);
       const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

       // 查询tree的检测项数据
       useEffect(() => {
              getTreeData({}, setDetectionClassifyItemList, '', setDetectionTree, setDetectionTreeMap)
       }, [])

       const onCheck = (checkedKeysValue: React.Key[]) => {
              console.log('onCheck', checkedKeysValue);
              setCheckedKeys(checkedKeysValue);
       };

       const onSelect = (selectedKeysValue: React.Key[], info: any) => {
              console.log('onSelect', info);
              setSelectedKeys(selectedKeysValue);
       };

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
                                                 <Input placeholder='搜索检测项' suffix={<SearchOutlined />}/>
                                          </div>
                                   </div>
                                   <div className={style.treeContent}>
                                   <Tree
                                          checkable
                                          expandedKeys={expandedKeys}
                                          autoExpandParent={true}
                                          onCheck={onCheck}
                                          checkedKeys={checkedKeys}
                                          onSelect={onSelect}
                                          showIcon={true}
                                          selectedKeys={selectedKeys}
                                          treeData={treeData}
                                          />
                                   </div>
                            </div>
                            <div className={style.table}></div>
                     </div>
              </div>
       )
}

export default memo(BasicInfo)