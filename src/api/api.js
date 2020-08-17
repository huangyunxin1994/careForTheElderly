import {getResultful,get,post,put,puts,deleteResultful} from '@/api/https.js'
let base = '';

export const requestLogin = params => { return get(`${base}/login/`, params); }//登录
