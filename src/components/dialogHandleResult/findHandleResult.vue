<template>
  <el-dialog title="处理结果" :visible.sync="dialogHandleResult" class="warp" center :append-to-body='true' :lock-scroll="false" width="50%">
  <div class="warnList">
    
    <div class="title">
      <p><span class="time"><span>时间:&nbsp;</span></span><span>{{handleData.handleTime}}</span></p>
      <p><span class="user"><span>处理人:&nbsp;</span></span><span>{{handleData.handleUsername}}</span></p>
    </div>
    <div class="content">
      <span class="user">结果备注: &nbsp;</span><span>{{handleData.handleRecord}}</span>
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
        textarea: '',
		handleData:'',
      }
    },
    methods:{
      cancel(){
        this.dialogHandleResult = false
      },
	  getData(val){
		  this.dialogHandleResult = true
		  this.handleData = val
	  }
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
