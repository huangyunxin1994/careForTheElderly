<template>
  <div id="app">
    <audio id="audio" loop ref="music" >
        <source :src="musicSrc" type="audio/mpeg" />
    </audio>
    <router-view ref="Childmain" @changPlaying="changPlaying" @stop="stop" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      musicSrc:"/static/mp3/dididi.mp3",
      isPlaying:false
    }
    
  },
  methods:{
    //播放音频
      play(){
        let audio1 = document.getElementById('audio')
        if(this.isPlaying == true){
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
      },
     initWebSocket(){ //初始化weosocket
      console.log(251)
        const wsuri = "ws://192.168.1.9:8085/webSocket/123";
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
      console.log(e.data)
      console.log(this.$route.name)
      if(e.data=="欢迎123加入连接！") return
      if(this.$route.name == 'Home'){
        this.$refs.Childmain.reloadPeople()
        this.$refs.Childmain.getWarnList2(true)
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
    this.initWebSocket()
  },
  destroyed(){
    this.websock.close() //离开路由之后断开websocket连接
  }
}
</script>

