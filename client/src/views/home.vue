<template>
  <div class="home">
    <div class="container">
      <h1 class="title">资金管理系统</h1>
      <p class="lead">前端：Vue全家桶、ElementUI</p>
      <p class="lead">后端：Express、Bcryptjs、JsonWebToken、MangoDB</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  position: fixed;
  background: url(../assets/showcase.png) no-repeat;
  background-size: cover;
}
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 100px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: white;
}
.title {
  font-size: 30px;
}
.lead {
  margin-top: 50px;
  font-size: 22px;
}
</style>