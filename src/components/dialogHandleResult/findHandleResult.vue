<template>
  <el-dialog title="处理结果" :visible.sync="dialogHandleResult" class="warp" center :append-to-body='true' :lock-scroll="false" width="50%">
  <div class="warnList">
    
    <div class="title">
      <p><span class="time"><span>时间:&nbsp;</span></span><span>2020-06-02</span></p>
      <p><span class="user"><span>处理人:&nbsp;</span></span><span>张三</span></p>
    </div>
    <div class="content">
      <span class="user">结果备注: &nbsp;</span><span>就按了斯柯达将发生了的咖啡机爱搜if我去啊啊是的会计法拉水电费看见啊搜我IE的吉拉斯卡的积分拉速度快放假哦阿萨德飞机啦
      烧烤就开始地方网咯PSP见到我说谱写了我觉得家里的反搜我能打瞌睡了撒打飞机哦我禁赛了吉林省打飞机阿斯顿发送到发瑟瑟发抖</span>
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

</style>
<style lang="scss" scoped>
  .warp/deep/.el-dialog__body{
    min-height: 200px;
  }
  .title{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .title>p{
    margin-right: 1.5vw;
  }
  .content{
    line-height: 1.5rem;
    min-height: 180px;
  }
</style>
