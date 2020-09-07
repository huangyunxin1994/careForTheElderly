<template>
  <div>
    <nav-bar></nav-bar>
    <el-container class="electricfence-container">
      <el-row>
         <el-col :span="3" class="electricfence-tree">
            <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="inputVal" @input="filterData"></el-input>

            <div class="electricfence-content">
              <div class="electricfence-collapse">
                <div>
                  <span>&nbsp;&nbsp;&nbsp;电子围栏</span>
                </div>
                <div class="addRail" @click="openElecAddMap()">
                  <el-tooltip content="新建围栏" placement="top">
                    <i class="el-icon-plus"></i>
                  </el-tooltip>
                </div>
              </div>
              <el-scrollbar id="elec-main" class="electricfence-scrollbar" style="height: calc(100% - 50px);">
                <div :id="'elec-'+index" v-for="(item,index) in filterArr" :key="index" class="electricfence-collapse-item" :class="{'collapse-item-select':enterShowIndex == index}" @click="enterShow(index)">
                    
                    <div style="width: 4vw;" @click="setOrganization(item)">
                      <my-tooltip
                          :content="item.name"
                          class="wid190"
                          refName="tooltipOver"
                          @getOrganization = 'getOrganization'
                      ></my-tooltip>
                    </div>
                    <div class="electricfence-collapse-item-button">
                        <el-button type="info" icon="el-icon-s-custom" circle size="mini" @click.stop="setUserIn(index,item)"></el-button>
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.stop="editElec(index)"></el-button>
                    </div>
                </div>
              </el-scrollbar>
            </div>
        </el-col>
        <el-col :span="21" class="electricfence-map">
            <mymap ref="mymap" :circles="circles" :view="true"></mymap>
        </el-col>
      </el-row>
      <relevance-user ref='relevanceUser'></relevance-user>
       <dialog-map-e ref="dialogmape" @selectElec="selectElec"></dialog-map-e>
       <dialog-map ref="dialogmap" @selectElec="selectElec"></dialog-map>
    </el-container>
  </div>
</template>

<script>
import  mymap  from '@/components/map/qqmap'
import  dialogMap  from '@/components/dialogRailDeploy/dialog-map.vue'
import  dialogMapE  from '@/components/dialogRailDeploy/dialog-map-edit.vue'
import railTree from '@/components/tree/tree_.vue'
import NavBar from '@/components/navBar/navBar.vue'
import relevanceUser from '@/components/dialogRailDeploy/dialogRelevanceUser.vue'
import MyTooltip from '@/components/tooltip/tooltip.vue'

import {getRailList} from '@/api/api.js'
export default {
  name: 'Electricfence',
  components:{
    mymap,
    dialogMap,
    dialogMapE,
    NavBar,
    relevanceUser,
    railTree,
    MyTooltip,
  },
  data(){
    return{
      inputVal:"",
      activeNames:"1",
      enterShowIndex:-1,
      leaveShowIndex:-1,
      enterElecArr:[],
      circles:[
        
      ],
      filterArr:[],
	  zoomLevel:'',//缩放等级
    }
  },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      getLocation(id){
        console.log(id)
      },
      getDetails(id){
         console.log(id)
      },
      collapseChange(activeNames){
          this.enterShowIndex=-1
          this.leaveShowIndex=-1
      },
      //新建围栏
      openElecAddMap(){
        this.$refs.dialogmap.handleShow()
        // this.$refs.dialogmap.formVisible = true
      },
      enterShow(i){
        // this.enterShowIndex=i
        // this.$refs.map.movePosBypoint(this.filterArr[i].longitude,this.filterArr[i].latitude)
      },
	  //点击关联人员
      setUserIn(i,item){
		this.$refs.relevanceUser.handleShow(item)
      },
      //编辑围栏
      editElec(i){
        let id = this.filterArr[i].id
		let user = JSON.parse(sessionStorage.getItem('user'))
		let para = JSON.parse(JSON.stringify(this.filterArr[i]))
		if(user.organizationId == para.organizationId){
			this.$refs.dialogmape.handleShow(para)
		}else if(user.account == 'admin'){
			this.$refs.dialogmape.handleShow(para)
		}else{
			this.$message.error('抱歉,您没有权限编辑其他组织的电子围栏!');
		}
      },
      filterData(val){
        if(val == ''){
          this.filterArr = this.enterElecArr
        }else{
          let arr = this.enterElecArr.filter(item=>{
            if (!val) return true;
            return item.name.indexOf(val) !== -1;
          })
          this.filterArr=arr
        }
      },
      //点击组织，获取到相应的围栏
      getOrganization(val){
      },
	  setOrganization(val){
		this.$refs.mymap.moveDeploy(val.longitude,val.latitude)
	  },
      selectElec(){
		    let user = JSON.parse(sessionStorage.getItem('user'))
        getRailList().then((res)=>{
          if(res.code == 0){
            this.filterArr = res.data.list
			
            this.circles.length=0
            this.filterArr.forEach( i => this.circles.push(i))
            this.$refs.mymap.reloadCircles()
            
          }
        })
      },
	  //获取电子围栏信息
	  async getRailList(){
		  
		  let user = JSON.parse(sessionStorage.getItem('user'))
		  await getRailList().then((res)=>{
			  if(res.code == 0){
				  this.filterArr = res.data.list
				  this.enterElecArr = res.data.list
				  this.circles.length=0
				  this.filterArr.forEach( i => this.circles.push(i))
			  }
      })
      await this.$refs.mymap.getMap()
	  }
    },
    mounted(){
	  this.getRailList()
    }
}
</script>

<style lang="scss" scoped>
  /deep/.electricfence-container .el-row .electricfence-tree .electricfence-collapse-item .el-link[data-v-31116bfe]{
    word-wrap: break-word;
    word-break: break-all;
    white-space: nowrap !important;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    -webkit-text-overflow:ellipsis;
    -moz-text-overflow:ellipsis;
    width: 85px;
    display: block;
  }
.electricfence {
  &-container {
    width: 100%;
    height: calc(100vh - 65px);
    position: relative;
    .el-row {
    width: 100%;
    height: 100% ;
    overflow: hidden;
      .el-col {
      height: 100%;
      overflow: hidden;

      }
      .electricfence-tree{
        background-color: rgb(244, 244, 245);
        padding: 20px;
        position: absolute;
        min-width: 200px;
        left: 0px;
        top: 0px;
        z-index: 1000;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .el-collapse{
           height: calc(99% - 88px) ;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            .el-collapse-item{
               height: 100%;

              .electricfence-scrollbar{
                height: 100%;
              }
            }

        }
        .collapse-item-select{
            // border-left:5px solid #409EFF;
            padding: 10px 10px 10px 45px ;
            .el-link{
                color: #409eff;

            }
        }
        .electricfence-content{
          background-color: #fff;
          margin-top: 30px;
          box-sizing: border-box;
          padding: 10px;
          height: calc(100vh - 175px);
        }
        .electricfence-collapse{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0px;


          .addRail{
            color: #409eff;
            font-size: 1.3vw;
            cursor: pointer;
            // margin-right: 0.5vw;
          }
          .addRailBtn{
            padding: 0px !important;
            border: 0px;
            font-size: 1.2vw;
            color: #fff;
          }
          .addRail:hover{
            opacity: 0.8;
          }
        }
        .electricfence-collapse-item{
          .el-link{
                font-size: 0.7vw;
                white-space : nowrap
            }
          &-button{
            // min-width: 73px;
            display: flex;
          }
        }
      }
      .electricfence-map{
          position: relative;
          width: 100vw;
          height: calc(100vh - 65px);
          &-button{
              position: absolute;
              right: 5%;
              top: 5%;
          }
      }
    }
  }
  &-collapse{
      width: 100%;
      padding: 0 20px;
      font-size: 0.8vw;
      font-weight: bold;
      span{
          border-left: 5px solid #409EFF;
      }
      &-item{
         // width: 100%;
         padding: 10px 0vw 10px 1vw;
         display: flex;
         justify-content: space-between;
         align-items: center;
         cursor: pointer;
      }
  }

}
.orgName{
  font-size: 0.8vw;
}
</style>
