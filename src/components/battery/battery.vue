<template>
  <div class="battery"></div>
</template>

<script>
  export default{
    components:{

    },
    data(){
      return{

      }
    },
    methods:{

    },
    mounted() {

    }
  }
</script>

<style scoped>
  .battery{
      height: 100%;
      height: 100%;
      box-sizing: border-box;
      /* border-radius: 10px 10px 5px 5px; */
      filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.22));
      /* background: #fff; */
      background-color: #67C23A;
      z-index: 1;
  }
  .battery::before {
       content: '';
       /*清除浮动*/
       position: absolute;
       width: 15%;
       height: 60%;
       top: 120%;
       right: -22%;
       transform: translate(-50%, -10px);
       border-radius: 0px 5px 5px 0px;
       /* background: rgba(240, 240, 240, 0.88); */
       background-color: #67C23A;
  }
</style>
