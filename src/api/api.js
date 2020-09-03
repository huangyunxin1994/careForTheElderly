
import {getResultful,get,post,put,puts,myput,putResultful,deleteR,deleteResultful} from '@/api/https.js'

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
export const newOrg = params => { return post(`${base}/organization/`, params); }//新建组织
export const changeOrg = params => { return puts(`${base}/organization/`, params); }//修改组织
export const deleteOrg = params => { return deleteR(`${base}/organization/`, params); }//删除组织

export const addUser = params => { return post(`${base}/user/`, params); }//添加用户
export const changeUser = params => { return puts(`${base}/user/`, params); }//修改用户
export const getUserList = params => { return get(`${base}/user/user`, params); }//获取用户列表信息
export const deleteUser = params => { return deleteR(`${base}/user/`, params); }//删除组织
export const verifyAccount = params => { return get(`${base}/user/distinct`, params); }//判断账号有没有重复

export const getTopOrgList = params => { return get(`${base}/organization/tree`, params); }//获取组织列表

//人员列表
export const PersonnelStatus = params => { return get(`${base}/PersonnelStatus/`, params); }//获取人员状态列表信息

export const elderlyStatus = params => { return getResultful(`${base}/PersonnelStatus/elderly`, params); }//获取人员与设备信息

export const equipmentAlert = params => { return getResultful(`${base}/PersonnelStatus/equipmentAlert`, params); }//报警列表

export const dealEquipmentAlert = params => { return put(`${base}/PersonnelStatus/equipmentAlert`, params); }//处理预警

export const familymembers = params => { return getResultful(`${base}/PersonnelStatus/familymembers`, params); }//获取人员状态监护人信息

export const locationTracking = params => { return getResultful(`${base}/PersonnelStatus/locationTracking`, params); }//获取重点用户最新的坐标

export const BloodPressure = params => { return getResultful(`${base}/PersonnelStatus/BloodPressure`, params); }//心率血压

export const selectCoordinate = params => { return getResultful(`${base}/PersonnelStatus/selectPersonnelCoordinate`, params); }//轨迹查询

//预警中心
export const getAlertList = params => { return get(`${base}/equipmentAlert/`, params); }//获取预警中心列表信息
export const changeAlert = params => { return myput(`${base}/equipmentAlert/`, params); }//批量修改预警信息
export const getOtherAlertList = params => { return get(`${base}/equipmentAlert/other/`, params); }//获取预警中心列表信息
//设备管理
export const getEquipment = params => { return get(`${base}/equipment/`, params); }//获取设备列表

export const relatvieEquipment = params => { return put(`${base}/equipment/`, params); }//设备关联组织

export const removeEquipment = params => { return deleteR(`${base}/equipment/`, params); }//删除设备

//首页
export const getElderList = params => { return get(`${base}/home/coordinate`, params); }//查询某个组织及其下组织的人信息  ===========

export const getEquipmentAlert = params => { return get(`${base}/equipmentAlert/`, params); }//查询最新预警信息

//看板
export const getBulletinboard = params => { return get(`${base}/home/`, params); }//看板统计

