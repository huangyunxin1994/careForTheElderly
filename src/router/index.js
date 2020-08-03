import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
const Login = () => import('@/view/login/login')//登录页
const Home = () => import('@/view/index/index')//首页
const PeopleList = () => import('@/view/peopleList/peopleList')//人员列表
const PeopleDetails = () => import('@/view/peopleList/peopleDetails/peopleDetails')//人员详情

const WarnCenter = () => import('@/view/warnCenter/warnCenter')//预警中心
const FenceWarn = () => import('@/view/warnCenter/fenceWarn/fenceWarn')//围栏预警信息
const OtherData = () => import('@/view/warnCenter/otherData/otherData')//其他重点数据

const RailDeploy = () => import('@/view/railDeploy/railDeploy')//电子围栏配置
const OrganizationAdmin = () => import('@/view/organizationAdmin/organizationAdmin')//组织管理
const Equipment = () => import('@/view/equipment/equipment')//设备管理
const Bulletinboard = () => import('@/view/bulletinboard/bulletinboard')//看板

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/peopleList',
    name: 'PeopleList',
    component: PeopleList
  },
  {
    path:'/peopleDetails',
    name:'PeopleDetails',
    component:PeopleDetails
  },
  {
    path:'/warnCenter',
    name:'WarnCenter',
    component:WarnCenter,
    redirect:'/warnCenter/fenceWarn',
    children:[
      {
        path:'/warnCenter/fenceWarn',
        name:'fenceWarn',
        component:FenceWarn
      },
      {
        path:'/warnCenter/otherData',
        name:'otherData',
        component:OtherData
      }
    ]
  },
  {
    path:'/railDeploy',
    name:'RailDeploy',
    component:RailDeploy
  },
  {
    path:'/organizationAdmin',
    name:'OrganizationAdmin',
    component:OrganizationAdmin
  },
  {
    path:'/equipment',
    name:'Equipment',
    component:Equipment
  },
  {
    path:'/bulletinboard',
    name:'Bulletinboard',
    component:Bulletinboard
  }
]

export default new Router({
  routes: routes
})
