<template>
  <div class="about">
    <h1 v-for="i in 100">This is an about page{{i}}</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    //min-height: 100vh;
    height: 100%;
    background: pink;
    overflow-y: auto;
  }
}
</style>
