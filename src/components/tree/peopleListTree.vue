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
			  :expand-on-click-node="false"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
               node-key="id"
              highlight-current
              :default-expanded-keys="treeId"
              ref="tree"></el-tree>
        </el-scrollbar>
      </div>
</template>

<script>
	
import {getOrgList,getTopOrgList} from '@/api/api.js'
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
		data: [],
		treeId:[],
		defaultProps: {
			children: 'children',
			label: 'name'
		},
		baseOrg:'',
		parant:[],
    }
  },
    methods: {
      handleNodeClick(data,node) {
        let tree = {
          data:data,
          node:node.parent
        }
		this.$emit("handleOrg",data)
      },
       filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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
        this.$emit("newOrganization",this.baseOrg,this.data)
      },
      //编辑组织
      adminOrganization(){
        this.$emit("adminOrganization",this.data)
      },
	  //新建用户时，默认选中跟组织，将跟组织传递出去
	  setBaseData(){
		  this.$emit("setBaseData",this.baseOrg)
	  },
	  //取消选中
	  cancelSelect(){
			this.$refs.tree.setCurrentKey()
	  },
	  //获取组织列表
	  getOrgList(){
		let user = JSON.parse(sessionStorage.getItem('user'))
		let userOrgId = user.organizationId
		let param = {
			organizationId:userOrgId
		}
		if(user.account == "admin"){
			getTopOrgList().then((res)=>{
				console.log("组织列表")
				console.log(res)
				let arr=[]
				if(res.code == 0){
					let treeData = res.data.data
					treeData.forEach((item)=>{
						item.dataName = item.name + '(' + item.equipmentCount + ')'
					})
					const data = this.toTree(treeData)
					this.data = data
					this.baseOrg = data[0]
					this.$emit("baseOrgPos",this.data[0])
					this.setBaseData()
				}
			})
		}else{
			getTopOrgList(param).then((res)=>{
				let arr=[]
				if(res.code == 0){
					let treeData = res.data.data
					const data = this.toTree(treeData)
					this.data = data
					this.$emit("baseOrgPos",this.data[0])
					this.setBaseData()
				}
			})
		}
	  },
	  //新递归
	  getTreeData(data,id){
		  let arr = []
		  let parant = []
		  data.forEach((item)=>{
		    //当前组织的所属组织id等于用户的所属组织   说明当前组织时当前用户所属组织的子组织
		    if(item.id == id){
		  	  // if(item.parentId){
		  		 // arr.push(data.find(i => i.id == item.parentId)) 
		  		 // parant.push(data.find(i => i.id == item.parentId)) 
		  	  // }
		  	 arr.push(item) 
		    }
		  })
		  function getTreeData2(data,id){
		  	data.forEach((item)=>{
		  	  //当前组织的所属组织id等于用户的所属组织   说明当前组织时当前用户所属组织的子组织
		  	  if(item.parentId == id){
		  		 arr.push(item) 
		  		 getTreeData2(data,item.id)
		  	  }
		  	})
		  }
		  this.parant = parant
		  getTreeData2(data,id)
		  
		  return arr
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
			  // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
			  if (parent) {
				  (parent.children || ( parent.children = [] )).push(item);
			  } else {
				  //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
				  val.push(item);
				  _this.treeId.push(item.id)
			  }
		  });
		  return val;
	  }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
	mounted() {
		this.getOrgList()
	}
}
</script>

<style lang="scss" scoped>
.tree{
    height: 100%;
    // padding: 1%;
    display: flex;
    flex-direction:column;
    .people{
      height: 5vh;
      padding: 5% 2%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-tree{
      padding: 5% 2%;
      border-radius: 5px;
      font-size:0.8vw;
    }
    .dashboard-scrollbar{
    height: 100%;
    }

}
</style>
