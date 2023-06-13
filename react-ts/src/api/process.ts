import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'

/**
 * 获取工艺列表
 * @param {Object} oPathParams path 参数
 * @param {Object} oParams
 * @return {Promise}
 */
 export function getProcessList(oPathParams: any, oParams: any) {
    return request({
      url: ELN_PREFIX + `/processSetting/list/${oPathParams.pageNum}/${oPathParams.pageSize}`,
      method: 'get',
      params: oParams,
      noLoading: true
    })
}

/**
 * 发布工艺
 */
export function publishProcess(id: string) {
  return request({
    url: ELN_PREFIX + `/processSetting/release`,
    method: 'put',
    data: {
      id: id
    }
  })
}

/**
 * 作废工艺
 */
export function invalidProcess(aParams: Array<string>) {
  return request({
    url: ELN_PREFIX + `/processSetting/toVoid`,
    method: 'put',
    data: {
      list: aParams
    }
  })
}

/**
 * 恢复工艺
 */
export function recoverProcess(aParams: Array<string>) {
  return request({
    url: ELN_PREFIX + `/processSetting/recover`,
    method: 'put',
    data: aParams
  })
}

/**
 * 删除工艺
 */
export function deleteProcess(id: string) {
  return request({
    url: ELN_PREFIX + `/processSetting/delete`,
    method: 'delete',
    data: {
      list: [id]
    }
  })
}

/**
 * 新增工艺
 */
 export function addProcess(oData:any) {
  return request({
    url: ELN_PREFIX + '/processSetting/add',
    method: 'post',
    data: oData
  })
}

/**
 * 编辑工艺
 */
 export function editProcess(oData:any) {
  return request({
    url: ELN_PREFIX + '/processSetting/modify',
    method: 'put',
    data: oData
  })
}