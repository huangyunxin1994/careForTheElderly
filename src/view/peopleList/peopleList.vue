<template>
  <div class="peopleList">
    <nav-bar></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <tree ref="tree" @handleOrg="handleOrg"></tree>
      </div>
      <div class="mainRight">
                <div class="enroll-manage-container" ref="container">
                    <div class="enroll-manage-container-handle" >
                            <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw"></el-input>
                            <div class="selectItem">
                              <label for="" class="enroll-manage-container-handle-label">活动状态</label>
                              <el-select v-model="activeState"  filterable placeholder="请选择" @change="changeResult" class="seclect"  style="width:10vw">
                                  <el-option
                                  v-for="item in activeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                            </div>
                            <div class="selectItem">
                              <label for="" class="enroll-manage-container-handle-label">设备状态</label>
                              <el-select v-model="equState" filterable placeholder="请选择" @change="changeResultW" class="seclect"  style="width:10vw">
                                  <el-option
                                  v-for="item in equipmentOptions"
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
                         <!-- <el-table-column type="selection" width="55" :reserve-selection="true">
                         </el-table-column> -->
                         <el-table-column type="index" width="60" label="序号">
                         </el-table-column>
                         <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
                             <template slot-scope="scope">
                                 <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                 <div v-else-if="item.type=='handle'">
                                   <el-button  type="primary" icon="el-icon-search" content="查看"  size="small" round @click="handleSearch(scope.$index, scope.row)">监护人</el-button>
                                   <!-- <el-button  type="primary" icon="el-icon-edit" size="small" round @click="stateDetails(scope.$index, scope.row)">状态详情</el-button> -->
                                   <el-button  type="primary" icon="el-icon-search" size="small" round @click="peopleAndEquiment(scope.$index, scope.row)">人员与设备信息</el-button>
                                 </div>
                                 <div v-else-if="item.name=='guardianMess'">

                                 </div>
                                 <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                             </template>
                         </el-table-column>

                     </el-table>
                     <div class="foot">
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
    </div>
    <guardian-mess ref='guardianMess' :fData="fData"></guardian-mess>
    <dialog-people-mess ref='peopleMess' :eData="eData" :phoneNumbers="phoneNumbers"></dialog-people-mess>
  </div>
</template>

<script>
  import NavBar from '@/components/navBar/navBar.vue'
  import Tree from '@/components/tree/tree_.vue'
  import GuardianMess from '@/components/dialogGuardianMess/dialogGuardianMess.vue'
  import DialogPeopleMess from '@/components/dialogPeopleMess/dialogPeopleMess.vue'
  import { PersonnelStatus,familymembers,elderlyStatus, getElderList } from '@/api/api'
  export default {
    components:{
      NavBar,
      Tree,
      GuardianMess,
      DialogPeopleMess
    },
    data(){
      return{
        equipmentSearch:'',
        listLoading:false,
        asels:"",//用来存放选中的值
        inputValue:"",
        page:1,
        disableda:true,
        pageSize:10,
        eData:{},
        phoneNumbers:[],
        fData:[],
        activeState:'',
        equState:'',
		count:0,
		organizationId:'',//组织id
        tableTitle:[
            { title : "姓名", name : "name", type:"link",width:"120"},
            { title : "活动状态", name : "warning", type:"input",width:'120'},
            { title : "设备状态", name : "equipmentState", type:"input",width:'120'},
            { title : "所属组织", name : "organizationName", type:"input",minwidth:'300'},
            { title : "设备编号", name : "code", type:"input",minwidth:'200'},
            // { title : "监护人信息",type : "input", name:"guardianMess",button:[],width:'120'},
            { title : "操作", type : "handle",button:[],width:'255'}
        ],
        tableData:[
         
        ],
        tableAllData: [],
        clientHeight:'',
        activeOptions:[
            {
              value: '',
              label: '全部'
            },
            {
              value: '1',
              label: '正常'
            },
            {
              value: '2',
              label: '预警'
            },
        ],
        equipmentOptions:[
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '在线'
          },
          {
            value: '2',
            label: '离线'
          },
          {
            value: '3',
            label: '预警'
          },
        ],
        valueW:"",
		userId:'',
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
          if(name=='name')
            return '<span style="color:#409EFF;font-weight:bold">'+value+'</span>';
          else if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='warning')
           return value == '1' ? '<span style="color:rgb(112, 182, 3)">正常</span>' :'<span style="color:#e6a23c">异常</span>';
          else if(name=='equipmentState')
           return value == 0 ? '<span style="color:#909399">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3)">在线</span>' : ( value == 2 ? '<span style="color:#e6a23c">低电量</span>' : '' ));
          else
           return value;

      },
  //     handleOrg(val){
      
		// this.organizationId = val.id
  //       getElderList({organizationId:val.id}).then(res=>{
		// 	//首页查询人员具体信息与坐标
  //         if(res.code==0){
  //           console.log(res)
  //           this.tableData = res.data.data
            
  //         }
  //       }).catch(err=>{

  //       })
  //     },
	  handleOrg(val){
	      this.listLoading=true
	  		  let param = {
	  			  organizationId:val.id,
				  userId:this.userId
	  		  }
	  		  this.organizationId = val.id
	      PersonnelStatus(param).then(res=>{
			  //人员列表  获取人员状态列表信息
	  			  console.log(res)
	          if(res.code==0){
	  				  this.listLoading=false
	  				  this.tableData = res.data.list
	  				  this.tableAllData = this.tableData
	          }else{
	              this.listLoading=false
	             this.$notify({
	                  title: '错误',
	                  message: res.msg,
	                  type: 'error'
	              });
	          }
	      }).catch(err=>{
	          
	      })
	      //this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
	  },
      handleCurrentChange(val){
         this.page = val;
		 let param = {
		 	currentPage:this.page,
		 	pageSize:this.pageSize,
		 	organizationId:this.organizationId,
		 	userId:this.userId
		 }
		 PersonnelStatus(param).then(res=>{
		 	// console.log(res)
		   if(res.code==0){
		     this.tableData = res.data.list
		      this.tableAllData = this.tableData
		 	 this.count = res.data.count
		   }
		 }).catch(err=>{
		 
		 })
      },
      handleSizeChange(val){
      	this.pageSize = val
		let param = {
			currentPage:this.page,
			pageSize:this.pageSize,
			organizationId:this.organizationId,
			userId:this.userId
		}
		PersonnelStatus(param).then(res=>{
			// console.log(res)
		  if(res.code==0){
		    this.tableData = res.data.list
		     this.tableAllData = this.tableData
			 this.count = res.data.count
		  }
		}).catch(err=>{
		
		})
      },
      
      changeResultW(val){
          this.tableData = this.tableAllData.filter(item=>{
              return String(item.equipmentState).indexOf(val) > -1
          })
      },
      changeResult(val){
        this.tableData = this.tableAllData.filter(item=>{
            return String(item.warning).indexOf(val) > -1
        })
      },
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
      getRowKeys(row) {
          return row.id;
      },
      //查看监护人信息
      handleSearch(index,val){
         familymembers({eid:val.id}).then(res=>{
        if(res.code == 0){
             this.fData = res.data.list
             this.$refs.guardianMess.dialogVisible = true
			 this.$refs.guardianMess.title = val.name + "的家属信息"
          }
      }).catch(err=>{
          console.log(err)
        })
        
      },
      //人员与设备信息
      peopleAndEquiment(index,val){
		  console.log(index)
		  console.log(val)
        elderlyStatus({eid:val.id}).then(res=>{
		  
          console.log(res)
          if(res.code == 0){
            this.$refs.peopleMess.initData(res.data,val.organizationName)
            //   this.$refs.peopleMess.form = res.data.elderly
            // this.$refs.peopleMess.phoneNumbers = res.data.phoneNumbers
          }
        }).catch(err=>{
          console.log(err)
        })
        // this.$refs.peopleMess.dialogVisible = true
      },
      userDetails(index,row){
		  console.log(row)
        this.$router.push(
        {
            path: '/peopleDetails',
            query: {
              id: row.id
            }
        })
      },
      //将tabledata的值传给tableAllData(到真正对接时就不用)
      getTableAllData(){
       let para = JSON.parse(sessionStorage.getItem('user'))
	   this.userId = para.userId
        PersonnelStatus({userId:para.userId}).then(res=>{
          if(res.code==0){
            this.tableData = res.data.list
             this.tableAllData = this.tableData
			 this.count = res.data.count
          }
        }).catch(err=>{

        })
       
      }
    },
    mounted() {
      this.getTableAllData()
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
  .peopleList{
    background-color: rgb(244, 244, 245);
  }
  .main{
    display: flex;
    align-items: flex-start;
    padding: 20px;
    background-color: rgb(244, 244, 245);
    .mainLeft{
      width: 200px;
      min-width: 200px;
      height: calc(100vh - 105px);
      /* box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); */
      box-sizing: border-box;
      background-color: #fff;
      padding: 19px 0.5vw 0.5vw;
      margin-right: 20px;
      overflow: hidden;

      .dashboard-scrollbar{
        height: 85vh;
      }
    }
    .mainRight{
      height: calc(100vh - 105px);
      width: calc(100vw - 260px);
      /* box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); */
      box-sizing: border-box;

        .enroll-manage-container{
            box-sizing: border-box;
            padding: 20px;
            height: 100%;
            background: #fff;
            &-handle{
                display: flex;
                margin-bottom: 20px;
                justify-content: flex-start;
                align-items: center;
                &-label{
                  margin-left: 20px;
                    font-size: 0.8vw;
                    color: #606266;
                    font-weight: 700;
                    margin-right: 5px;
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
     .foot{
       margin-top: 20px;
       display: flex;
       justify-content: flex-end;
       align-items: center;
     }
  }
</style>
