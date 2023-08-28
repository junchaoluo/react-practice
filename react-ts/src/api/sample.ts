import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'
import { SearchFormParams } from '@/views/my-sample/index'
import { GetDetectionClassifyItemListParams } from '@/interfaces/sample'

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

/**
 * 获取实验分类检测配置项
 * @author xiewei
 */
 export function getDetectionClassifyItemList(params: GetDetectionClassifyItemListParams) {
    return request({
      url: ELN_PREFIX + `/elnSampleDetect/sendSample`,
      method: 'GET',
      params
    })
  }