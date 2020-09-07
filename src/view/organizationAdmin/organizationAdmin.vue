<template>
  <div>
    <nav-bar></nav-bar>
    <div class="main">
      <div class="mainLeft">
        <tree 
			@newOrganization="newOrganization" 
			@adminOrganization="adminOrganization" 
			:organization="true" 
			@handleOrg="handleOrg"
			@baseOrgPos="baseOrgPos"
			@setBaseData="setBaseData"
			ref="tree"></tree>
      </div>
      <div class="mainRight">
        <el-scrollbar>
            <div class="enroll-manage-main">
                <div class="enroll-manage-container" ref="container">
                    <div class="enroll-manage-container-handle" >
                        <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw" @input="searchInput"></el-input>
                        <div class="btnWrap selectItem">
						  <el-button type="primary"  class="btn" @click="selectAll">查看全部</el-button>
                          <el-button type="primary"  class="btn" @click="newUser">新建用户</el-button>
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
                         <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" >
                             <template slot-scope="scope">
                                 <el-link type="primary" v-if="item.type=='link'" @click="userDetails(scope.$index, scope.row)" v-html="arrFormatter(scope.row[item.name],item.name)"></el-link>
                                 <div v-else-if="item.type=='handle' && scope.row['account'] == 'admin'" align="center">
                                   <el-tooltip content="修改密码" placement="top">
                                      <el-button circle type="primary" icon="el-icon-edit" size="small" @click="changePass(scope.$index, scope.row)"></el-button>
                                   </el-tooltip>
                                 </div>
                                 <div v-else-if="item.type=='handle' && scope.row['account'] !='admin'" align="center">
                                   <el-tooltip content="编辑" placement="top">
                                     <el-button circle type="primary" icon="el-icon-edit"   size="small"  @click="adminMess(scope.$index, scope.row)"></el-button>
                                   </el-tooltip>
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
                    <!-- <el-button type="danger" @click="deleteFileOrDirectory" :disabled="this.asels.length===0">批量删除</el-button> -->
                    <!-- <user-edit ref="userData" @updateMess = "updateMess"></user-edit> -->
                </div>
            </div>
        </el-scrollbar>
      </div>
    </div>
    <dialog-organization ref='organization' @getOrg="getOrg"></dialog-organization>
    <dialog-change-pass ref="changePass" @getUserAdmin="getUserAdmin"></dialog-change-pass>
    <editedit-mess ref="editeditMess" @getUser="getUser"></editedit-mess>
  </div>
</template>

<script>
  import NavBar from '@/components/navBar/navBar.vue'
  import Tree from '@/components/tree/peopleListTree.vue'
  import GuardianMess from '@/components/dialogGuardianMess/dialogGuardianMess.vue'
  import DialogOrganization from '@/components/dialogOrganizationAdmin/organizationAdmin.vue'
  import DialogChangePass from '@/components/dialogOrganizationAdmin/changePass.vue'
  import EditeditMess from '@/components/dialogOrganizationAdmin/editeditMess.vue'
  import {addUser,changeUser,getUserList} from '@/api/api.js'
  import {Throttle} from '@/utils/index.js'
  export default{
    components:{
      NavBar,
      Tree,
      GuardianMess,
      DialogOrganization,
      DialogChangePass,
      EditeditMess
    },
    data(){
      return{
        equipmentSearch:'',
        listLoading:false,
        asels:"",//用来存放选中的值
        inputValue:"",
        page:1,//当前页
        disableda:true,
		count:0,
        pageSize:10,//页数大小
		parameter:'',//模糊搜索
        tableTitle:[
            { title : "账号", name : "account", type:"input",width:"200"},
            { title : "用户名", name : "name", type:"input",width:"200"},
            { title : "所属组织", name : "organizationName", type:"input"},
            { title : "操作", type : "handle",button:[],width:'100'}
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
              value: '1',
              label: '正常'
            },
            {
              value: '0',
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
            value: '0',
            label: '离线'
          },
          {
            value: '2',
            label: '低电量'
          },
        ],
        valueW:"",
        organizationName:'',
		baseData:'',
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
           if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='isEnable')
           return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' :( value == 2 ? '<span style="color:#909399;font-weight:bold">否</span>' : ( value == 3 ? '<span style="color:#67C23A;font-weight:bold">进行中</span>' : ( value == 4 ? '<span style="color:#909399;font-weight:bold">已结束</span>' : '')));
          else if(name=='equState')
           return value == 0 ? '<span style="color:#f79898;font-weight:bold">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">在线</span>' : ( value == 2 ? '<span style="color:#e6a23c;font-weight:bold">低电量</span>' : '' ));
          else
           return value;

      },
	  //模糊搜索
	  searchInput: Throttle(function(e){
		  this.parameter = e
		  this.page = 1
	  	  let param = {
			  parameter:this.parameter,
			  pageSize:this.pageSize,
			  currentPage:this.page
		  }
		  this.getSearchData(param)
	  },1000),
	  //筛选接口
	  getSearchData(param){
		  getUserList(param).then(res=>{
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
	  //当前页
      handleCurrentChange(val){
         this.page = val;
		 let param = {
		 	parameter:this.parameter,
		 	pageSize:this.pageSize,
		 	currentPage:this.page
		 }
		 this.listLoading=true
		 this.getSearchData(param)
      },
	  //页数大小
      handleSizeChange(val){
      	this.pageSize = val
		let param = {
			parameter:this.parameter,
			pageSize:this.pageSize,
			currentPage:this.page
		}
		this.listLoading=true
		this.getSearchData(param)
      },
      getEnrollData(){
          this.listLoading=true
		  this.page = 1
          getUserList().then(res=>{
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
          //this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
		  
      },
      changeResultW(val){
          this.tableData = this.tableAllData.filter(item=>{
              return String(item.equState).indexOf(val) > -1
          })
      },
      changeResult(val){
        this.tableData = this.tableAllData.filter(item=>{
            return String(item.activeState).indexOf(val) > -1
        })
      },
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
	  //新增和修改成功后刷新页面
	  getOrg(){
		this.$refs.tree.getOrgList()
	  },
      getRowKeys(row) {
          return row.account;
      },
      //新建组织
      newOrganization(base,tree){
		if(this.organizationName == ''){
		  this.$refs.organization.newOrganization(base)
		  this.$refs.organization.getOrgTree(tree)
		  // this.$message.error('请选择上级组织!');
		}else{
		  this.$refs.organization.newOrganization(this.organizationName)
		  this.$refs.organization.getOrgTree(tree)
		}
      },
      //编辑组织
      adminOrganization(val){
        if(this.organizationName == ''){
          this.$message.error('请选择组织!');
        }else{
			console.log(this.organizationName)
          this.$refs.organization.editOrganization(this.organizationName)
		  this.$refs.organization.getOrgTree(val)
        }
      },
	  //点击全部
	  selectAll(){
		this.getEnrollData()  
		this.$refs.tree.cancelSelect()
		this.organizationName = ''
	  },
	  //在获取组织树时，将跟组织传递出来
	  baseOrgPos(val){
	  		  this.baseData = val
	  },
	  //新建用户时，如果不选组织，就默认选择跟组织
	  setBaseData(val){
		  this.baseData = val
	  },
      // 新建用户
      newUser(){
        if(this.organizationName == ''){
			this.$message.error('请选择组织!');
        }else{
          this.$refs.editeditMess.newOrganization(this.organizationName)
        }
      },
      //编辑用户
      adminMess(index,item){
        this.$refs.editeditMess.getOrganization(item)
      },
	  //对用户进行操作后，重新请求数据
	  getUser(val){
		  // 1是添加  2是修改
		  if(val == 1){
			  let param = {
				  organizationId:this.organizationName.id
			  }
			  this.getUserListData(param)
		  }else{
			  if(this.organizationName == ''){
				  //说明没有点击组织,查全部
				  this.getEnrollData() //请求全部数据
			  }else{
				  let param = {
				  	organizationId:this.organizationName.id
				  }
				  this.getUserListData(param)
			  }
		  }
		  
	  },
      //修改密码
      changePass(index,item){
		this.$refs.changePass.getUserData(item)
      },
	  //修改密码成功时刷新页面
	  getUserAdmin(){
		  this.getEnrollData()
	  },
	  
      //点击组织
      handleOrg(val){
		  console.log(val)
        this.organizationName = val
		let param = {
			organizationId:val.id
		}
		this.getUserListData(param)
      },
	  //点击组织时请求
	  getUserListData(param){
		  getUserList(param).then(res=>{
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
    },
    mounted() {
	  this.getEnrollData()
    },
	beforeRouteEnter:(to,from,next)=>{
		console.log(to)
		console.log(from)
		next(vm=>{
			// alert("hello");
			let user = JSON.parse(sessionStorage.getItem('user'))
			console.log(user)
			// if(user.account == 'admin'){
			// 			  this.isadmin = true
			// }else{
			// 			  this.isadmin = false
			// }
		})
	},
    computed:{
      tables:function(){
        var search=this.inputValue;
        
        return this.tableData
      }
    },
  }
</script>

<style lang='scss' scoped>
  /deep/.el-table--mini td{
    padding: 0px;
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
      width: calc(100vw - 260px);
      height: calc(100vh - 105px);
      /* box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); */
      box-sizing: border-box;

        .enroll-manage-container{
            box-sizing: border-box;
            padding: 20px;
            /* height: 100%; */
			height: calc(100vh - 105px);
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
                justify-content: space-between;
                align-items: center;
                &-label{
                    font-size: 0.8vw;
                    margin-left: 20px;
                    color: #606266;
                    font-weight: 700;
                    margin-right: 5px;
                }
                /* .seclect{
                  width: 20vw;
                  max-width: 150px;
                } */
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
