<template>
  <JutsuNav></JutsuNav>

<div class="main-menu">
  <a href="/admin/jutsu">
    <button class="menu-button">Jutsu adminisztráció</button>
  </a>
  <a href="/admin/jutsu/styles"><button class="menu-button">Jutsu stílusok</button></a>

  <a href="/admin/jutsu/comments"><button class="menu-button">Megjegyzés típusok</button></a>

  <a href="/admin/users"><button class="menu-button">Felhasználók</button></a>

  <a href="/jutsu/list"><button class="menu-button">Jutsu lista</button></a>

  <button class="logout-button">Kijelentkezés</button>
</div>


</template>

<style scoped>

button {
  background-color: transparent;
  width: 100%;
  transition: .1s;
}

button:hover {
  border-color: aliceblue;
  color: aliceblue;
}

.main-menu {
  margin-top: 100px;
  display: flex;
  align-content: center;
  flex-direction: column;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.main-menu button {
  margin-bottom: 1rem;
}

.menu-button {
  color: #f58b00;
  border-color: #f58b00;
}

.logout-button {
  border-color: red;
  color: red;
}

</style>

<script>

</script>
