<template>
   <div>
     <div class="main">
       <div class="mainRight">
         <el-scrollbar class="sroll">
             <div class="enroll-manage-main">
                 <div class="enroll-manage-container" ref="container">
                     <div class="enroll-manage-container-handle" >
                            <div class="handleItem">
                              <el-input v-model="inputValue" placeholder="请输入要搜索内容" class="select" style="width: 20vw;" ></el-input>
                              <div class="selectItem">
                                <label for="" class="enroll-manage-container-handle-label">处理状态</label>
                                <el-select v-model="valueW" style="width:10vw" filterable placeholder="请选择" @change="changeResult">
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
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                                </el-date-picker>
                              </div>
                            </div>
                            <div class="handleItem">
                              <el-button class="btn"  type="primary" @click="handleSearch" :disabled="this.sels.length===0">忽略</el-button>
                              <el-button class="btn"  type="primary" @click="peopleAndEquiment" :disabled="this.sels.length===0">填写处理结果</el-button>
                            </div>
                     </div>
                     <el-table
                         :data="tables"
                         border stripe highlight-current-row
                         size="mini" v-loading="listLoading"
                         @selection-change="selsChange"
                         class="myTable" ref="table"
                         height="calc(100% - 110px)"
                         :row-key="getRowKeys">
                          <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectTable">
                          </el-table-column>
                          <el-table-column type="index" width="60" label="序号">
                          </el-table-column>
                          <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false" show-overflow-tooltip>
                              <template slot-scope="scope">
                                  <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                  <div v-else-if="item.type=='handle' &&scope.row['processingResult'] ==2" align="center">
                                    <!-- <el-button  type="primary" content="查看"  size="small" round @click="handleSearch(scope.$index, scope.row)">忽略</el-button> -->
                                    <el-button   type="primary" icon="el-icon-search" size="small" round @click="findHandleResult(scope.$index, scope.row)">处理结果</el-button>
                                  </div>
                                  <div v-else-if="item.name=='guardianMess'">

                                  </div>
                                  <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                              </template>
                          </el-table-column>


                      </el-table>
                      <div class="foot">
                        <!-- <el-button type="danger"  :disabled="this.asels.length===0">批量删除</el-button> -->
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
                     <!-- <el-button type="danger" @click="deleteFileOrDirectory" :disabled="this.asels.length===0">批量删除</el-button> -->
                     <!-- <user-edit ref="userData" @updateMess = "updateMess"></user-edit> -->
                 </div>
             </div>
         </el-scrollbar>
       </div>
     </div>
     <dialog-handle-result ref='DialogHandleResult' @getData="getData"></dialog-handle-result>
     <find-handle-result ref='FindHandleResult'></find-handle-result>
   </div>
 </template>

 <script>
   import DialogHandleResult from '@/components/dialogHandleResult/dialogHandleResult.vue'
   import FindHandleResult from '@/components/dialogHandleResult/findHandleResult.vue'
   import {parseTime} from '@/utils/index.js'
   import {getAlertList,changeAlert} from '@/api/api.js'
   export default{
     components:{
       DialogHandleResult,
       FindHandleResult
     },
     data(){
       return{
         equipmentSearch:'',
         listLoading:false,
         sels:[],
         asels:"",//用来存放选中的值
         inputValue:"",
         page:1,//当前页
         disableda:true,
         pageSize:10,//页数大小
         time:'',//筛选时间
		 name:'',//模糊搜索
         tableTitle:[
             { title : "姓名", name : "elderlyName", type:"link",width:"120"},
             { title : "预警类型", name : "alertType", type:"input",width:'150'},
             { title : "围栏名称", name : "fenceName", type:"input",minwidth:'120'},
             { title : "所属组织", name : "organizationName", type:"input",minwidth:'120'},
             { title : "预警时间", name : "alertTime", type:"input",width:'120'},
             { title : "处理状态", name : "processingResult", type:"input",width:'120'},
             { title : "处理结果", type : "handle",button:[],width:'170'}
         ],
         tableData:[],
         tableAllData: [],
         clientHeight:'',
		 count:0,
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
         valueW:"",
         beginTime:'',
         endTime:'',
       }
     },
     methods:{
       //性别显示转换
       formatSex: function (row, column) {
                 //console.log(column.property)
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
		   else if(name=='alertType')
		    return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">已处理</span>' :( value == 2 ? '<span style="color:#f79898;font-weight:bold">未处理</span>' : ( value == 3 ? '<span style="color:#f79898;font-weight:bold">外出围栏</span>' : '' ));
           else if(name=='processingResult')
            return value == 2 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">已处理</span>' :( value == 3 ? '<span style="color:#f79898;font-weight:bold">已处理</span>' : ( value == 1 ? '<span style="color:#909399;font-weight:bold">未处理</span>' : '' ));
           else
            return value;

       },
	   //当前页
       handleCurrentChange(val){
          this.page = val;
		  let param = {
		  	 currentPage:this.page,
		  	 pageSize:this.pageSize
		  }
		  this.listLoading=true
		  getAlertList(param).then(res=>{
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
	   //页数大小
       handleSizeChange(val){
       	this.pageSize = val
		let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize
		}
		this.listLoading=true
		getAlertList(param).then(res=>{
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
	   //获取到围栏预警数据
       getEnrollData(){
           this.listLoading=true
           getAlertList().then(res=>{
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
	   //通过时间筛选数据
       changeResultW(val){
           if(val.length == 0){
            this.beginTime = ""
            this.endTime = ""
           }else{
             this.beginTime = parseTime(val[0],`{y}-{m}-{d}`)+" 00:00:00"
             this.endTime = parseTime(val[1],`{y}-{m}-{d}`)+" 23:59:59"
           }
		   let param = {
			   startTime:this.beginTime,
			   endTime:this.endTime
		   }
		   getAlertList(param).then(res=>{
		       if(res.code==0){
		           this.listLoading=false
		           this.tableAllData=res.data.data
		           this.tableData=this.tableAllData
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
	   //通过处理状态来筛选数据
       changeResult(val){
         // this.tableData = this.tableAllData.filter(item=>{
         //     return String(item.processingResult).indexOf(val) > -1
         // })
		 let param = {
		   processingResult:val
		 }
		 getAlertList(param).then(res=>{
			 console.log(res)
		     if(res.code==0){
		         this.listLoading=false
		         this.tableAllData=res.data.data
		         this.tableData=this.tableAllData
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
       // 更新页面
       updateMess(val){
       	this.getEnrollData()
       },
	   getData(){
		   this.getEnrollData()
	   },
       // 批量选中
       selsChange(sels){
           this.sels = sels
       },
	   //判断是否可以点击
	   selectTable(row,index){
	     if(row.processingResult == 2){
	       //可用，不可点击，需禁用
	       return false
	     }else{
	       return true
	     }
	   },
       getRowKeys(row) {
           return row.id;
       },
       //忽略
       handleSearch(index,val){
		 let user = JSON.parse(sessionStorage.getItem('user'))
		 let time = parseTime(new Date(),`{y}-{m}-{d} {h}:{i}:{s}`)
		 let arr = this.sels
		 let array = []
		 for(let i in arr){
			 let obj = {}
			 obj.processingResult = 2
			 obj.id = arr[i].id
			 obj.handleRecord = "本条预警已被忽略!"
			 obj.handleUsername = user.name
			 obj.handleUserid = user.userId
			 obj.handleTime = time
			 array.push(obj)
		 }
         this.$confirm('是否忽略预警?', '提示', {
                   confirmButtonText: '确定',
                   cancelButtonText: '取消',
                   type: 'warning'
                 }).then(() => {
					 changeAlert(array).then((res)=>{
						 console.log(res)
						 if(res.code == 0){
						 	this.$message({
						 	  message: '忽略成功',
						 	  type: 'success'
						 	});
						 	this.getEnrollData()
						 }else{
						 	this.$message.error('忽略失败');
						 }
					 })
                 }).catch(() => {
                   this.$message({
                     type: 'info',
                     message: '已取消忽略'
                   });
                 });
       },
       //填写处理结果
       peopleAndEquiment(index,val){
         this.$refs.DialogHandleResult.getData(this.sels)
       },
       //查看处理结果
       findHandleResult(index,val){
         this.$refs.FindHandleResult.getData(val)
       },
       userDetails(index,row){
         this.$router.push(
         {
             path: '/peopleDetails',
             query: {
               id: row.elderlyId
             }
         })
       },
       //将tabledata的值传给tableAllData(到真正对接时就不用)
       getTableAllData(){
         this.tableAllData = this.tableData
       },
     },
     mounted() {
       // this.getTableAllData()
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
       }
     },
   }
 </script>

 <style lang='scss' scoped>
    /deep/.el-table--mini td{
      padding: 0px;
    }
    /deep/.el-button{
      font-style: 0.8vw !important;
      padding: 12px 1.4vw;
    }
   .main{
	  height: calc(100vh - 65px);
     .mainRight{
		height: 100%;
        padding: 20px 20px 20px 0px;
		box-sizing: border-box;
        background-color: rgb(244, 244, 245);
        /* box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); */

         .enroll-manage-container{
			 height: calc(100vh - 105px);
             padding: 20px;
             box-sizing: border-box;
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
                 display: flex;
                 justify-content: space-between;
                 margin-bottom: 20px;
                 align-items: center;
                 .handleItem{
                   display: flex;
                   justify-content: flex-start;
                   align-items: center;
                 }
                 &-label{
                   margin-left: 20px;
                     font-size: 0.8vw;
                     color: #606266;
                     font-weight: 700;
                     margin-right: 5px;
                 }
                 .seclectTime{
                   width: 20vw;
                   max-width: 300px;
                 }
                 .selectItem{
                   display: flex;
                   align-items: center;
                   justify-content: flex-start;
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
      .sroll{
        /* box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); */
      }
      .foot{
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
   }
 </style>
