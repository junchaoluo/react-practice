import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'
import { GetDetectionClassifyItemListParams } from '@/interfaces/sample'

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