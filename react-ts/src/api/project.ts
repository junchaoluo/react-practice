import request from '../request/index'
import { ELN_PREFIX } from './constant'

export function getProjectList(pgaeNum = 1, pageSize = 10, oParams) {
    return request({
        url: ELN_PREFIX + `/project/list/${pgaeNum}/${pageSize}`,
        method: 'post',
        params: oParams
    })
}

export function getArchiveProjectListByPage(oPathParams, oParams) {
    return request({
      url: ELN_PREFIX + `/project/list/archive/${oPathParams.pageIndex}/${oPathParams.pageSize}`,
      method: 'post',
      params: oParams
    })
}