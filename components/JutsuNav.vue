<template>
  <nav class="navbar navbar-expand-lg bg-light jutsu-navbar">
    <div class="container-fluid">
      <a class="navbar-brand menu-color" href="#">Jutsu adminisztráció</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active menu-color"
               aria-current="page" href="/admin/jutsu/styles">Jutsu Stílusok</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active menu-color" aria-current="page" href="/admin/jutsu/comments">Megjegyzés típusok</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active menu-color" aria-current="page" href="/admin/users">Felhasználók</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active menu-color" aria-current="page" href="/jutsu/list">Jutsu lista</a>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <a @click="signOut" class="mb-lg-auto nav-link active hover-pointer logout-color">Kijelentkezés</a>
    </div>
  </nav>
</template>

<style scoped>

.jutsu-navbar {
  background-color: rgba(0,0,0,.11) !important;
}

.menu-color {
  color: #f58b00 !important;
}

.logout-color {
  color: red !important;
}

</style>
