<template>
  <el-dialog title="填写处理结果" :visible.sync="dialogHandleResult" center :append-to-body='true' :lock-scroll="false" width="50%">
  <div class="warnList">

    <div class="warnResultRight">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        :autosize="{ minRows: 6, maxRows: 4}"
        v-model="textarea">
      </el-input>
    </div>
  </div>
  <el-row class="cancelSwrap">
    <div class="cancel">
      <button @click="cancel" class="cancelBtn">取消</button>
      <button @click="sureBtn" class="sureBtn">确定</button>
    </div>
  </el-row>
  </el-dialog>
</template>

<script>
  export default{
    data() {
      return {
        dialogHandleResult:false,
        changeDataResult:'',
        textarea: ''
      }
    },
    methods:{
      cancel(){
        // this.$emit('dialog','1')
        this.dialogHandleResult = false
      },
      sureBtn(){
        if(this.textarea!=""){
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.dialogHandleResult = false
        }else{
          this.$message({
            message: '请填写处理结果',
            type: 'error'
          });
        }
      },
    }
  }
</script>

<style>
  .warnList /deep/ .el-textarea__inner{
    min-height: 200px !important;
  }
</style>
<style lang="scss" scoped>
  
  .warnList{
    display: flex;
    justify-content: space-around;
  }

  .warnResultLeft{
    width: 15vw;
  }
  .warnResultRight{
    width: 85vw;
  }



  .cancelSwrap{
    width: 100%;
  }
  .cancel{
    display: flex;
    justify-content: space-around;
    width: 340px;
    margin: 20px auto 0px;
  }
  .sureBtn{
    background: rgba(0, 153, 255, 1);
    color: white;
    width: 110px;
    height: 40px;
    border-radius: 3px;
    border: 1px solid transparent;
    outline: none;
  }
  .cancelBtn{
    width: 110px;
    height: 40px;
    border: 1px solid rgb(204, 204, 204);
    color: rgb(153, 153, 153);
    border-radius: 3px;
    background-color: white;
  }
</style>
