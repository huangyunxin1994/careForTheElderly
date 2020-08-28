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
            :default-expanded-keys="[treeId]"
            ref="tree"></el-tree>
      </div>
</template>

<script>
// import {getTopOrgList} from '@/api/api.js'
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
		data:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
		treeId:'',//跟组织id,用来默认第一级展开
		parant:[],
		children:[],
    }
  },
    methods: {
	  getData(val){
		  let treeData = val
		  let arr = []
		  let children=[];
		  let user = JSON.parse(sessionStorage.getItem('user'))
		  let userOrgId = user.organizationId
		  const data = this.toTree(treeData)
		  this.$emit("baseOrgPos",data[0])
		  this.data = data
	  },
	  
	  //递归
	  toTree(data) {
			let _this = this
	  		  // 删除 所有 children,以防止多次调用
	  		  data.forEach(function (item) {
	  			  delete item.children;
	  		  });
	  		  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
	  		  var map = {};
	  		  data.forEach(function (item) {
	  			  map[item.id] = item;
	  		  });
	  		  var val = [];
	  		  data.forEach(function (item) {
	  			  // 以当前遍历项，的pid,去map对象中找到索引的id
	  			  
	  			  var parent = map[item.parentId];
	  			  // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
	  			  if (parent) {
	  				  (parent.children || ( parent.children = [] )).push(item);
	  			  } else {
	  				  //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
	  				  val.push(item);
	  				  _this.treeId = item.id
	  			  }
	  		  });
	  		  return val;
	  },
      handleNodeClick(data) {
		let children = this.children
		children.forEach((item)=>{
			if(item.id == data.id){
				this.$emit("getOrganization",data)
			}
		})
      },
       filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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
    // padding: 1%;
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
