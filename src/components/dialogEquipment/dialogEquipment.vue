<template>
  <div class="relevance">
    <el-dialog title="关联组织"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false"  width="500px">
        <!-- <el-scrollbar class="dashboard-scrollbar"> -->
        <div style="height: 300px;">
          <tree ref="tree" @handleOrg="handleOrg"></tree>
        </div>
          
        <!-- </el-scrollbar> -->
        <div class="btnWrap">
          <el-button type="primary"  class="btn" @click="cancelBtn">取消</el-button>
          <el-button type="primary"  class="btn" @click="sureBtn">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import Tree from '@/components/tree/tree_.vue'
  import {relatvieEquipment} from "@/api/api"
  export default {
    components:{
      Tree
    },
    data(){
      return{
        dialogVisible:false,
        eqData:'',
        orgData:'',
      }
    },
    methods:{
      sureBtn() {
        console.log(this.eqData)
        if(this.orgData.length == 0){
          this.$message.error('请选择组织进行关联!');
        }else{
           this.$confirm('确认将所选设备关联到组织：'+this.orgData.name+' 下吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let str = ""
          this.eqData.forEach(i => {
            str+= i.code+","
          });
          str = str.substring(0,str.lastIndexOf(","))
          relatvieEquipment({equipmentCode:str,organizationId:this.orgData.id}).then(res=>{
            if(res.code == 0){
              this.$message({
                message: '关联成功',
                type: 'success'
              });
              this.dialogVisible = false
              this.$emit("updateMess")
            }else{
              this.$message({
                message: '关联失败',
                type: 'error'
              });
            }
          }).catch(err=>{
            this.$message({
                message: '关联失败',
                type: 'error'
              });
          })
           
        }).catch(() => {
                  
        });
         
        }
      },
      cancelBtn(){
        this.dialogVisible = false
      },
      handleClose(){
        this.dialogVisible = false
      },
      relevance(val){
        this.dialogVisible = true
        this.eqData = val
      },
      handleOrg(val){
        this.orgData = val
      }
    },
    mounted() {

    }
  }
</script>
<style>

 /* /deep/ .tree .dashboard-scrollbar[data-v-2262f0e0] {
      height: 80% !important;
  } */
</style>
<style lang="scss" scoped>
  /deep/ .tree .dashboard-scrollbar {
      height: 84% !important;
  }
  .tree .dashboard-scrollbar[data-v-2262f0e0] {
      height: 80%;
  }
  .el-scrollbar__wrap{
    height: 80% !important;
  }
  // .el-dialog/deep/.tree{
  //   height: 300px;
  //   display: block;
  // }
  .el-dialog__body{
    min-height: 500px !important;
  }
  .btnWrap{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0px;
  }

</style>
