<template>
  <el-dialog :title="title"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" style="min-width: 1000px;">
    <div class="enroll-manage-container-title">关联用户</div>
    <div class="main">
      <div class="mainleft">
        <tree ref="mytree" @getOrganization="getOrganization" @baseOrgPos="baseOrgPos"></tree>
      </div>
      <div class="shuttle">
        <el-transfer
            v-model="value"
            :titles="['未关联人员', '已关联人员']"
            :button-texts="['删除', '添加']"
            :data="data" filterable class="Transfer" @change="handleChange">
        </el-transfer>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getRailDeploy,getOrgList,getTopOrgList,updateElectronicFence} from '@/api/api.js'
  import Tree from '@/components/tree/relevanseUserTree.vue'
  export default {
    components:{
      Tree
    },
    data(){
      
      return{
        dialogVisible:false,
        title:'',
        data: [],
        value: [0],
		fenceId:'',
		nowOrg:'',//当前点击了那个组织
		baseOrg:'',//跟组织
      }
    },
    methods:{
      //添加删除成员
      handleChange(value, direction, movedKeys) {
		let idArr=movedKeys.join();
		if(direction=="right"){
		    let params={}
		    params.fenceId=this.fenceId
		    params.elderlyId=idArr
		    params.type=1
		    updateElectronicFence(params).then((res)=>{
		    if(res.code=="0"){
		        this.$message({
		        message: '新增成功',
		        type: 'success'
		        });
		    }else{
		        this.$message({
					message: '新增失败',
					type: 'error'
		        });
		    }
		    }).catch(function (error) {
		        console.log(error);
		    });
		}else{
		    let params={}
		    params.fenceId=this.fenceId
		    params.elderlyId=idArr
		    params.type=2
		    updateElectronicFence(params).then((res)=>{
		    if(res.code=="0"){
		        this.$message({
		        message: '删除成功',
		        type: 'success'
		        });
		    }else{
		        this.$message({
		        message: '删除失败',
		        type: 'error'
		        });
		    }
		    }).catch(function (error) {
		        console.log(error);
		    });
		}
      },
      handleClose(){
        this.dialogVisible = false
      },
	  //点击组织时
      getOrganization(val){
		this.nowOrg = val
		this.getRailDeploy()
      },
	  //获取到跟组织
	  baseOrgPos(val){
		  this.baseOrg = val
		  this.getRaiList1()
	  },
	  handleShow(val){
		this.title = val.name
		this.fenceId = val.id
		// console.log("fenceid:"+this.fenceId)
		this.dialogVisible = true
		// this.$refs.mytree.getOrganizationList()
		this.getOrganizationList()
	  },
	  //获取组织列表
	  getOrganizationList(){
		  let user = JSON.parse(sessionStorage.getItem('user'))
		  let userOrgId = user.organizationId
		  let param = {
		  	organizationId:userOrgId
		  }
		  if(user.account == "admin"){
			  getTopOrgList().then((res)=>{
				  console.log(res)
				  if(res.code == 0){
					  this.$refs.mytree.getData(res.data.data)
				  }
			  })
		  }else{
			  getTopOrgList(param).then((res)=>{
				  console.log(res)
				  if(res.code == 0){
					  this.$refs.mytree.getData(res.data.data)
				  }
			  })
		  }
		  
	  },
	  //获取电子围栏关联列表信息
	  getRailDeploy(){
		  let param = {}
		  param.fenceId = this.fenceId
		  param.organizationId = this.nowOrg.id
		  this.data = []
		  this.value = []
		  getRailDeploy(param).then((res)=>{
			  if(res.code == 0){
				  let userList = res.data.electronicFenceNotRelationList
				  let userArr = []
				  let arr = []
				  for(let i=0;i<userList.length;i++){
					  if(userList[i].state != 1){
						  userArr.push({
							  key:userList[i].id,
							  label:userList[i].name,
							  disabled:userList[i].state==1
						  })
					  }else{
						arr.push({
							key:userList[i].id,
							label:userList[i].name,
							disabled:userList[i].state==1
						})
					  }
				  }
				  let myArr = userArr.concat(arr)
				  userArr = myArr
				  
				  let myValue = []
				  let haveUserList = res.data.electronicFenceRelationList
				  for(let i=0;i<haveUserList.length;i++){
					  userArr.push({
						  key:haveUserList[i].id,
						  label:haveUserList[i].name
					  })
					  myValue.push(haveUserList[i].id)
				  }
				  
				  this.data = userArr
				  this.value = myValue
			  }
		  })
	  },
	  //一开始就获取电子围栏列表信息
	  getRaiList1(){
		  let param = {}
		  param.fenceId = this.fenceId
		  param.organizationId = this.baseOrg.id
		   getRailDeploy(param).then((res)=>{
			   if(res.code == 0){
				  let userList = res.data.electronicFenceNotRelationList
				  let userArr = []
				  let arr = []
				  for(let i=0;i<userList.length;i++){
					  if(userList[i].state != 1){
						  userArr.push({
							  key:userList[i].id,
							  label:userList[i].name,
							  disabled:userList[i].state==1
						  })
					  }else{
						  arr.push({
							  key:userList[i].id,
							  label:userList[i].name,
							  disabled:userList[i].state==1
						  })
					  }
				  }
				  let myArr = userArr.concat(arr)
				  userArr = myArr
				  
				  let myValue = []
				  let haveUserList = res.data.electronicFenceRelationList
				  for(let i=0;i<haveUserList.length;i++){
					  userArr.push({
						  key:haveUserList[i].id,
						  label:haveUserList[i].name
					  })
					  myValue.push(haveUserList[i].id)
				  }
				  
				  this.data = userArr
				  this.value = myValue
			   }
		   })
	  }
    },
    mounted() {
		
    }
  }
</script>

<style lang="scss">
  .el-transfer-panel{
	  width: 20vw;
      height:49vh;
  }
  
   .el-transfer-panel__list.is-filterable{
      height: 40vh;
   }
   .el-transfer__buttons{
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       align-items: center;

       .el-button{
           margin: 0;
           margin-bottom: 1vh;
           width: 100px;

       }
   }
   .Transfer{
       display: flex;
       justify-content: space-between;
       align-items: center
   }
  .el-dialog{
    width: 52%;
  }
</style>

<style lang="scss" scoped>

  .enroll-manage-container-title{
    margin-bottom: 20px;
    padding: 2px 0;
    border-left: 4px solid #409EFF;
    text-indent: 20px;
    font-size: 18px;
    font-weight: 700;
  }
  .main{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .mainleft{
      width: 10vw;
      border: 1px solid #ebeef5;
      padding: 10px;
      border-radius: 5px;
      min-height: 280px;
      height: 46.7vh;
      margin-right: 1vw;
    }
    .shuttle{
      width: 35vw;
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
</style>
