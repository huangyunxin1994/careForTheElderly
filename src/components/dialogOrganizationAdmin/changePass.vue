<template>
  <el-dialog title="修改管理员密码"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">

      <el-form ref="form" :model="form" :rules="rules2"  class="form" label-width="80px" >
        <el-form-item label="密码" prop="pass">
          <el-input v-model="form.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passAgain">
          <el-input v-model="form.passAgain"></el-input>
        </el-form-item>
      </el-form>
    <div class="btnWrap">
      <el-button type="primary"  class="btn" @click="cancelBtn">取消</el-button>
      <el-button type="primary"  class="btn" @click="sureBtn">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default{
    data(){
      var validatePass = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入密码'));
        }else{
          if(this.form.passAgain !== ''){
            if(value !== this.form.passAgain){
              callback(new Error('两次输入密码不一致!'))
            }else{
              callback()
            }
          }else{
            callback()
          }
        }
      }
      var validateAgain = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入确认密码'));
        }else if(value !== this.form.pass) {
          callback(new Error('两次输入密码不一致!'));
        }else{
          callback();
        }
      }
      return{
        dialogVisible:false,
        form: {
          pass: '',
          passAgain: ''
        },
        rules2:{
          pass:[
          	{ required: true,validator: validatePass, trigger: 'blur' }
          ],
          passAgain:[
            { required: true,validator: validateAgain, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      sureBtn() {
        this.dialogVisible = false
      },
      cancelBtn(){
        this.dialogVisible = false
      },
      handleClose(){
        this.dialogVisible = false
        this.form = {
          pass: '',
          passAgain: ''
        },
        this.$nextTick(()=>{
                    this.$refs.ruleForm2.clearValidate();
                })
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
