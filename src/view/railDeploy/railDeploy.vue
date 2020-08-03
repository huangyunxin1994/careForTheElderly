<template>
  <div>
    <nav-bar></nav-bar>
    <el-container class="electricfence-container">
      <el-row>
         <el-col :span="4" class="electricfence-tree">
            <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="inputVal" @input="filterData"></el-input>
            <el-divider></el-divider>
            <el-collapse v-model="activeNames" :accordion="true" @change="collapseChange">
            <el-collapse-item name="1" >
                <template slot="title">
                    <div class="electricfence-collapse">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电子围栏</span>
                    </div>
                </template>
                 <el-scrollbar id="elec-main" class="electricfence-scrollbar">
                  <div :id="'elec-'+index" v-for="(item,index) in filterArr" :key="index" class="electricfence-collapse-item" :class="{'collapse-item-select':enterShowIndex == index}" @click="enterShow(index)">
                      <el-link :underline="false">{{item.name}}</el-link>
                      <div class="electricfence-collapse-item-button">
                          <el-button type="info" icon="el-icon-s-custom" circle size="mini" @click.stop="setUserIn(index)"></el-button>
                          <el-button type="primary" icon="el-icon-edit" circle size="mini" @click.stop="editElec(index)"></el-button>
                      </div>
                  </div>
                 </el-scrollbar>
            </el-collapse-item>

            </el-collapse>
        </el-col>
        <el-col :span="18" class="electricfence-map">
            <mymap ref="map"></mymap>
            <div class="electricfence-map-button">
                <el-button type="danger" @click="openElecAddMap()">添加电子围栏</el-button>
            </div>
        </el-col>
      </el-row>
      <relevance-user ref='relevanceUser'></relevance-user>
       <dialog-map-e ref="dialogmape" @selectElec="selectElec"></dialog-map-e>
       <dialog-map ref="dialogmap"></dialog-map>
    </el-container>
  </div>
</template>

<script>
import  mymap  from '@/components/map/map'
import  dialogMap  from '@/components/dialogRailDeploy/dialog-map.vue'
import  dialogMapE  from '@/components/dialogRailDeploy/dialog-map-edit.vue'
// import  myTransfer from '@/components/dialog-elec/dialog-user'
// import { deleteElectronicFence,selectElectronicFenceQuery} from  "@/api/table"
import NavBar from '@/components/navBar/navBar.vue'
import relevanceUser from '@/components/dialogRailDeploy/dialogRelevanceUser.vue'
// import dialogMap from '@/components/'
export default {
  name: 'Electricfence',
  components:{
    mymap,
    dialogMap,
    dialogMapE,
    // myTransfer
    NavBar,
    relevanceUser,
  },
  data(){
    return{
      inputVal:"",
      activeNames:"1",
      enterShowIndex:-1,
      leaveShowIndex:-1,
      filterArr:[
        {
          name:'南宁总局'
        },
        {
          name:'西乡塘分局'
        }
      ],
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
          console.log(activeNames)
          this.enterShowIndex=-1
          this.leaveShowIndex=-1
      },
      //新建围栏
      openElecAddMap(){
        console.log("hahahah")
        this.$refs.dialogmap.handleShow()
        // this.$refs.dialogmap.formVisible = true
      },
      enterShow(i){
        // this.enterShowIndex=i
        // this.$refs.map.movePosBypoint(this.filterArr[i].longitude,this.filterArr[i].latitude)
      },
      setUserIn(i){
        console.log(i)
        this.$refs.relevanceUser.dialogVisible = true
        // let row = this.filterArr[i]
        // this.$refs.transfer.handleShow(row)
      },
      //编辑围栏
      editElec(i){
        let id = this.filterArr[i].id
        let para = JSON.parse(JSON.stringify(this.filterArr[i]))
        this.$refs.dialogmape.form = para
        this.$refs.dialogmape.handleShow()
      },
      filterData(val){
        let arr = this.enterElecArr.filter(item=>{
          if (!val) return true;
          return item.name.indexOf(val) !== -1;
        })
        this.filterArr=arr
      },
      selectElec(){
      //   selectElectronicFenceQuery().then(res=>{
      //     if(res.code==0){
      //       console.log(res)
      //       let data = res.data.data
      //       console.log(data)
      //       let arr1=[]
      //       for(let i in data){
      //         let o = data[i].electronicFence;
      //         o.userList = data[i].userList
      //         arr1.push(o)
      //       }
      //       console.log(arr1)
      //       this.enterElecArr=arr1;
      //       this.filterArr=arr1
      //       this.$refs.map.getmap(arr1);

      //     }
      //   }).catch(res=>{

      //   })
      },
    },
    mounted(){
      // this.selectElec()
    }
}
</script>
<style lang="scss" >
.el-collapse-item__wrap{
       height: calc(100% - 48px);
       .el-collapse-item__content{
         height: 100%;
         padding-bottom: 0;
       }
}
</style>
<style lang="scss" scoped>
.electricfence {
  &-container {
    width: 100%;
    height: 100%;
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
        background-color: rgb(233, 233, 235);
        padding: 1%;
        position: absolute;
        min-width: 200px;
        left: 0px;
        top: 0px;
        z-index: 1000;

        .el-input{
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
        }
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
            border-left:5px solid #409EFF;
            padding: 10px 10px 10px 45px ;
            .el-link{
                color: #409eff;

            }
        }
        .electricfence-collapse-item{
          .el-link{
                font-size: 0.7vw;
                white-space : nowrap
            }
          &-button{
            min-width: 73px;
          }
        }
      }
      .electricfence-map{
          position: relative;
          width: 100vw;
          height: calc(100vh - 85px);
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
         padding: 10px 10px 10px 50px ;
         display: flex;
         justify-content: space-between;
         align-items: center;
         cursor: pointer;
      }
  }

}
</style>
