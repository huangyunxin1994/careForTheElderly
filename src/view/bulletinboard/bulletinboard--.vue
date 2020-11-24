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
          <div id="chartKeyPerson"  class="picItem"></div>
          <br/>
          <div id="chartManPerson"  class="picItem"></div>
          <br/>
          <div id="warnMess"  class="picItem">
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
              <my-map ref="myMap" mapId="mymap" :view="true" :markers="markers"  :dragging="true"  :center="center"></my-map>
            </div>
        </el-col>
        <el-col :span="6">
          <div id="chartPersonActive"  class="picItem"></div>
          <br/>
          <div id="chartMonthWarn"  class="picItem"></div>
          <br/>
          <div id="chartWarnNum"  class="picItem"></div>
        </el-col>

      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import echarts from 'echarts'
  import MyMap from '@/components/map/qqmap.vue'

// 图标
  import normal from '@/icons/png/personn.png'
  import warn from '@/icons/png/personw.png'
  // import home from '@/icons/png/jiating.png'
  import home from '@/icons/png/jia.png'
  import {getBulletinboard,getElderList} from '@/api/api.js'
export default {
  name: 'Login',
  components:{
    MyMap
  },
  data() {
    return {
      loading: false,
      redirect: undefined,
		center:{longitude:116.399,
			latitude:39.910},
			
		
      equipWatch:[],
      equipSleep:[],
      equipActive:[],
	  userArr:[],
	  latelyAlert:'',//近六个月预警
	  latelyNormal:'',//近6个月正常值
	  lateyMonth:'',//近6个月月份
	  monthEarly:'',//当月预警
      alert1:[],alert2:[],alert3:[],alert4:[],alert5:[],alert6:[],alert7:[],
      warnData:[],
      warnDoneData:[],
      warnDoneDataA:[],
      bulletArr:[],
      markers:[],
	  
	  
	  //最多的五个组织
	  orgName:[],
	  orgData:[],
	  
	  //预警数和未处理
	  alertNum:[],
	  noHandle:[],
	  weekData:[],
    }
  },
  mounted(){
	this.getBulletinboardData()
	this.getAllPeople()
  },
  methods: {
    enterSys(){
      this.$router.push({ path: '/home' })
    },
	getBulletinboardData(){
		let myuser = JSON.parse(sessionStorage.getItem('user'))
		this.userArr = []
		getBulletinboard().then((res)=>{
			//最多人数的五个组织
			let orgPeople = res.data.userDistribution
			orgPeople.forEach((item)=>{
				this.orgName.push(item.name)
				this.orgData.push(item.count)
			})
			
			//预警数和未处理数
			let weekAlert = res.data.weekAlert
			let untreatedWeekAlert = res.data.untreatedWeekAlert
			weekAlert.forEach((item)=>{
				this.alertNum.push(item.count)
				this.weekData.push(item.alertWeek)
			})
			untreatedWeekAlert
			for(let i in untreatedWeekAlert){
				this.noHandle[i] = untreatedWeekAlert[i].count
			}
			this.drawChart()
		})
	},
	//获取全部人员图标
	getAllPeople(){
		getElderList().then((res)=>{
			if(res.code==0){
			  if(res.data.data.length>0){
			    res.data.data.forEach(i => {
			      let content =  `<div style='overflow-x: hidden;width: 250px;padding:10px;'>
									<p class='mymap-item'>
									  <span">家庭地址：${i.address&&i.address||'无'}</span>
									<p/>
									<p>联系方式: ${i.sim&&i.sim||'无'}</p>
									<div style='display: flex;justify-content: space-between;align-items: center;'>
										<div>姓名:${i.name}</div>
									    <input class='mymap-button'
									           style='background:rgba(29,164,255,1);
									           color:#fff; border:1px solid rgba(29,164,255,1);
									           border-radius:2px; font-size:14px; padding:5px;'
									           type='button' value='查看详情' id='gotDetail'>
									</div>	
								  </div>`
				  if(i.fenceWarning == 1){
					// 1 正常
					  let para =  {
						id:i.id,
						warning:i.fenceWarning,
						longitude:i.longitude,
						latitude:i.latitude,
						icon:{
						  name:normal,
						  size:[48, 48],
						  anchor:[24, 48]
						},
						type:'1'
					  }
					  this.markers.push(para)
				  }else{
					  // 2 是预警
					  let para =  {
						id:i.id,
						warning:i.fenceWarning,
						longitude:i.longitude,
						latitude:i.latitude,
						icon:{
						  name:warn,
						  size:[48, 48],
						  anchor:[24, 48]
						},
						type:'1'
					  }
					  this.markers.push(para)
				  }
			    });
				this.$refs.myMap.getMap()
			    this.$refs.myMap.showAllPeople(0)
			  }
			}
		})
	},
    drawChart() {
      let chartKeyPerson = echarts.init(document.getElementById('chartKeyPerson'));//用户统计
      let chartManPerson = echarts.init(document.getElementById('chartManPerson'));//老年人数量统计
      let chartPersonActive = echarts.init(document.getElementById('chartPersonActive'));//老人状态统计
      let chartMonthWarn = echarts.init(document.getElementById('chartMonthWarn'));//当月预警分布
      let chartWarnNum = echarts.init(document.getElementById('chartWarnNum'));//近6个月预警处理统计
	  let option = {
		  color: ['#23f39d','#c23531'],
		  tooltip:{trigger: 'axis',},
		  legend: {
		    data:['正常人数','预警人数'],
		  },
		  grid:{
		  	left:'10%',
		  	right:'15%',
		  },
		  xAxis: {
			show:false,
		    type: 'category',
		    boundaryGap: false,
		    interval:4,
		    data: ['周一', '周二', '周二', '周二', '周二', '周二', '周二']
		  },
		  yAxis: {
		      type: 'value',
		  },
		  series: [
			{
		      name:"正常人数",
		      data:[120, 132, 101, 134, 90, 230, 210],
		      type: 'line',
			  smooth: true,
		      itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
		          color: '#E6A23C',
		          borderColor: '#E6A23C',
		      },
			},
			{
			  name:"预警人数",
			  data:[120, 13, 104, 157, 44, 88, 26],
			  type: 'line',
			  smooth: true,
			  itemStyle: {     //此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
			      color: '#E6A23C',
			      borderColor: '#E6A23C',
			  },
			}
		]
	  }
	  chartKeyPerson.setOption(option)
	  let alertOption = {
		  tooltip: {
		          trigger: 'axis',
		          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
		              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		          }
		      },
			  color: ['#c23531','#61a0a8'],
		      legend: {
		          data: ['总预警数', '未处理预警数']
		      },
		      grid: {
		          left: '3%',
		          right: '4%',
		          bottom: '3%',
		          containLabel: true
		      },
		      xAxis: {
				  show:false,//不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
				  type: 'category',
				  data: this.weekData
		      },
		      yAxis: {
		          type: 'value'
		      },
		      series: [
		          {
		              name: '总预警数',
		              type: 'bar',
		              stack: '总量',
		              label: {
		                  show: true,
		                  position: 'insideRight'
		              },
		              data: this.alertNum
		          },
		          {
		              name: '未处理预警数',
		              type: 'bar',
		              stack: '总量',
		              label: {
		                  show: true,
		                  position: 'insideRight'
		              },
		              data: this.noHandle
		          }
		      ]
	  }
      chartManPerson.setOption(alertOption);
	  let options = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			boundaryGap: [0, 0.01]
		},
		yAxis: {
			type: 'category',
			data: this.orgName
		},
		series: [
			{
				type: 'bar',
				data: this.orgData
			}
		]
	  }
      chartPersonActive.setOption(options);
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
              data: ['SOS报警', '围栏预警','心率异常','血压异常','离家异常','低电','离线']
          },
          series: [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['35%', '60%'],
                  data: this.monthEarly,
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
        title: {
                text: '近6个月预警处理统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
				orient: 'vertical',
				right: 'right',
                data: ['已处理', '预警数']
            },
            grid: {	
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
        		type: 'category',
        		data: this.lateyMonth
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            series: [
				{
				    name: '预警数',
				    type: 'bar',
				    data: this.latelyAlert
				}
                // {
                //     name: '已处理',
                //     type: 'bar',
                //     data: [30, 50, 85, 26]
                // }
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
.picItem{
	height:23.5vh;
	background:#fff !important;
	padding:20px;
}
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
