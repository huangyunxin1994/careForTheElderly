<template>
      <div class="tree">
        <el-input  v-model="filterText" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
        <div class="btnWrap">
          <el-button type="primary" size="mini" @click="newOrganization">新建组织</el-button>
          <el-button type="primary" size="mini" @click="adminOrganization">编辑组织</el-button>
        </div>
        <el-tree
            :data="data"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            highlight-current
             node-key="id"
            :default-expanded-keys="[1]"
            ref="tree"></el-tree>
      </div>
</template>

<script>
export default {
  name: 'tree',
  data(){
    return{
      filterText:"",
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
      //新建组织
      newOrganization(){
        this.$emit("newOrganization",1)
      },
      //编辑组织
      adminOrganization(){
        this.$emit("adminOrganization",2)
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
}
</script>

<style lang="scss" scoped>
.tree{
    // width: 15%;
    height: 100%;
    padding: 1%;
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    // .el-input{
    //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    // }
    .btnWrap{
      margin: 2vh 0vh 2vh 0vh;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-tree{
      height: 90%;
      padding: 5% 2%;
      border-radius: 5px;
      // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      font-size:0.8vw;
    }
}
</style>
