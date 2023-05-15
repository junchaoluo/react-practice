import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'

export function getProjectListByPage(oPathParams: any, oParams: any) {
  return request({
      url: ELN_PREFIX + `/project/list/${oPathParams.pageIndex}/${oPathParams.pageSize}`,
      method: 'post',
      params: oParams
  })
}

export function getArchiveProjectListByPage(oPathParams: any, oParams: any) {
  return request({
    url: ELN_PREFIX + `/project/list/archive/${oPathParams.pageIndex}/${oPathParams.pageSize}`,
    method: 'post',
    params: oParams
  })
}

/**
 * 高级筛选 实验记录信息
 * */
type oParams = {
    pageIndex: number,
    pageSize: number,
    code: string,
    productCode: string,
    searchValue?: string,
}

 export function getProjectByAdvanceCondition(page: oParams, data: oParams) {
  return request({
    url: ELN_PREFIX + `/project/findProjectByAdvanceCondition/${page.pageIndex}/${page.pageSize}`,
    method: 'post',
    data
  })
}

  /**
 *
 * @param {Object} page 查询信息
 * @param {Object} data 查询信息
 * @returns {Promise}
 */
export function findProjectByAdvanceConditionArchive(page: oParams, data: oParams) {
  return request({
    url: ELN_PREFIX + `/project/findProjectByAdvanceCondition/archive/${page.pageIndex}/${page.pageSize}`,
    method: 'post',
    data
  })
}

/**
 * ELN基础项目管理   完成并存档项目
 * @param {Array} aParams 参数
 * @return {Promise}
 */
 export function archiveAndProject(aParams: {
  id: string
 }) {
  return request({
    url: ELN_PREFIX + '/project/archive',
    method: 'put',
    data: aParams
  })
}

/**
 * ELN基础项目管理   恢复项目
 * @param {Array} aParams 参数
 * @return {Promise}
 */
 export function renewAndProject(aParams: {
  id: string
 }) {
  return request({
    url: ELN_PREFIX + '/project/renew',
    method: 'put',
    data: aParams
  })
}

/**
 * 获取产品list(新增记录本)
 * @return {Promise}
 */
 export function getProducts(pageNum: number, pageSize: number, pdNo: string) {
  return request({
    url: CHEM_PREFIX + `/v1/product/product/findProductList/${pageNum}/${pageSize}`,
    method: 'get',
    params: {
      pdNo
    }
  })
}

/**
 * 获取项目角色列表
 * @return {Promise}
 */
 export function getProjectRoleList() {
  return request({
    url: BASE_PREFIX + '/role/project/query',
    method: 'get'
  })
}