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