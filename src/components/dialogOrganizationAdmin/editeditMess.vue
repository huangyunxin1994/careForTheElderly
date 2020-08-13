<template>
  <el-dialog title="用户管理"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">

      <el-form  :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="140px">
      	<el-form-item label="账号" prop="account">
      	    <el-input v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号"></el-input>
      	</el-form-item>
      	<el-form-item label="密码" prop="password">
      	    <el-input v-model="ruleForm2.password" auto-complete="off" show-password placeholder="请输入密码" ></el-input>
      	</el-form-item>
      	<el-form-item label="所属组织" prop="superiorOrganization" >
            <el-select v-model="ruleForm2.superiorOrganization" :disabled="superiorOrg" placeholder="请选择上级组织">
                <el-option
                  v-for="item in options"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
      	  </el-form-item>
        <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm2.username" placeholder="请输入单位名称" ></el-input>
        </el-form-item>
      	<el-form-item label="联系号码" prop="phone">
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
  export default{
    data(){
      var validateAccount =(rule, value, callback) => {
      	if(value ===''){
      		callback(new Error('请输入账号'));
      	}else if(value != this.account){
      		getUserName({idCard:value}).then(res=>{
      			if(res.code==0){
      				if(res.data.data.length == 0){
      					callback();
      				}else{
      					callback(new Error('账号已经存在'));
      				}
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

        ruleForm2: {
          account:'',
          password:'',
          superiorOrganization:'',
          phone:'',
          username:'',
          removeBtn:false,//删除按钮是否存在
        },
        options:[
          {
            value:'南宁总局',
            label:'南宁总局',
            index:'01'
          },
          {
            value:'邕宁分局',
            label:'邕宁分局',
            index:'02'
          },
          {
            value:'青秀分局',
            label:'青秀分局',
            index:'03'
          }
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
        		{ required: true,validator: validateUsername, trigger: 'blur' }
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
        this.dialogVisible = false
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
                    this.$refs.ruleForm2.clearValidate();
                })
      },
      newOrganization(val){
        this.dialogVisible = true
        this.superiorOrg = true
        this.removeBtn = false
        this.ruleForm2.superiorOrganization = val.label
      },
      getOrganization(val){
        this.dialogVisible = true
        this.superiorOrg = false
        this.removeBtn = true
        this.ruleForm2.superiorOrganization = val.belongPlatform
        this.ruleForm2.account = val.account
        this.ruleForm2.password = val.pass
        this.ruleForm2.username = val.name
        this.ruleForm2.phone = val.phone
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
