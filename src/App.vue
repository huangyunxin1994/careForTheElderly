<template>
  <div id="app">
    <audio id="audio" loop ref="music" >
        <source src="./assets/mp3/dididi.mp3" type="audio/mpeg" />
    </audio>
    <router-view ref="Childmain" @changPlaying="changPlaying" @stop="stop" />
  </div>
</template>

<script>
import {getOrgEquipment} from "@/api/api"
export default {
  name: 'App',
  data(){
    return {
      isPlaying:true,
      first:true,
      equipArr:[]
    }
    
  },
  methods:{
    //播放音频
      play(){
        let audio1 = document.getElementById('audio')
        console.log(audio1)
        if(this.isPlaying == true){
           console.log(2626)
          audio1.play()
        }else{
          audio1.pause()
        }
      },
      //停止音频
      stop(){
       let audio1 = document.getElementById('audio')
        audio1.pause()
      },
      changPlaying(val){
        console.log(val)
		 this.isPlaying = val
        if(!this.isPlaying&&!val) 
       
          this.play()
        
          
       
      },
     initWebSocket(){ //初始化weosocket
      console.log(251)
        const wsuri = "ws://47.115.89.236:8085/elderly/webSocket/123";
        // const wsuri = "ws://192.168.1.9:8085/webSocket/123";
        this.websock = new WebSocket(wsuri);
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(){ //连接建立之后执行send方法发送数据
        console.log('链接成功');
        // this.websocketsend(JSON.stringify(actions));
      },
      websocketonerror(){//连接建立失败重连
        console.log('链接失败');
        // this.initWebSocket();
      },
      websocketonmessage(e){ //数据接收
      if(e.data&&this.$route.name != 'Login'){
        let user = JSON.parse(sessionStorage.getItem('user'))
        if(user.account !== "admin"){
          if(this.first){
            console.log(user.organizationId)
            getOrgEquipment({id:user.organizationId}).then(res=>{
              if(res.code==0){
                this.first = false
                res.data.data.forEach(i => {
                  this.equipArr.push(i.code)
                });
                let data = JSON.parse(e.data)
                let bool = false
                data.forEach(i=>{
                  if(this.equipArr.includes(i.code)){
                    bool = true
                    return;
                  }
                })
                console.log("是否存在管理设备？ "+ bool)
                if(bool){
                  this.play()
                  if(this.$route.name == 'Home'){
                    this.$refs.Childmain.reloadPeople()
                    this.$refs.Childmain.getWarnList()
                  }
                }
              }

            }).catch(err=>{
              console.log(err)
            })
          }else{
            let data = JSON.parse(e.data)
                let bool = false
                data.forEach(i=>{
                  if(this.equipArr.includes(i.code)){
                    bool = true
                    return;
                  }
                })
                console.log("是否存在管理设备？ "+ bool)
                if(bool){
                  this.play()
                  if(this.$route.name == 'Home'){
                    this.$refs.Childmain.reloadPeople()
                    this.$refs.Childmain.getWarnList()
                  }
                }
          }
        }else{
          this.play()
          if(this.$route.name == 'Home'){
            this.$refs.Childmain.reloadPeople()
            this.$refs.Childmain.getWarnList()
          }
        }
	    }
      
        // const redata = JSON.parse(e.data);
      },
      websocketsend(Data){//数据发送
       console.log('发送1');
        this.websock.send(Data);
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
  },
  created(){
    
  },
  mounted(){
    this.initWebSocket()
  },
  destroyed(){
    this.websock.close() //离开路由之后断开websocket连接
  }
}
</script>
<style lang="scss">
		.audio-class {
		    height: 0;  // * 重要
		}
	</style>
