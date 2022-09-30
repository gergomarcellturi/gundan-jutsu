<script setup>

const options = reactive({
  test: 0,
})

const user = useGundanUser();
// export default {
//   signInWithGoogle,
//   signOut,
//   user: signedInUser,
// }
</script>

<template>
  <div>
    <JutsuNav></JutsuNav>

    <div class="main-menu">

  <pre>
    <span style="color: white" @click="options.test += 1">{{options.test}}</span>
  </pre>

      <pre style="color: white; border: solid thin red">
    {{user}}
  </pre>

      <button @click="signInWithGoogle" v-if="!user" class="menu-button login-button">Google Bejelentkezés</button>
      <a v-if="user" href="/admin/jutsu"><button class="menu-button">Jutsu adminisztráció</button></a>
      <NuxtLink  v-if="user" to="/admin/jutsu/styles"><button class="menu-button">Jutsu stílusok</button></NuxtLink>

      <a  v-if="user" href="/admin/jutsu/comments"><button class="menu-button">Megjegyzés típusok</button></a>

      <a  v-if="user" href="/admin/users"><button class="menu-button">Felhasználók</button></a>

      <a  v-if="user" href="/jutsu/list"><button class="menu-button">Jutsu lista</button></a>

      <button  v-if="user" @click="signOut" class="logout-button">Kijelentkezés</button>
    </div>


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

.login-button {
  border-color: green;
  color: green;
}

.logout-button {
  border-color: red;
  color: red;
}

</style>
