import {getResultful,get,post,put,puts,putResultful,deleteResultful} from '@/api/https.js'
let base = '';

export const requestLogin = params => { return get(`${base}/login/`, params); }//登录

//电子围栏
export const getRailList = params => { return get(`${base}/ElectronicFence/Fence`, params); }//获取电子围栏列表信息
export const addRailDeploy = params => { return post(`${base}/ElectronicFence/Fence`, params); }//添加电子围栏
export const updateRailDeploy = params => { return put(`${base}/ElectronicFence/Fence`, params); }//修改电子围栏
export const deleteRailDeploy = params => { return deleteResultful(`${base}/ElectronicFence`, params); }//删除电子围栏
export const getRailDeploy = params => { return getResultful(`${base}/ElectronicFence/Fence`, params); }//获取电子围栏关联列表信息
export const updateElectronicFence = params => { return puts(`${base}/ElectronicFence/ElectronicFenceRelationElderly`, params); }//关联电子围栏

//组织管理
export const getOrgList = params => { return get(`${base}/organization/`, params); }//获取组织列表信息

//人员列表
export const PersonnelStatus = params => { return get(`${base}/PersonnelStatus/`, params); }//获取人员状态列表信息

export const elderlyStatus = params => { return getResultful(`${base}/PersonnelStatus/elderly`, params); }//获取人员与设备信息

export const equipmentAlert = params => { return getResultful(`${base}/PersonnelStatus/equipmentAlert`, params); }//报警列表

export const dealEquipmentAlert = params => { return put(`${base}/PersonnelStatus/equipmentAlert`, params); }//处理预警

export const familymembers = params => { return getResultful(`${base}/PersonnelStatus/familymembers`, params); }//获取人员状态监护人信息

export const locationTracking = params => { return getResultful(`${base}/PersonnelStatus/locationTracking`, params); }//获取重点用户最新的坐标

export const BloodPressure = params => { return getResultful(`${base}/PersonnelStatus/BloodPressure`, params); }//心率血压
