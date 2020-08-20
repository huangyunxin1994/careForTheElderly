<template>
  <el-dialog title="用户管理"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">

      <el-form  :model="ruleForm2" :rules="rules2" ref="ruleForm2"  label-width="140px">
      	<el-form-item label="账号" prop="account" required>
      	    <el-input v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号"></el-input>
      	</el-form-item>
      	<el-form-item label="密码" prop="password" required>
      	    <el-input v-model="ruleForm2.password" auto-complete="off" show-password placeholder="请输入密码" ></el-input>
      	</el-form-item>
      	<el-form-item label="所属组织" prop="superiorOrganization" required>
			<el-input v-model="ruleForm2.superiorOrganization" disabled placeholder="请输入单位名称" ></el-input>
      	  </el-form-item>
        <el-form-item label="姓名" prop="username" >
            <el-input v-model="ruleForm2.username" placeholder="请输入单位名称" ></el-input>
        </el-form-item>
      	<el-form-item label="联系号码" prop="phone" >
      	    <el-input v-model="ruleForm2.phone" placeholder="请输入联系号码" ></el-input>
      	</el-form-item>
      </el-form>
    <div class="btnWrap">
      <el-button type="primary"  class="btn" @click="cancelBtn">取消</el-button>
      <el-button type="primary"  class="btn" @click="sureBtn">确定</el-button>
      <el-button type="primary" v-if="removeBtn"  class="btn" @click="removeBtn">删除</el-button>
    </div>
  </el-dialog>
</template>

<script>
	import {addUser,changeUser,getUserList,verifyAccount} from '@/api/api.js'
  export default{
    data(){
      var validateAccount =(rule, value, callback) => {
      	if(value ===''){
      		callback(new Error('请输入账号'));
      	}else if(value != this.account){
			verifyAccount({account:value}).then(res=>{
				if(res.code == 0){
					callback();
				}else{
					callback(new Error('账号已经存在'));
				}
			})
      	}else{
      		callback();
      	}
      }
      var validatePassword =(rule, value, callback) => {
      	if(value ===''){
      		callback(new Error('请输入密码'));
      	}else{
      		callback();
      	}
      }
      var validateUsername =(rule, value, callback) => {
      	if(value ===''){
      		callback(new Error('请输入单位名称'));
      	}else{
      		callback();
      	}
      }
      var validatePhone = (rule, value, callback) => {
      	if(value ===''){
      		callback(new Error('请输入联系号码'));
      	}else{
      		callback();
      	}
      }
      var validateOrganization =(rule, value, callback) => {
      	if(value ===''){
      		callback(new Error('请填写组织名称'));
      	}else{
      		callback();
      	}
      }
      return{
        dialogVisible:false,
        superiorOrg:false,//所属组织是否可选
		baseData:{},
		account:'',
		admitType:1,//用来判断是添加还是修改  1是添加  2是修改
        ruleForm2: {
          account:'',
          password:'',
          superiorOrganization:'',
          phone:'',
          username:'',
          removeBtn:false,//删除按钮是否存在
        },
        options:[
          
        ],
        rules2: {
        	account:[
        		{ required: true,validator: validateAccount, trigger: 'blur' }
        	],
        	password:[
        		// { required: true,validator: validatePassword, trigger: 'change' },
        		{ required: true,validator: validatePassword, trigger: 'blur' }
        	],
        	username:[
        		{ required: false,validator: validateUsername, trigger: 'blur' }
        	],
        	phone:[
        		{ required: false,validator: validatePhone, trigger: 'blur' },
        		{ message: "请输入正确的号码", trigger: "blur" },
        		{
        			pattern:/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/,
        			message: "请输入正确的号码"
        		}
        	],
          superiorOrganization:[
            { required: true,validator: validateOrganization, trigger: 'change' },
            { message: "请选择组织", trigger: "change" },
          ]
        },
      }
    },
    methods:{
      sureBtn() {
		this.$refs.ruleForm2.validate((valid) => {
			if(valid){
				if(this.admitType == 1){
					//添加
					let param = {
						account:this.ruleForm2.account,
						password:this.ruleForm2.password,
						organizationId:this.baseData.id,
						organizationName:this.baseData.name,
						name:this.ruleForm2.username,
						phone:this.ruleForm2.phone,
					}
					addUser(param).then((res)=>{
						if(res.code == 0){
							this.dialogVisible = false
							this.$message({
							  message: '添加成功',
							  type: 'success'
							});
							this.$emit('getUser',1)
						}else{
							this.dialogVisible = false
							this.$message.error(res.msg);
						}
					})
				}else{
					//修改
					let param = {
						userId:this.baseData.userId,
						account:this.ruleForm2.account,
						password:this.ruleForm2.password,
						organizationId:this.baseData.organizationId,
						organizationName:this.ruleForm2.superiorOrganization,
						name:this.ruleForm2.username,
						phone:this.ruleForm2.phone,
					}
					changeUser(param).then((res)=>{
						if(res.code == 0){
							this.dialogVisible = false
							this.$message({
							  message: '修改成功',
							  type: 'success'
							});
							this.$emit('getUser',1)
						}else{
							this.dialogVisible = false
							// this.$message.error("修改失败");
							this.$message.error(res.msg);
						}
					})
				}
			}
		})
      },
      removeBtn(){
        this.dialogVisible = false
      },
      cancelBtn(){
        this.dialogVisible = false
      },
      handleClose(){
        this.dialogVisible = false
        this.ruleForm2 = {
          superiorOrganization:'',
          account:'',
          password:'',
          username:'',
          phone:'',
        }
        this.$nextTick(()=>{
//                     this.$refs.ruleForm2.clearValidate();
                })
      },
	  //新建用户
      newOrganization(val){
        this.dialogVisible = true
        this.superiorOrg = true
        this.removeBtn = false
        this.ruleForm2.superiorOrganization = val.name
		this.baseData = val
		this.admitType = 1
      },
	  //修改用户
      getOrganization(val){
		  console.log(val)
        this.dialogVisible = true
        this.superiorOrg = false
        this.removeBtn = true
        this.ruleForm2.superiorOrganization = val.organizationName
		this.account = val.account
        this.ruleForm2.account = val.account
        this.ruleForm2.password = val.password
        this.ruleForm2.username = val.name
        this.ruleForm2.phone = val.phone
		this.baseData = val
		this.admitType = 2
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
  .btnWrap{
    display: flex;
    justify-content: flex-end;
  }
</style>
