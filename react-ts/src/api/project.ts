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

type getUserListByFuzzyKwParams = {
  pageIndex: number,
  pageSize: number,
  departmentId: '',
  keywords: string
}
export function getUserListByFuzzyKw(oParams:getUserListByFuzzyKwParams) {
  return request({
    url: BASE_PREFIX + `/user/list/fuzzy/${oParams.pageIndex}/${oParams.pageSize}`,
    method: 'post',
    data: oParams
  })
}

/**
 * 创建项目
 * @param {Object} oParams 参数
 * @return {Promise}
 */
 export function createProject(oParams: any) {
  return request({
    url: ELN_PREFIX + '/project/add',
    method: 'post',
    data: oParams
  })
}

/**
 * 通过项目id获取项目详情
 * @param {String} sProjectId 项目id
 * @return {Promise}
 */
 export function getProjectDetailById(sProjectId: string) {
  return request({
    url: ELN_PREFIX + `/project/${sProjectId}`,
    method: 'get'
  })
}

/**
 * 高级筛选 当前登录人有权限的实验记录列表
 * */
 export function getExperimentByConditionAndAuthV2(page: {
  pageIndex: number,
  pageSize: number
 }, data:any) {
  return request({
    url: ELN_PREFIX + `/notebook/findExperiment/${page.pageIndex}/${page.pageSize}`,
    method: 'post',
    data
  })
}

/**
 * 通过项目id获取项目成员（以角色为维度）
 * @param {String} sProject 项目id
 * @return {Promise}
 */
 export function getProjectRoleUserListById(sProjectId: string) {
  return request({
    url: ELN_PREFIX + `/project/member/${sProjectId}`,
    method: 'get'
  })
}