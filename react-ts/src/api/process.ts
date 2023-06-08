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