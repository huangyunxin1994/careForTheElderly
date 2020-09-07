<template>
  <div>
    <div class="main">
      <div class="mainRight">
        <el-scrollbar class>
            <div class="enroll-manage-main">
                <div class="enroll-manage-container" ref="container">
                    <div class="enroll-manage-container-handle" >
                        <div class="selectItem">
                            <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw;" @input="searchInput"></el-input>
                        </div>
                        <div class="selectItem">
                            <label for="" class="enroll-manage-container-handle-label">处理状态</label>
                            <el-select v-model="valueW" style="width: 10vw;" filterable placeholder="请选择" @change="changeResult">
                                <el-option
                                v-for="item in activeOptions"
                                :key="item.value"
                                :label="item.label"
                                class="seclect"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="selectItem">
                          <label for="" class="enroll-manage-container-handle-label">预警时间</label>
                          <el-date-picker
                            v-model="time"
                            type="daterange"
                            class="seclectTime"
                            style="width:10vw"
							@change="changeResultW"
							:picker-options="getTimeOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                        </div>
                        <div class="selectItem">
                            <label for="" class="enroll-manage-container-handle-label">预警类型</label>
                            <el-select v-model="valueType" style="width:10vw" filterable placeholder="请选择" @change="changeResultType">
                                <el-option
                                v-for="item in warnType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <el-table
                        :data="tables"
                        border stripe highlight-current-row
                        size="mini" v-loading="listLoading"
                        class="myTable" ref="table"
                        height="calc(100% - 110px)"
                        :row-key="getRowKeys">
                         <el-table-column type="index" width="60" label="序号">
                         </el-table-column>
                         <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth"  show-overflow-tooltip>
                             <template slot-scope="scope">
                                 <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                 <div v-else-if="item.type=='handle'" align="center">
                                   <el-button  type="primary" icon="el-icon-edit" size="small" round @click="changeSMI(scope.$index, scope.row)">修改</el-button>

                                 </div>
                                 <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                             </template>
                         </el-table-column>

                     </el-table>
                     <div class="foot">
                       <div></div>
                       <div class="enroll-check-container-tools">
                           <span class="enroll-check-container-tools-span"></span>
                           <el-pagination
                       						background
                       						layout="total, sizes, prev, pager, next, jumper"
                       						@current-change="handleCurrentChange"
                       						@size-change="handleSizeChange"
                       						:current-page="page"
                       						:page-sizes="[10, 15, 20, 25]"
                       						:page-size="pageSize"
                       						:total="count" >
                            </el-pagination>
                       </div>
                     </div>
                </div>
            </div>
        </el-scrollbar>
      </div>
    </div>
    <dialog-handle-result ref='DialogHandleResult'></dialog-handle-result>
  </div>
</template>

<script>
  import DialogHandleResult from '@/components/dialogHandleResult/dialogHandleResult.vue'
  import {getOtherAlertList} from '@/api/api.js'
  import {parseTime,Throttle} from '@/utils/index.js'
  export default{
    components:{
      DialogHandleResult
    },
    data(){
      return{
        equipmentSearch:'',
        listLoading:false,
        asels:"",//用来存放选中的值
        inputValue:"",
        page:1,//当前页
        sels:[],
        disableda:true,
        pageSize:20,//页数大小
		beginTime:'',//开始时间
		endTime:'',//结束时间
		parameter:'',//模糊搜索
		processingResult:'',//处理结果
		alertType:'',//预警类型
		warnType:'',//用来存放预警类型筛选的值
        time:'',
        tableTitle:[
            { title : "姓名", name : "elderlyName", type:"link",width:"120"},
            { title : "预警类型", name : "alertType", type:"input",width:"150"},
            // { title : "详情", name : "warnDetails", type:"input",minwidth:'150'},
            { title : "所属组织", name : "organizationName", type:"input",minwidth:'150'},
            { title : "预警时间", name : "alertTime", type:"input",width:"150"},
            { title : "处理状态", name : "processingResult", type:"input",width:"100"},
            { title : "处理时间", name : "handleTime", type:"input",width:"150"},
            { title : "处理人", name : "handleUsername", type:"input",width:"150"},
            // { title : "监护人信息",type : "input", name:"guardianMess",button:[],width:'120'},
        ],
        tableData:[],
        tableAllData: [],
        clientHeight:'',
        activeOptions:[
            {
              value: '',
              label: '全部'
            },
            {
              value: '2',
              label: '已处理'
            },
            {
              value: '1',
              label: '未处理'
            }
        ],
        warnType:[
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '低电'
          },
          {
            value: '2',
            label: '离线'
          },
          {
            value: '3',
            label: '电子围栏触发'
          },
          {
            value: '4',
            label: 'SOS'
          },
          {
            value: '5',
            label: '离家异常'
          },
          {
            value: '6',
            label: '心率异常'
          },
          {
            value: '7',
            label: '血压异常'
          }
        ],
        valueW:"",
		valueType:'',
		count:0,
      }
    },
    methods:{
      //性别显示转换
      formatSex: function (row, column) {
		if(column.property=="sex")
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '';
		else
			return row[column.property]
      },
      arrFormatter (value,name) {
          if(name == 'name'){
           return '<span style="color:#409EFF;font-weight:bold">'+value+'</span>';
          }
          else if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='processingResult')
           return value == 2 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">已处理</span>' :( value == 1 ? '<span style="color:#606266;font-weight:bold">未处理</span>' : '');
          else if(name=='alertType')
           return value == 1 ? '<span style="color:#606266;">低电</span>' :( value == 2 ? '<span style="color:#606266;">离线</span>' : ( value == 3 ? '<span style="color:#606266;">电子围栏触发</span>' : ( value == 4 ? '<span style="color:#606266;">SOS</span>' : ( value == 5 ? '<span style="color:#606266;">离家异常</span>' : ( value == 6 ? '<span style="color:#606266;">心率异常</span>' : ( value == 7 ? '<span style="color:#606266;">血压异常</span>' : '' ) ) ) ) ));
          else if(name=='equState')
           return value == 0 ? '<span style="color:#f79898;font-weight:bold">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">在线</span>' : ( value == 2 ? '<span style="color:#e6a23c;font-weight:bold">低电量</span>' : '' ));
          else
           return value;

      },
	  //筛选接口
	  getSearchData(param){
		  this.listLoading=true
		  getOtherAlertList(param).then(res=>{
		  			  console.log(res)
		      if(res.code==0){
		          this.listLoading=false
		          this.tableAllData=res.data.data
		          this.tableData=this.tableAllData
		  				  this.count = res.data.count
		      }else{
		          this.listLoading=false
		         this.$notify({
		              title: '错误',
		              message: res.msg,
		              type: 'error'
		          });
		      }
		  }).catch(err=>{
		      this.listLoading=false
		      this.$notify({
		              title: '错误',
		              message: err.msg,
		              type: 'error'
		          });
		  })
	  },
	  //输入框模糊搜素
	  searchInput:Throttle(function(e){
		  this.page=1
		  let param = {
			  currentPage:this.page,
			  pageSize:this.pageSize,
			  startTime:this.beginTime,
			  endTime:this.endTime,
			  parameter:this.parameter,
			  processingResult:this.processingResult,
			  alertType:this.alertType
		  }
		  this.getSearchData(param)
	  },1000),
	  //当前页
      handleCurrentChange(val){
         this.page = val;
		 this.listLoading=true
		 let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize,
			 startTime:this.beginTime,
			 endTime:this.endTime,
			 parameter:this.parameter,
			 processingResult:this.processingResult,
			 alertType:this.alertType
		 }
		 this.getSearchData(param)
      },
	  //页数大小
      handleSizeChange(val){
      	this.pageSize = val
		this.listLoading=true
		let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize,
			 startTime:this.beginTime,
			 endTime:this.endTime,
			 parameter:this.parameter,
			 processingResult:this.processingResult,
			 alertType:this.alertType
		}
		this.getSearchData(param)
      },
      getEnrollData(){
          this.listLoading=true
		  let user = JSON.parse(sessionStorage.getItem('user'))
		  let param = {}
		  if(user.hasOwnProperty('organizationId')){
			if(user.organizationId == ''){
				param.organizationId = ''
			}else{
				param.organizationId = user.organizationId
			}
		  }else{
		  	param.organizationId = ''
		  }
          getOtherAlertList(param).then(res=>{
              if(res.code==0){
                  this.listLoading=false
                  this.tableAllData=res.data.data
                  this.tableData=this.tableAllData
				  this.count = res.data.count
              }else{
                  this.listLoading=false
                 this.$notify({
                      title: '错误',
                      message: res.msg,
                      type: 'error'
                  });
              }
          }).catch(err=>{
              this.listLoading=false
              this.$notify({
                      title: '错误',
                      message: err.msg,
                      type: 'error'
                  });
          })
      },
      changeResultType(val){
		  this.alertType = val
		  this.listLoading=true
		  this.page=1
		  let param = {
		  	 currentPage:this.page,
		  	 pageSize:this.pageSize,
		  	 startTime:this.beginTime,
		  	 endTime:this.endTime,
		  	 parameter:this.parameter,
		  	 processingResult:this.processingResult,
		  	 alertType:this.alertType
		  }
		  this.getSearchData(param)
      },
      changeResult(val){
        // this.tableData = this.tableAllData.filter(item=>{
        //     return String(item.processingResult).indexOf(val) > -1
        // })
		this.page=1
		this.listLoading=true
		this.processingResult = val
		let param = {
			currentPage:this.page,
			pageSize:this.pageSize,
			startTime:this.beginTime,
			endTime:this.endTime,
			parameter:this.parameter,
			processingResult:this.processingResult,
			alertType:this.alertType
		}
		this.getSearchData(param)
      },
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
      // 批量选中
      selsChange(sels){
          this.sels = sels
      },
      getRowKeys(row) {
          return row.id;
      },
      userDetails(index,row){
		  console.log(row)
        this.$router.push(
        {
            path: '/peopleDetails',
            query: {
              id: row.elderlyId
            }
        })
      },
	  //时间框筛选
	  changeResultW(val){
	      if(val.length == 0){
	       this.beginTime = ""
	       this.endTime = ""
	      }else{
	        this.beginTime = parseTime(val[0],`{y}-{m}-{d}`)+" 00:00:00"
	        this.endTime = parseTime(val[1],`{y}-{m}-{d}`)+" 23:59:59"
	      }
		  this.page=1
		   let param = {
			   currentPage:this.page,
			   pageSize:this.pageSize,
			   startTime:this.beginTime,
			   endTime:this.endTime,
			   parameter:this.parameter,
			   processingResult:this.processingResult,
			   alertType:this.alertType
		   }
		   this.getSearchData(param)
	  },
    },
    mounted() {
      this.getEnrollData()
    },
    computed:{
      tables:function(){
        var search=this.inputValue;
        if(search){
             let arr = []
            this.tableTitle.forEach(e => {
                if(e.name)
                arr.push(e.name)
            });
          return  this.tableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
                    return String(arr).indexOf(key)>-1&&String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      },
	  getTimeOptions(){
	  		 return{
	  			disabledDate:(time)=>{
	  				let disabledDate;
	  				let nowDate = new Date();
	  				nowDate.setDate(nowDate.getDate());
	  				return time.getTime() > nowDate.getTime()
	  			}
	  		 }  
	  }
    },
  }
</script>

<style lang='scss' scoped>
    /deep/.el-table--mini td{
      padding: 0px;
    }
  .main{
    .mainRight{
		height: calc(100vh - 65px);
      padding: 20px 20px 20px 0px;
	  box-sizing: border-box;
      background-color: rgb(244, 244, 245);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

        .enroll-manage-container{
            height: calc(100vh - 105px);
			box-sizing: border-box;
            padding: 20px;
            background: #fff;
            &-title{
                margin-bottom: 20px;
                padding: 2px 0;
                border-left: 4px solid #409EFF;
                text-indent: 20px;
                font-size: 18px;
                font-weight: 700;
            }
            &-handle{
                margin-bottom:20px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                &-label{
                   margin-left: 20px;
                    font-size: 0.8vw;
                    color: #606266;
                    margin-right: 5px;
                    font-weight: 700;
                }
                .selectItem{
                  /* margin-bottom: 20px; */
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                }
                .seclect{
                  width: 20vw;
                  max-width: 150px;
                }
                .seclectTime{
                  width: 20vw;
                  max-width: 300px;
                }
            }
            &-tools{
                display: flex;
                justify-content: space-between;
                align-items: center;
                &-span{
                   font-size: 14px;
                    color: #606266;
                    font-weight: 700;
                }
            }
        }
     }
     .foot{
       margin-top: 20px;
       display: flex;
       justify-content: space-between;
       align-items: center;
     }
  }
</style>
