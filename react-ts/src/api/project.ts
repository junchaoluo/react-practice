import request from '../request/index'
import { ELN_PREFIX } from './constant'

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