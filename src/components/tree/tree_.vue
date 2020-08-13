<template>
      <div class="tree">
        <el-input  v-model="filterText" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
          <div class="people" v-if='people'>
            <el-button :type="isAllPeople" size='mini' @click="allPeople">全部人员</el-button>
            <el-button :type="isWarnPeople" size='mini' @click="warnPeople">预警人员</el-button>
          </div>
          <div class="people" v-if="organization">
            <el-button type="primary" size="mini" @click="newOrganization">新建组织</el-button>
            <el-button type="primary" size="mini" @click="adminOrganization">编辑组织</el-button>
          </div>
          <el-scrollbar class="dashboard-scrollbar">
          <el-tree
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
               node-key="id"
              highlight-current
              :default-expanded-keys="[0]"
              ref="tree"></el-tree>
        </el-scrollbar>
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
    organization:{
      type:Boolean,
      default:false
    },
    allPeople1:{
      type:Object,
      default:function(){
        return{

        }
      }
    }
  },
  data(){
    return{
      filterText:"",
      isWarnPeople:'',
      isAllPeople:'primary',
      data: [
        {
          id:0,
          label:'广西总局',
          children:[
            {
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
            },
            {
              id:2,
              label: '河池公安局',
              children: [
                  {
                    id:14,
                    label: '金城江派出所',
                  },
                  {
                    id:15,
                    label: '天鹅派出所',
                  },
                  {
                    id:16,
                    label: '都安派出所',
                  },
                  {
                    id:17,
                    label: '南丹派出所',
                  },
                  {
                    id:18,
                    label: '巴马派出所',
                  },
                  {
                    id:19,
                    label: '鹿寨派出所',
                  },
                  {
                    id:20,
                    label: '南丹派出所',
                  },
                  {
                    id:21,
                    label: '巴马派出所',
                  },
                  {
                    id:22,
                    label: '鹿寨派出所',
                  },
                  {
                    id:23,
                    label: '鹿寨派出所',
                  },
                  {
                    id:24,
                    label: '鹿寨派出所',
                  },
                  {
                    id:25,
                    label: '鹿寨派出所',
                  },
                  {
                    id:26,
                    label: '鹿寨派出所',
                  },
                  {
                    id:27,
                    label: '鹿寨派出所',
                  },
                  {
                    id:28,
                    label: '鹿寨派出所',
                  },
                  {
                    id:29,
                    label: '鹿寨派出所',
                  },
                  {
                    id:30,
                    label: '鹿寨派出所',
                  },
                  {
                    id:31,
                    label: '鹿寨派出所',
                  }
               ]
            }
          ]
        }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    }
  },
    methods: {
      handleNodeClick(data,node) {
        // console.log(data);
        // console.log(node)
        let tree = {
          data:data,
          node:node.parent
        }
        this.$emit("handleOrg",data)
      },
       filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //所有人员
      allPeople(){
        this.isAllPeople = 'primary'
        this.isWarnPeople = ''
        this.$emit('allPeople',1)
      },
      //预警人员
      warnPeople(){
        this.isAllPeople = ''
        this.isWarnPeople = 'primary'
        this.$emit('warnPeople',1)
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
    // justify-content: space-between;
    // .el-input{
    //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    // }
    .people{
      height: 5vh;
      padding: 5% 2%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-tree{
      // height: 90%;
      padding: 5% 2%;
      border-radius: 5px;
      // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      font-size:0.8vw;
    }
    .dashboard-scrollbar{
    height: 100%;
    }

}
</style>
