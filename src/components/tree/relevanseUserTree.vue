<template>
      <div class="treeWrap">
        <el-input  v-model="filterText" placeholder="请输入内容" suffix-icon="el-icon-search" ></el-input>
        <div class="people" v-if='people'>
          <el-button :type="isAllPeople" size='mini' @click="allPeople">全部人员</el-button>
          <el-button :type="isWarnPeople" size='mini' @click="warnPeople">预警人员</el-button>
        </div>
        <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
             node-key="id"
            highlight-current
            :default-expanded-keys="[1]"
            ref="tree"></el-tree>
      </div>
</template>

<script>
export default {
  name: 'tree',
  props:{
    people:{
      type:Boolean,
      default:false
    },
  },
  data(){
    return{
      filterText:"",
      isWarnPeople:'',
      isAllPeople:'primary',
      data: [{
          id:1,
          label: '南宁公安局',
          children: [
              {
                id:11,
                label: '仙湖派出所',
              },
              {
                id:12,
                label: '南湖派出所',
              },
              {
                id:13,
                label: '凤岭派出所',
              }
           ]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    }
  },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
       filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      allPeople(){
        this.isAllPeople = 'primary'
        this.isWarnPeople = ''
      },
      warnPeople(){
        this.isAllPeople = ''
        this.isWarnPeople = 'primary'
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
}
</script>
<style>
  .treeWrap /deep/.el-input__inner{
    height: 32px !important;
    border-radius: 30px;
    line-height: 32px;
  }
  .el-input__icon{
    line-height: 32px;
  }
</style>

<style lang="scss" scoped>
.treeWrap /deep/.el-tree{
      height: 90%;
      padding: 5% 2%;
      border-radius: 5px;
      font-size:0.8vw;
    }
.tree{
    height: 100%;
    padding: 1%;
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    .people{
      height: 10%;
      padding: 5% 2%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-tree{
      height: 90%;
      padding: 5% 2%;
      border-radius: 5px;
      font-size:0.8vw;
    }
}
</style>
