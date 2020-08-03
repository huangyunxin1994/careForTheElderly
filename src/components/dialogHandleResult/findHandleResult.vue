<template>
  <el-dialog  :visible.sync="dialogHandleResult" class="warp" center :append-to-body='true' :lock-scroll="false" width="50%">
  <div class="warnList">
    <div class="contentWrap">
      <p class="title">处理结果</p>
      <p class="content" style="text-indent:2em;">就按了斯柯达将发生了的咖啡机爱搜if我去啊啊是的会计法拉水电费看见啊搜我IE的吉拉斯卡的积分拉速度快放假哦阿萨德飞机啦烧烤</p>
    </div>
    <div class="timeWrap">
      <span class="titleLabel">时间:</span><span>2020-06-02</span>
    </div>
    <div class="userWrap">
      <span class="titleLabel">处理人:</span><span>张三</span>
    </div>
  </div>


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
  .warp/deep/.el-dialog__header{
    padding: 0px;
  }
</style>

<style lang="scss" scoped>

  .title{
    text-align: center;
    font-size: 1vw;
    font-weight: 600;
  }
  .userWrap,
  .timeWrap,
  .contentWrap{
    padding: 10px;
  }
  .titleLabel{
    display: inline-block;
    width: 60px;
    padding-right: 5px;
  }
</style>
