<template>
  <el-dialog :title="title"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" style="min-width: 1000px;">
    <div class="enroll-manage-container-title">关联用户</div>
    <div class="main">
      <div class="mainleft">
        <tree ref="tree" @getOrganization="getOrganization"></tree>
      </div>
      <div class="shuttle">
        <el-transfer
            v-model="value"
            :titles="['未关联人员', '已关联人员']"
            :button-texts="['删除', '添加']"
            :data="data" filterable class="Transfer" @change="handleChange">
        </el-transfer>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Tree from '@/components/tree/relevanseUserTree.vue'
  export default{
    components:{
      Tree
    },
    data(){
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`
          });
        }
        return data;
      };
      return{
        dialogVisible:false,
        title:'xxx围栏',
        data: generateData(),
        value: []
      }
    },
    methods:{
      //添加删除成员
      handleChange(value, direction, movedKeys) {


      },
      handleClose(){
        this.dialogVisible = false
      },
      getOrganization(val){
        console.log(val)
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  .el-transfer-panel{
      width: 20vw;
      height:50vh;
  }
  .el-transfer-panel__item{
      width:100%;
  }
   .el-transfer-panel__list.is-filterable{
      height: 40vh;
   }
   .el-transfer__buttons{
       display: flex;
       flex-direction: column;
       justify-content: space-between;
       align-items: center;

       .el-button{
           margin: 0;
           margin-bottom: 1vh;
           width: 100px;

       }
   }
   .Transfer{
       display: flex;
       justify-content: space-between;
       align-items: center
   }
  .el-dialog{
    width: 52%;
  }
</style>

<style lang="scss" scoped>

  .enroll-manage-container-title{
    margin-bottom: 20px;
    padding: 2px 0;
    border-left: 4px solid #409EFF;
    text-indent: 20px;
    font-size: 18px;
    font-weight: 700;
  }
  .main{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .mainleft{
      width: 10vw;
      border: 1px solid #ebeef5;
      padding: 10px;
      border-radius: 5px;
      min-height: 280px;
      height: 48vh;
      margin-right: 1vw;
    }
    .shuttle{
      width: 35vw;
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
</style>
