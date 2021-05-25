<template>
  <div class="row">
    <div class="card mx-auto">
      <div class="card-header text-white ">
        <h4>Register</h4>
      </div>
      <div class="card-body">
        <form>
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
          <button class="btn ">Register</button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <router-link class="card-link" to="/login"
            >Already have an account?</router-link
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
};
</script>

<style></style>
