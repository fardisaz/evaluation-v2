<template>
  <div class="row">
    <div class="card mx-auto">
      <div class="card-header text-white ">
        <h4>Login</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="loginUser">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              class="form-control"
              name="username"
              v-model="username"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="text"
              placeholder="Password"
              class="form-control"
              name="password"
              v-model="password"
            />
          </div>
          <input class="btn " type="submit" value="Login" />
          &nbsp;&nbsp;&nbsp;&nbsp;
          <router-link class="card-link" to="/register"
            >Need an account?</router-link
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["login"]),
    loginUser() {
      let user = {
        username: this.username,
        password: this.password,
      };
      this.login(user)
        .then((res) => {
          if (res.data.success) {
            this.$router.push("/import");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.card {
  width: 40%;
  padding: 0 0;
}
.card-header {
  background-color: #725e88;
}
.card-link {
  color: #725e88;
}
.card-link:hover {
  color: black;
}
.btn {
  background-color: #725e88;
  border: #725e88;
  color: white;
}
.form-control {
}
.form-group {
  padding-bottom: 1rem;
}
</style>
