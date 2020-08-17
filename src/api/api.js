import {getResultful,get,post,put,puts,deleteResultful} from '@/api/https.js'
let base = '';

export const requestLogin = params => { return post(`${base}/login/`, params,{emulateJSON: true}); }//登录
