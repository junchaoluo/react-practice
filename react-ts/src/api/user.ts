import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'

// 获取部门树
export function getDeptTree() {
    return request({
      url: BASE_PREFIX + '/department/tree',
      method: 'get'
    })
}

// 根据用户id获取用户部门
export function getUserDepartment(id: string) {
    return request({
      url: BASE_PREFIX + `/user/${id}`,
      method: 'get'
    })
}

// 获取用户列表
export type UserSearchParam = {
  departmentId: string,
  keywords: string,
  pageIndex: number,
  pageSize: number,
  needCheckAll?: boolean,
  status?: number
}
export function getUserList(oParams: UserSearchParam) {
  if (!oParams.needCheckAll) {
    oParams.status = 0 // 过滤冻结状态的用户
  }
  return request({
    url: BASE_PREFIX + `/user/list/${oParams.pageIndex}/${oParams.pageSize}`,
    method: 'post',
    data: oParams
  })
}

// 通过编码查询字典集
export function findByParentCodeList(data: {
  gloablecodeList: string
}) {
  return request({
    url: BASE_PREFIX + `/dict/findByParentCodeList?gloablecodeList=${data.gloablecodeList}`,
    method: 'post'
  })
}