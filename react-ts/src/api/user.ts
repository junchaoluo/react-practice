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