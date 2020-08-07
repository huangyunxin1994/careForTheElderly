<template>
  <el-dialog title="修改管理员密码"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="600px">

      <el-form ref="form" :model="form" label-position="left" class="form" label-width="80px" >
        <el-form-item label="密码">
          <el-input v-model="form.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
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
      return{
        dialogVisible:false,
        form: {
          pass: '',
          passAgain: ''
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
