<template>
  <div>
    <Credits />
    <Nuxt />
  </div>
</template>

<style>
html {
  height: 100%;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: #f59e0b;
  animation: dynamicBg 10s infinite;

}

@keyframes dynamicBg {
  0% { background-color: #f59e0b; }
  25% {background-color: #6ee7b7;}
  75% {background-color: #3b82f6;}
  100% { background-color: #f59e0b;}
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

</style>
