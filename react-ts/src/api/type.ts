import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'

type Page = {
    pageNum: number,
    pageSize: number
}

// 获取分类信息
export function getExperimentClassification(oPathParams: Page, oParams: any) {
    return request({
        url: ELN_PREFIX + `/experiment/sort/page/${oPathParams.pageNum}/${oPathParams.pageSize}`,
        method: 'post',
        params: oParams
    })
}

// 删除分类信息  /experiment/sort/delete
export function deleteExperimentClassification(oParams: any) {
    return request({
      url: ELN_PREFIX + `/experiment/sort/delete`,
      method: 'delete',
      data: oParams
    })
}

// 新增分类信息  /experiment/sort/add
export function addExperimentClassification(oParams: any) {
    return request({
      url: ELN_PREFIX + `/experiment/sort/add`,
      method: 'post',
      data: oParams
    })
}

// 修改分类信息   /experiment/sort/modify
export function reviseExperimentClassification(oParams: any) {
    return request({
      url: ELN_PREFIX + `/experiment/sort/modify`,
      method: 'put',
      data: oParams
    })
}