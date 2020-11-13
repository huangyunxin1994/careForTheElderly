<template>
  <div class="getAdress">
    <el-autocomplete
      v-model="address"
      :fetch-suggestions="querySearchAsync"
      style="width:100%;min-width: 300px;"
      placeholder="请输入内容"
      @select="handleSelect"
    >
      <template slot-scope="{ item }">
          <div  class="itemContent" >
            <i class="el-icon-search fl mgr10"></i>
            <div style="overflow:hidden;">
              <div class="title">{{ item.title }}</div>
              <el-tooltip :content="item.address" placement="top">
                 <span class="address ellipsis">{{ item.address }}</span>
              </el-tooltip>
            </div>
          </div>
        </template>
    </el-autocomplete>
  </div>
</template>

<script>
  export default {
    props:{
      map:{
        type:Object
      }
    },
    data(){
      return{
        address:''
      }
    },
    methods:{
      //搜索建议方法
      querySearchAsync(str,cb){
        // var options = {
        //   onSearchComplete: function(res){ //检索完成后的回调函数
        //     var s = [];
        //     if (local.getStatus() == BMAP_STATUS_SUCCESS){
        //       for (var i = 0; i < res.getCurrentNumPois(); i ++){
        //         s.push(res.getPoi(i));
        //       }
        //       cb(s) //获取到数据时，通过回调函数cb返回到<el-autocomplete>组件中进行显示
        //     } else{
        //       cb(s)
        //     }
        //   }
        // }
        // var local = new BMap.LocalSearch(this.map, options) //创建LocalSearch构造函数
        // local.search(str) //调用search方法，根据检索词str发起检索
        let searchService = new qq.maps.SearchService({
        //检索成功的回调函数
                complete: function(results) {
                    //设置回调函数参数
                   console.log(results)
                   var s = [];
                   for(var i=0;i<results.detail.pois.length;i++){
                     s.push(results.detail.pois[i]);
                   }
                   cb(s) //获取到数据时，通过回调函数cb返回到<el-autocomplete>组件中进行显示
                },
                //若服务请求失败，则运行以下函数
                error: function() {
                  var s = [];
                   cb(s)
                }
            });
            // searchService.setLocation("南宁");
          searchService.search(str);
      },
      //点击选中建议项时触发的方法
      handleSelect(item) {
        console.log(item)
        this.address = item.address + item.name; //记录详细地址，含建筑物名

        this.$emit('getItem',item)
      },
	  //关闭时清空adress
	  closeHandle(){
		  this.address = ''
    },
	  //已知坐标点 将坐标解析成地址
	  getNowAdress(val){
		  let point = new BMap.Point(val.lng,val.lat);
		  var geoc = new BMap.Geocoder();
		  let that = this
		  geoc.getLocation(point, function (rs) {
			var addComp = rs.addressComponents;
			// console.log(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber)
			let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
  　　　　　　that.address = address
			// this.emit('getAdressName',this.address)
	　　//对应的省市区、县街道，街道号address
		  });
	  }
    },
    mounted() {

    }
  }
</script>

<style scoped>
   .el-popper{
    min-width: 500px !important;
  }
  .itemContent{
    display: flex;
    align-items: center;
    padding: 5px 0px;
  }
  .fl{
    margin-right: 10px;
  }
  .address{
    font-size: 12px;
    color: #aba8a8;
  }
  .el-scrollbar__view /deep/ .el-autocomplete-suggestion li{
    line-height: 20px !important;
  }
</style>
