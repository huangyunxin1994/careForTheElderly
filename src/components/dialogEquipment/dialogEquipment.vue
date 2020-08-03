<template>
  <div class="relevance">
    <el-dialog title="关联组织"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
        <tree></tree>
        <div class="btnWrap">
          <el-button type="primary"  class="btn" @click="sureBtn">确定</el-button>
          <el-button type="primary"  class="btn" @click="cancelBtn">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import Tree from '@/components/tree/tree_.vue'
  export default{
    components:{
      Tree
    },
    data(){
      return{
        dialogVisible:false
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
<style>
  /* .el-dialog/deep/.el-dialog__body{
    min-height: 300px;
  } */
</style>

<style lang="scss" scoped>
  .el-dialog/deep/.tree{
    min-height: 300px;
    display: block;
  }
  .relevance{
    // min-height: 500px;
  }
  .el-dialog__body{
    min-height: 500px !important;
  }
  .btnWrap{
    display: flex;
    justify-content: center;
    margin-bottom: 0px;
  }
</style>
