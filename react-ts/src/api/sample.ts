import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'
import { SearchFormParams } from '@/views/my-sample/index'

type MySampleParams = {
    pageNum: number,
    pageSize: number,
    data: any
}
// 获取我的送样数据列表
export function getMySampleData(pageNum: number, pageSize: number, data: SearchFormParams) {
    return request({
      url: `${ELN_PREFIX}/elnSamplesSend/meList?pageNum=${pageNum}&pageSize=${pageSize}`,
      method: 'POST',
      data
    })
  }

// 获取样品池list、
export function getAnalyzeList(data: any) {
    return request({
        url: ELN_PREFIX + '/elnSamplesSend/analyzeList',
        method: 'POST',
        data
    })
}