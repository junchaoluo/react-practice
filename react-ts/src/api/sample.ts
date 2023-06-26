import request from '@/request/index'
import { ELN_PREFIX, CHEM_PREFIX, BASE_PREFIX } from './constant'

// 获取样品池list、
export function getAnalyzeList(data: any) {
    return request({
        url: ELN_PREFIX + '/elnSamplesSend/analyzeList',
        method: 'POST',
        data
    })
}