<template>
  <el-container class="login-container">
    <el-header class="bulletin-header" height="100">
      <span>&nbsp;</span>
      <span class="bulletin-title">关爱老人平台</span>
      <el-button @click="enterSys" type="primary">进入系统</el-button>
    </el-header>

    <el-main>
      <div class="em-t">
        <div class="em-t-i">
          <div class="em-t-i-l">
            <span class="em-t-i-name">老人总数统计</span>
            <span class="em-t-i-value">{{data.elderlyCount}}</span>
          </div>
          <div class="em-t-i-m">
            <div id="chartElder"></div>
          </div>
          <div class="em-t-i-r">
            <i class="iconfont icon-laoren em-t-i-icon" style="color:#E6A23C"></i>
          </div>
        </div>
        <div class="em-t-i">
          <div class="em-t-i-l">
            <span class="em-t-i-name">监护人总数统计</span>
            <span class="em-t-i-value">{{data.familyCount}}</span>
          </div>
          <div class="em-t-i-m">
            <div id="chartFamily"></div>
          </div>
          <div class="em-t-i-r">
            <i class="iconfont icon-jianhuren em-t-i-icon" style="color:#409EFF"></i>
          </div>
        </div>
        <div class="em-t-i">
          <div class="em-t-i-l">
            <span class="em-t-i-name">设备在线数统计</span>
            <span
              class="em-t-i-value"
            >{{data.onLineNum}}</span>
          </div>
          <div class="em-t-i-m2">
            <div id="chartOnline"></div>
          </div>
          <div class="em-t-i-r">
            <i class="iconfont icon-shebeizaixian_ em-t-i-icon" style="color:#67C23A"></i>
          </div>
        </div>
        <div class="em-t-i">
          <div class="em-t-i-l">
            <span class="em-t-i-name">设备离线数统计</span>
            <span
              class="em-t-i-value"
            >{{data.offLineNum}}</span>
          </div>
          <div class="em-t-i-m2">
            <div id="chartOffline"></div>
          </div>
          <div class="em-t-i-r">
            <i class="iconfont icon-shebeilixian em-t-i-icon" style="color:#909399"></i>
          </div>
        </div>
      </div>
      <div class="em-b">
        <div class="em-b-l">
          <div class="title">用户分布统计</div>
          <div class="em-b-l-t">
            <my-map
              ref="myMap"
              mapId="mymap"
              :view="true"
              :markers="markers"
              :dragging="true"
              :center="center"
            ></my-map>
          </div>
          <div class="em-b-l-b">
            <div id="chartPersonActive"></div>
          </div>
        </div>
        <div class="em-b-r">
          <div class="em-b-r-t">
            <div class="title">围栏预警数统计及处理情况</div>
            <div class="em-b-r-t-data">
              <div id="chartMonthWarn"></div>
              <div id="chartWarnNum"></div>
            </div>
          </div>
          <div class="em-b-r-b">
            <div class="em-b-r-b-l">
              <div class="title">健康数据</div>
              <div class="em-b-r-b-l-pie">
                <div id="chartKeyPerson"></div>
                <div id="chartManPerson"></div>
              </div>
            </div>
            <div class="em-b-r-b-r">
              <div class="title">预警信息</div>
              <div class="warnMess" ref="warnMess">
                <div :style="{'marginTop':marginTop+'px'}">
                  <div
                    :ref="index==0?'text':''"
                    class="warnMess-content"
                    v-for="(i,index) in data.equipmentAlertList"
                    :key="index"
                    style="white-space:nowrap"
                  >
                    <i class="el-icon-warning warnMess-content-icon"></i>
                    &nbsp;&nbsp;[{{i.alertTime}}]&nbsp;&nbsp; 人员预警：{{i.name}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import echarts from "echarts";
import MyMap from "@/components/map/qqmap.vue";

// 图标
import normal from "@/icons/png/personn.png";
import warn from "@/icons/png/personw.png";
// import home from '@/icons/png/jiating.png'
import home from "@/icons/png/location.png";
import { getBulletinboard, getElderList } from "@/api/api.js";
export default {
  name: "Login",
  components: {
    MyMap,
  },
  data() {
    return {
      data: {},
      markers: [],
      center: {},
      marginTop: 0,
      warnData: [
        { alertTime: "2020-06-18 15:25:01", name: "詹姆斯" },
        { alertTime: "2020-06-18 15:25:02", name: "詹姆斯" },
        { alertTime: "2020-06-18 15:25:03", name: "詹姆斯" },
        { alertTime: "2020-06-18 15:25:04", name: "詹姆斯" },
        { alertTime: "2020-06-18 15:25:05", name: "詹姆斯" },
        { alertTime: "2020-06-18 15:25:06", name: "詹姆斯" },
        { alertTime: "2020-06-18 15:25:07", name: "詹姆斯" }
      ],
      timer: "", // 定时器
      //最多的五个组织
      orgName: [],
      orgData: [],

      //预警数和未处理
      alertNum: [],
      noHandle: [],
      weekData: [],

      //老人,监护人总数
      dataTime:[],
      elderData:[],
      familyData:[],

      //预警人数图表
      alertPerson:[],
      allPerson:[]
    };
  },
  mounted() {
    this.getBulletinboardData();
    // this.getAllPeople();
    console.log()
  },
  created() {},
  methods: {
    enterSys() {
      this.$router.push({ path: "/home" });
    },
    getBulletinboardData() {
      let myuser = JSON.parse(sessionStorage.getItem("user"));
      this.userArr = [];
      getBulletinboard().then((res) => {
        if (res.code == 0) {
          this.data = res.data;
          let orgPeople = res.data.userDistribution;
          
          orgPeople.forEach((item) => {
            this.orgName.unshift(item.name);
            this.orgData.unshift(item.count);
          });

          //预警数和未处理数
          let weekAlert = res.data.weekAlert;
          let untreatedWeekAlert = res.data.untreatedWeekAlert;
          let fenceAlertList = res.data.fenceAlertList
          let fenceElderly = res.data.fenceElderly
          let toWeek =  this.getWeekOfYear()
          console.log(toWeek)
          for(let i = toWeek;i>toWeek-6;i--){
            let ndata = weekAlert.find(item => item.alertWeek == i)
            console.log(ndata)
            if(ndata) {
              this.alertNum.push(ndata.count);
            }else{
              this.alertNum.push(0);
            }
            this.weekData.push("第"+i+"周");
             let wdata = untreatedWeekAlert.find(item => item.alertWeek == i)
              if(wdata) {
              this.noHandle.push(wdata.count);
            }else{
              this.noHandle.push(0);
            }
            let pData = fenceAlertList.find(item =>item[i])
            if(pData) {
              this.alertPerson.push(pData[i]);
            }else{
              this.alertPerson.push(0);
            }
            let pData1 = fenceElderly.find(item =>item[i])
            if(pData1) {
              this.allPerson.push(pData1[i]);
            }else{
              this.allPerson.push(0);
            }
          }
          res.data.elderly.forEach((i,k)=>{
            this.dataTime.push(i.time)
            this.elderData.push(i.count)
          })
          res.data.familyMembers.forEach(j=>{
            this.familyData.push(j.count)
          })
          this.alertNum.reverse();
          this.weekData.reverse();
          this.noHandle.reverse();
          this.alertPerson.reverse();
          this.allPerson.reverse()
          res.data.userDistribution.forEach((i) => {
            let para = {
              id: i.id,
              longitude: i.longitude,
              latitude: i.latitude,
              icon: {
                name:home,
                size: [32, 32],
                anchor: [16, 32],
              },
            };
            this.markers.push(para);
          });
          this.$nextTick((_) => {
            this.drawChart();
            this.$refs.myMap.getMap();
            let height = this.$refs.text[0].clientHeight;
            let pHeight = this.$refs.warnMess.clientHeight;
            let num = Math.ceil(pHeight/height)
            if(this.data.equipmentAlertList.length>=num)
            this.timer = setInterval(this.showNotice, 50); //100表示间隔时间，数字越大滚得越快
          });
        }
      });
    },
    //获取全部人员图标
    getAllPeople() {
      // 2 是预警
      // this.$refs.myMap.showAllPeople(0);
    },
    drawChart() {
      console.log(document.getElementById("chartKeyPerson"));
      let chartKeyPerson = echarts.init(
        document.getElementById("chartKeyPerson")
      ); //用户统计
      let chartManPerson = echarts.init(
        document.getElementById("chartManPerson")
      ); //老年人数量统计
      let chartPersonActive = echarts.init(
        document.getElementById("chartPersonActive")
      ); //老人状态统计
      let chartMonthWarn = echarts.init(
        document.getElementById("chartMonthWarn")
      ); //当月预警分布
      let chartWarnNum = echarts.init(document.getElementById("chartWarnNum")); //近6个月预警处理统计

      let chartElder = echarts.init(document.getElementById("chartElder")); //老人数统计

      let chartFamily = echarts.init(document.getElementById("chartFamily")); //监护人数统计

      let chartOnline = echarts.init(document.getElementById("chartOnline")); //设备在线数统计

      let chartOffline = echarts.init(document.getElementById("chartOffline")); //设备离线数统计
      chartKeyPerson.setOption({
        tooltip: {
          transitionDuration: 0,
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          bottom: "10%",
          data: ["心率异常", "正常数据"],
        },
        series: [
          {
            name: "心率",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
              },
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["#3fc5f0", "#42dee1"];
                  return colorList[params.dataIndex];
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
              show: false,
            },
            data: [
              { value: this.data.heartRateScale[0].count, name: "心率异常" },
              { value: this.data.heartRateScale[1].count, name: "正常数据" },
            ],
          },
        ],
      });
      chartManPerson.setOption({
        tooltip: {
          transitionDuration: 0,
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          bottom: "10%",
          data: ["血压异常", "正常数据"],
        },
        series: [
          {
            name: "血压",
            type: "pie",
            radius: "50%",
            center: ["50%", "40%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
              },
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["#3fc5f0", "#42dee1"];
                  return colorList[params.dataIndex];
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
              show: false,
            },
            data: [
              { value: this.data.pressureScale[0].count, name: "血压异常" },
              { value: this.data.pressureScale[1].count, name: "正常数据" },
            ],
          },
        ],
      });

      let option = {
        color: ["#23f39d", "#c23531"],
        tooltip: {
          transitionDuration: 0,
          trigger: "axis",
          
          // formatter: (params, ticket, callback) => {
          //   return (
          //     "第"+params[0].name+"周<br/>"+
          //     params[1].seriesName +
          //     ":" +
          //     params[1].value +
          //     "<br/>" +
          //     params[0].seriesName +
          //     ":" +
          //     params[0].value
          //   );
          // },
        },
        legend: {
          bottom: "5%",
          data: ["总人数", "预警人数"],
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "category",
          boundaryGap: false,
          interval: 4,
          data: this.weekData,
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#E4E7ED"],
              width: 1,
              type: "dashed",
            },
          },
          axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
        },
        series: [
          {
            name: "总人数",
            data: this.allPerson,
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#3fc5f0",
                borderColor: "#3fc5f0",
              },
            },
          },
          {
            name: "预警人数",
            data: this.alertPerson,
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#28df99",
                borderColor: "#28df99",
              },
            },
          },
        ],
      };
      chartWarnNum.setOption(option);
      let alertOption = {
       
        tooltip: {
           transitionDuration: 0,
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          color: ["#28df99", "#3fc5f0"],
         
        },
        legend: {
          bottom: "5%",
          data: ["总预警数", "未处理预警数"],
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          show: false, //不显示坐标轴线、坐标轴刻度线和坐标轴上的文字
          type: "category",
          data: this.weekData,
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#E4E7ED"],
              width: 1,
              type: "dashed",
            },
          },
           axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
        },
        series: [
          {
            name: "未处理预警数",
            type: "bar",
            stack: "总量",
            data: this.noHandle,
            barWidth: 30, //柱图宽度
            itemStyle: {
              normal: {
                color: "#28df99",
              },
              emphasis: {
                // 普通图表的高亮颜色
                color: "#28df99",
                // 地图区域的高亮颜色
                areaColor: "blue",
              },
            },
          },
          {
            name: "总预警数",
            type: "bar",
            stack: "总量",
            data: this.alertNum,
            barWidth: 30, //柱图宽度
            itemStyle: {
              normal: {
                color: "#3fc5f0",
              },
              emphasis: {
                // 普通图表的高亮颜色
                color: "#3fc5f0",
                // 地图区域的高亮颜色
                areaColor: "blue",
              },
            },
          },
        ],
      };
      chartMonthWarn.setOption(alertOption);
      let options = {
        title: {
          show: false,
        },
        tooltip: {
          transitionDuration: 0,
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{b}: {c} (人)",
        },
        grid: {
          left: "12%",
          right: "10%",
          top: "0%",
          bottom: "10%",
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#E4E7ED"],
              width: 1,
              type: "dashed",
            },
          },
           axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
        },
        yAxis: {
          type: "category",
          data: this.orgName,
         axisLabel: {
            margin: 50,
            align: 'left',
            formatter: function (value, index) {
              console.log()
              let num = Math.floor(value.length/4)
              let str = ""
              if(num>0){
                
                for(let i=0;i<=num;i++){
                   console.log( value.slice(4*i, 4*(i+1)))
                   if(i == num){
                      str+=value.slice(4*i)
                   }else{
                     str+=value.slice(4*i, 4*(i+1))+"\n"
                   }
                }
                console.log(str)
              }else{
                str=value
              }
                return str;
            }
        },
           axisLine: {
            //y轴
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: this.orgData,
            barWidth: 30, //柱图宽度
            itemStyle: {
              normal: {
                color: "#3fc5f0",
              },
            },
          },
        ],
      };
      chartPersonActive.setOption(options);
      chartElder.setOption({
        title: {
          show: false,
        },
        tooltip: {
          transitionDuration: 0,
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{c}人",
        },
        grid: {
          left: "0%",
          top: "0%",
          bottom: "3%",
        },
        xAxis: {
          show:false,
          type: "category",
          data: this.dataTime,
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          show:false,
         type: "value",
        },
        series: [
          {
            type: "bar",
            data: this.elderData,
            barWidth: 5, //柱图宽度
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,       //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                    [
                        {offset: 0, color: '#E6A23C'},
                        {offset: 0.99, color: 'rgb(250, 236, 216)'},
                        {offset: 1, color: 'rgb(253, 246, 236)'}
                    ]                //数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
                )
              },
            },
          },
        ],
      })
      chartFamily.setOption({
        title: {
          show: false,
        },
        tooltip: {
          transitionDuration: 0,
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{c}人",
        },
        grid: {
          left: "0%",
          top: "0%",
          bottom: "3%",
         
        },
        xAxis: {
          show:false,
          type: "category",
          data: this.dataTime,
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          show:false,
         type: "value",
        },
        series: [
          {
            type: "bar",
            data: this.familyData,
            barWidth: 5, //柱图宽度
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,       //4个参数用于配置渐变色的起止位置, 这4个参数依次对应右/下/左/上四个方位. 而0 0 0 1则代表渐变色从正上方开始
                    [
                        {offset: 0, color: '#409EFF'},
                        {offset: 0.99, color: 'rgb(179, 216, 255)'},
                        {offset: 1, color: 'rgb(198, 226, 255)'}
                    ]                //数组, 用于配置颜色的渐变过程. 每一项为一个对象, 包含offset和color两个参数. offset的范围是0 ~ 1, 用于表示位置
                )
              },
            },
          },
        ],
      })
      chartOnline.setOption({
        title: {
text:3,
 textStyle: {
      color: '#01c4a3',
      fontSize: 14
    },
	subtextStyle: {
		color: '#909090',
	},
	itemGap: -10, // 主副标题距离
	left: 'center',
	top: 'center'
},
angleAxis: {
	max: parseInt(this.data.onLineNum+this.data.offLineNum), // 满分
	clockwise: true, // 逆时针
    // 隐藏刻度线
	axisLine: {
		show: false
	},
	axisTick: {
		show: false
	},
	axisLabel: {
		show: false
	},
	splitLine: {
		show: false
	}
},
radiusAxis: {
	type: 'category',
    // 隐藏刻度线
	axisLine: {
		show: false
    },
    axisTick: {
		show: false
    },
    axisLabel: {
		show: false
    },
    splitLine: {
		show: false
    }
  },
polar: {
	center: ['50%', '50%'],
	radius: '100%' //图形大小
},
series: [{
	type: 'bar',
    data: [{
		name: '在线人数',
		value: this.data.onLineNum,
		itemStyle: {
			normal: {
				color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
					offset: 0,
					color: '#aaf14f'
				}, {
					offset: 1,
					color: '#0acfa1'
				}])
			}
		},
    }],
	coordinateSystem: 'polar',
	roundCap: true,
	barWidth: 15,
	barGap: '-100%', // 两环重叠
	z: 2,
},{ // 灰色环
    type: 'bar',
    data: [{
		value: 4,
		itemStyle: {
			color: '#DCDFE6',
			shadowColor: 'rgba(0, 0, 0, 0)',
			shadowBlur: 5,
			shadowOffsetY: 2
		}
    }],
    coordinateSystem: 'polar',
    roundCap: true,
    barWidth: 15,
    barGap: '-100%', // 两环重叠
    z: 1
  }]
      })
      chartOffline.setOption({
        title: {
text:1,
 textStyle: {
      color: '#606266',
      fontSize: 14
    },
	subtextStyle: {
		color: '#909090',
	},
	itemGap: -10, // 主副标题距离
	left: 'center',
	top: 'center'
},
angleAxis: {
	max: 4, // 满分
	clockwise: true, // 逆时针
    // 隐藏刻度线
	axisLine: {
		show: false
	},
	axisTick: {
		show: false
	},
	axisLabel: {
		show: false
	},
	splitLine: {
		show: false
	}
},
radiusAxis: {
	type: 'category',
    // 隐藏刻度线
	axisLine: {
		show: false
    },
    axisTick: {
		show: false
    },
    axisLabel: {
		show: false
    },
    splitLine: {
		show: false
    }
  },
polar: {
	center: ['50%', '50%'],
	radius: '100%' //图形大小
},
series: [{
	type: 'bar',
    data: [{
		name: '离线人数',
		value: this.data.offLineNum,
		itemStyle: {
			normal: {
				color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
					offset: 0,
					color: '#606266'
				}, {
					offset: 1,
					color: '#909399'
				}])
			}
		},
    }],
	coordinateSystem: 'polar',
	roundCap: true,
	barWidth: 15,
	barGap: '-100%', // 两环重叠
	z: 2,
},{ // 灰色环
    type: 'bar',
    data: [{
		value: 4,
		itemStyle: {
			color: '#DCDFE6',
			shadowColor: 'rgba(0, 0, 0, 0)',
			shadowBlur: 5,
			shadowOffsetY: 2
		}
    }],
    coordinateSystem: 'polar',
    roundCap: true,
    barWidth: 15,
    barGap: '-100%', // 两环重叠
    z: 1
  }]
      })
      window.onresize = function () {
        chartKeyPerson.resize();
        chartManPerson.resize();
        chartPersonActive.resize();
        chartMonthWarn.resize();
        chartWarnNum.resize();
        chartElder.resize()
         chartFamily.resize()
          chartOnline.resize()
          chartOffline.resize()
      };
    },

    showNotice() {
      this.marginTop -= 1;
      let height = this.$refs.text[0].clientHeight;
      if (this.marginTop < -height) {
        this.warnData.push(this.warnData[0]);
        this.warnData.shift();
        this.marginTop = 0;
      }
    },
    //计算当前日期为本年的第几周
     getWeekOfYear(){
      var today = new Date();
      console.log(today.getDate())
      var firstDay = new Date(today.getFullYear(),0, 1);
      var dayOfWeek = firstDay.getDay(); 
      console.log(firstDay,dayOfWeek)
      var spendDay= 1;
      if (dayOfWeek !=0) {
        spendDay=7-dayOfWeek+1;
      }
      console.log(spendDay)
      firstDay = new Date(today.getFullYear(),0, 1+spendDay);
      console.log(firstDay)
      var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
      console.log(d)
      var result =Math.ceil(d/7);
      return result+1;
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>

  

<style lang="scss" scoped>
$bg: rgba(85, 85, 85, 0.933333333333333);
$dark_gray: #889aa4;
$light_gray: rgba(51, 51, 51, 1);

.el-header {
  background-color: $bg;
  color: #b3c0d1;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .bulletin-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #fff;
  }
}
.login-container {
  min-width: 1366px;
  min-height: 768px;
  height: 100vh;
  width: 100%;
  background-color: rgb(233, 233, 235);

  .el-main {
    height: calc(100% - 100px);
    padding: 40px;
    .em-t {
      width: 100%;
      height: 15%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
     
      &-i {
        width: calc(25% - 30px);
        height: 100%;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
         align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        position: relative;
        
        &-l {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        &-m {
          width: 30%;
          height: 50%;
          div {
            width: 100%;
            height: 100%;
          }
        }
        &-m2 {
          width: 40%;
          height: 100%;
          div {
            width: 100%;
            height: 100%;
          }
        }
        &-r {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        &-name {
          font-size: 1.8vh;
          color: #909399;
          margin-bottom: 2vh;
        }
        &-value {
          font-size: 3.5vh;
          font-weight: bold;
        }
        &-icon {
          position: relative;
          font-size: 5vh;
          color: #c0c4cc;
        }
      }
    }
    .em-b {
      width: 100%;
      height: 85%;
      padding: 40px 0 0 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      &-l {
        width: 40%;
        height: 100%;

        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        &-t {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          height: calc(50% - 5vh);
        }
        &-b {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          height: 50%;
          div {
            width: 100%;
            height: 100%;
          }
        }
      }
      &-r {
        width: calc(60% - 40px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &-t {
          width: 100%;
          height: 50%;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          &-data {
            width: 100%;
            height: calc(100% - 5vh);
            display: flex;
            justify-content: space-between;
            div {
              width: 50%;
              height: 100%;
            }
          }
        }
        &-b {
          width: 100%;
          height: calc(50% - 40px);
          display: flex;

          justify-content: space-between;
          &-l {
            width: calc(55% - 10px);
            height: 100%;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            &-pie {
              width: 100%;
              height: calc(100% - 5vh);
              display: flex;
              justify-content: space-between;
              align-items: center;
              div {
                width: 50%;
                height: 100%;
              }
            }
          }
          &-r {
            width: calc(45% - 30px);
            height: 100%;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            -moz-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            .el-scrollbar {
              padding-bottom: 0 !important;
            }
            .warnMess {
              width: 100%;
              height: calc(100% - 5vh);
              overflow: hidden;
              .warnMess-content {
                padding: 5px 15px;
                box-sizing: border-box;
                white-space: nowrap;
                font-size: 0.8vw;
                display: flex;
                justify-content: left;
                align-items: center;
                &-icon {
                  color: #ffbe00;
                  font-size: 1.5vw;
                }
              }
            }
          }
        }
      }
      .title {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        height: 5vh;
        line-height: 5vh;
        font-size: 1.5vh;
        border-bottom: 1px solid #e4e7ed;
        font-weight: bold;
        color: #606266;
      }
    }
  }
}
</style>
