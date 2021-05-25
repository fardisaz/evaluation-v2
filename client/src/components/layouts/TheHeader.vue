<template>
  <!-- <header class="row">
    <button></button>
    <p>Novelty Evaluation</p>
  </header> -->
  <nav class="navbar navbar-expand-lg navbar-light customizedHeader">
    <div class="container-fluid">
      <router-link class="navbar-brand titleText" to="/"
        >Novelty Evaluation</router-link
      >
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link navText" to="/login" v-if="!isLoggedIn"
              >Login</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link navText"
              to="/register"
              v-if="!isLoggedIn"
              >Register</router-link
            >
          </li>
          <li class="nav-item">
            <a class="nav-link navText" to="/logout" v-if="isLoggedIn"
              >Logout</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
};
</script>

<style scoped>
.customizedHeader {
  background: rgb(187, 165, 196);
  color: #725e88;
  margin-bottom: 10px;
}
.titleText {
  color: #725e88;
  font-size: 30px;
}
.navText {
  color: #725e88;
}

a:active,
a:hover,
a.router-link-active {
  border: 1px solid #f391e3;
}

h1 {
  margin: 0;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

li {
  margin: 0 0.5rem;
}
</style>
