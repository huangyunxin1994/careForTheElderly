<template>
  <div class="dome">
    <div class="block">
      <el-date-picker
        v-model="dateVale"
        popper-class="datePickerPop"
        v-addDatePickerClass="addDatePickerClass"
        v-addDatePickerBtn="addDatePickerBtn"
        type="date"
        placeholder="选择日期"
        @change="handleChange" :size="size">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "dome",
  props:{
    size:String,
    alertTimeList:Array
  },
  data() {
    return {
      dateVale: "",
      currentDayList: [], // 初始化后台请求过来的数据
      currentSec: new Date().getSeconds(), // 初始化当前选中的秒
      currentMin: new Date().getMinutes(), // 初始化当前选中的分
      currentHour: new Date().getHours(), // 初始化当前选中的时
      currentDay: new Date().getDate(), // 初始化当前选中的天
      currentMonth: new Date().getMonth() + 1, // 初始化当前选中的月
      currentYear: new Date().getFullYear(), // 初始化当前选中的年
      showMonth: new Date().getMonth() + 1, // 初始化月
      showYear: new Date().getFullYear(), // 初始化年
      warnTableData:[]
    };
  },
  directives: {
    addDatePickerClass: {
      bind(el, binding){
        const selectWrapDom = el.querySelector('.el-date-editor input')
        selectWrapDom.addEventListener('click',function() {
          binding.value()
        })
      }
    },
    addDatePickerBtn: {
      bind(el, binding){
        const selectWrapDom = el.querySelector('.el-date-editor input')
        selectWrapDom.addEventListener('click',function() {
          binding.value()
        })
      }
    }
  },
  created() {
    let time = new Date()
    let year = time.getFullYear();
    let month = parseInt(time.getMonth() + 1) < 10 ? "0"+parseInt(time.getMonth() + 1) : parseInt(time.getMonth() + 1);
    let day = time.getDate() < 10 ? "0"+time.getDate() : time.getDate()
    this.dateVale = `${year}-${month}-${day}`
  },
  methods: {
     // 父组件获取数据
    handleChange (val) {
      if(val&&val!="")
      this.$emit("getChartData",val);
    },
    // 请求接口
    getBaseControlDays: async function() {
      let selectTimeList = document.querySelectorAll('.el-date-picker .el-date-picker__header-label')
      let year = parseInt(selectTimeList[0].innerHTML)
      let month = parseInt(selectTimeList[1].innerHTML)
      this.showYear = year
      this.showMonth = month
      let params = {
        year,
        month
      }

      let a = this.queryDateOfMonth(params) // 请求接口

      //console.log(a)
      return await a
    },
    // 假设我调用完后台接口，已经拿到了数据
    queryDateOfMonth(params) {
      let data =[]
      this.currentDayList = []
      for(let i in this.alertTimeList){
        var date = this.alertTimeList[i].hours
        date = date.substring(0,11);    
        date = date.replace(/-/g,'/'); 
        var timestamp = new Date(date).getTime();
        data.push(timestamp)
      }
      data.forEach((item)=> {
        let para = {month:new Date(item).getMonth()+1,day:new Date(item).getDate()}
         return this.currentDayList.push(new Date(item).getMonth()+1+"-"+new Date(item).getDate())
      })
    },

    // 添加class
    addDatePickerClass: async function(){
      const self = this
      await this.getBaseControlDays()
      let domList = document.querySelectorAll('.el-date-picker .el-date-table__row .available')

      domList.forEach(function(dom, i) {
        if(self.showYear > self.currentYear || (self.showYear == self.currentYear && self.showMonth > self.currentMonth)
          || (self.showYear == self.currentYear && self.showMonth == self.currentMonth && i > self.currentDay -1))
        {
          dom.className.match(/warn-icon/i) && (dom.className = 'available')
          dom.className.match(/hook-icon/i) && (dom.className = 'available')
          return false
        }
        if (self.currentDayList.indexOf(self.showMonth+"-"+parseInt(i+1))!=-1) {
          dom.className.match(/warn-icon/i) && (dom.className = 'available hook-icon')
          dom.className.match(/hook-icon/i) || (dom.className += ' hook-icon')
        } else {
          dom.className.match(/hook-icon/i) && (dom.className = 'available warn-icon')
          dom.className.match(/warn-icon/i) || (dom.className += ' warn-icon')
        }
      })
    },

    // 点击切换按钮时调用
    addDatePickerBtn(){
      const self = this
      const selectWrapDomList = document.querySelectorAll('.el-date-picker .el-picker-panel__icon-btn')
      selectWrapDomList.forEach(element => {
        element.onclick = async function() {
          await self.getBaseControlDays() // 等后台数据请求成功之后再进行下一步
          self.addDatePickerClass() // 添加class
        }
      })
    }

  }

};
</script>

<style lang="scss">
.hook-icon,.warn-icon {
    position: relative;
}
.hook-icon:after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 1em solid #F56C6C;
    border-left: 1em solid transparent;
}
</style>
