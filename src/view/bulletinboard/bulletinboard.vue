<template>
  <el-container class="login-container">
    <el-header class="bulletin-header" height="100">
      <span>&nbsp;</span>
      <span class="bulletin-title">关爱老人平台</span>
      <el-button @click="enterSys" type="primary">进入系统</el-button>
    </el-header>

    <el-main>
      <el-row :gutter="20">

        <el-col :span="6">
          <div id="chartKeyPerson" style="height:23.5vh;background:#fff;padding:20px;"></div>
          <br/>
          <div id="chartManPerson" style="height:23.5vh;background:#fff;padding:20px;"></div>
          <br/>
          <div id="warnMess" style="height:23.5vh;background:#fff;padding:20px;">
            <div class="warnMess-title">预警信息</div>
            <el-scrollbar style="width:100%;height:95%;">
              <div class="warnMess-content" v-for="(i,index) in warnData" :key="index" style="white-space:nowrap">
                <i class="el-icon-warning warnMess-content-icon"></i>&nbsp;&nbsp;[{{i.alertTime}}]&nbsp;&nbsp; 人员预警：{{i.name}}
              </div>
            </el-scrollbar>
          </div>
        </el-col>

        <el-col :span="12">
            <div style="width:100%;height:87vh;">
              <my-map ref="mymap" :markers="markers"></my-map>
            </div>
        </el-col>
        <el-col :span="6">
          <div id="chartPersonActive" style="height:23.5vh;background:#fff;padding:20px;"></div>
          <br/>
          <div id="chartMonthWarn" style="height:23.5vh;background:#fff;padding:20px;"></div>
          <br/>
          <div id="chartWarnNum" style="height:23.5vh;background:#fff;padding:20px;"></div>
        </el-col>

      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import MyMap from '@/components/map/map.vue'

// 图标
  import startMarker from '@/icons/png/startMarker.png'
  import endMarker from '@/icons/png/endMarker.png'
  import normal from '@/icons/png/personn.png'
  import warn from '@/icons/png/personw.png'
  // import home from '@/icons/png/jiating.png'
  import home from '@/icons/png/jia.png'
export default {
  name: 'Login',
  components:{
    MyMap
  },
  data() {
    return {
      loading: false,
      redirect: undefined,

      equipWatch:[],
      equipSleep:[],
      equipActive:[],
      alert1:[],alert2:[],alert3:[],alert4:[],alert5:[],alert6:[],alert7:[],
      warnData:[
        {
          alertTime:'2020-06-02 13:00:00',
          name:'张三',
        },
        {
          alertTime:'2020-06-02 13:00:00',
          name:'张三',
        },
        {
          alertTime:'2020-06-02 13:00:00',
          name:'张三',
        },
        {
          alertTime:'2020-06-02 13:00:00',
          name:'张三',
        },
        {
          alertTime:'2020-06-02 13:00:00',
          name:'张三',
        },
        {
          alertTime:'2020-06-02 13:00:00',
          name:'张三',
        }
      ],
      warnDoneData:[],
      warnDoneDataA:[],
      bulletArr:[],
      markers:[
        {
          longitude:"115.304",
          latitude:"39.945",
          icon:{
            name:normal,
            size:[62, 48],
            anchor:[24, 40]
          },
          type:'0'
        },
        {
          longitude:"116.300",
          latitude:"39.955",
          icon:{
            name:normal,
            size:[62, 48],
            anchor:[24, 40]
          },
          type:'0'
        },
        {
          longitude:"116.310",
          latitude:"39.90",
          icon:{
            name:warn,
            size:[62, 48],
            anchor:[24, 40]
          },
          type:'1'
        },
        {
          longitude:"116.360",
          latitude:"39.922",
          icon:{
            name:warn,
            size:[62, 48],
            anchor:[24, 40]
          },
          type:'1'
        }
      ]
    }
  },
  mounted(){
    // this.getDrawData()
    // this.getOrganData()
    this.drawChart()
  },
  methods: {
    enterSys(){
      this.$router.push({ path: '/home' })
    },

    drawChart() {
      let chartKeyPerson = echarts.init(document.getElementById('chartKeyPerson'));//用户统计
      let chartManPerson = echarts.init(document.getElementById('chartManPerson'));//老年人数量统计
      let chartPersonActive = echarts.init(document.getElementById('chartPersonActive'));
      let chartMonthWarn = echarts.init(document.getElementById('chartMonthWarn'));
      let chartWarnNum = echarts.init(document.getElementById('chartWarnNum'));
      chartKeyPerson.setOption({
              title: {
                 text: '用户统计',
                 // subtext: '纯属虚构',
                 left: 'left'
             },
             tooltip: {
                 trigger: 'item',
                 formatter: '{a} <br/>{b} : {c} ({d}%)'
             },
             legend: {
                 orient: 'vertical',
                 right: 'right',
                 data: ['监护人', '老年人']
             },
             series: [
                 {
                     name: '访问来源',
                     type: 'pie',
                     radius: '55%',
                     center: ['35%', '60%'],
                     data: [
                         {value: 335, name: '监护人'},
                         {value: 310, name: '老年人'},
                     ],
                     emphasis: {
                         itemStyle: {
                             shadowBlur: 10,
                             shadowOffsetX: 0,
                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                         }
                     }
                 }
             ]
      });
      chartManPerson.setOption({
              title: {
                  text: '老年人数量统计',
                  left: 'left'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                  orient: 'vertical',
                  right: 'right',
                  data: ['组织1', '组织2','组织3','组织4','组织5']
              },
              series: [
                  {
                      name: '访问来源',
                      type: 'pie',
                      radius: '55%',
                      center: ['35%', '60%'],
                      data: [
                          {value: 335, name: '组织1'},
                          {value: 310, name: '组织2'},
                          {value: 220, name: '组织3'},
                          {value: 554, name: '组织4'},
                          {value: 313, name: '组织5'},
                      ],
                      emphasis: {
                          itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                      }
                  }
              ]
          });
      chartPersonActive.setOption({
        legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '异常', '正常'],
                    ['Jan', 43.3, 85.8],
                    ['Feb', 83.1, 73.4],
                    ['Mar', 86.4, 65.2],
                    ['Apr', 72.4, 53.9],
                    ['May', 72.4, 56],
                    ['Jun', 24, 88],
                    ['Jul', 89, 36],
                    ['Aug', 52.4, 23.9],
                    ['Sep', 55, 99],
                    ['Oct', 42, 46],
                    ['Nov', 99, 23],
                    ['Dec', 65, 69],
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'}
            ]
      });
      chartMonthWarn.setOption({
          title: {
              text: '当月预警分布类型',
              left: 'left'
          },
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
              orient: 'vertical',
              right: 'right',
              data: ['SOS报警', '围栏预警','心率异常','血压异常','离家异常']
          },
          series: [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['35%', '60%'],
                  data: [
                      {value: 335, name: 'SOS报警'},
                      {value: 100, name: '围栏预警'},
                      {value: 220, name: '心率异常'},
                      {value: 900, name: '血压异常'},
                      {value: 313, name: '离家异常'},
                  ],
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      })
      chartWarnNum.setOption({
        legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '预警数', '已处理'],
                    ['一月', 43.3, 85.8],
                    ['二月', 83.1, 73.4],
                    ['三月', 86.4, 65.2],
                    ['四月', 72.4, 53.9],
                    ['五月', 72.4, 56],
                    ['六月', 24, 88],
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'}
            ]
      })
      window.onresize =function(){
        chartKeyPerson.resize()
        chartManPerson.resize()
        chartPersonActive.resize()
        chartMonthWarn.resize()
        chartWarnNum.resize()

      }
    }
  }
}
</script>



<style lang="scss" scoped>
$bg:rgba(85, 85, 85, 0.933333333333333);
$dark_gray:#889aa4;
$light_gray:rgba(51, 51, 51, 1);
.el-header {
    background-color: $bg;
    color: #B3C0D1;
    padding:20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .bulletin-title{
      font-size: 1.5em;
      font-weight: bold;
      color: #fff;
    }
  }
.login-container {
  height: 100%;
  width: 100%;
  background-color: $light_gray;


  .el-main {
    height: calc(100% - 100px);

    .el-row {
    height: 100%;
      .el-col {
      height: 100%;
      .warnMess-title{
        font-size: 16px;
        font-weight: bold;
        margin-bottom:10px
      }
      .warnMess-content{
        white-space: nowrap;
        margin: 5px;
        font-size: 0.8vw;
        display: flex;
        justify-content: left;
        align-items: center;
        &-icon{
          color:#FFBE00;
          font-size: 1.5vw;
        }
      }
      }

    }
    .unusual-box{
      width: 100%;
      height: 250px;
      padding:20px;
      background: #fff;
      .unusual-census{
      display:flex;
      justify-content: space-between;
      align-items: center;
      &-item{
       width: 45%;
        padding:10px 0;
          border:1px solid #909399;
          border-radius: 4px;
          display:flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
      }
    }
    }

  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
