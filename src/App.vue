<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

/* 将消息提示定位到左下角 */
.el-message {
  top: auto !important;
  bottom: 20px;
  left: 220px !IMPORTANT;
  right: auto !important;
  min-width: 200px; /* 可选：调整最小宽度 */
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

router-view {
  flex: 1;
  display: flex;
}
</style>
