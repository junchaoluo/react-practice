import request  from "../request"
import {ELN_PREFIX} from './constant'

export function login(data:any) {
    return request({
      url: '/base/account/login',
      method: 'post',
      data: data
    })
  }