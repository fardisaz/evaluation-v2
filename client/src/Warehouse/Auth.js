import axios from "axios";
import router from "../router";

const state = {
  token: localStorage.getItem("token") || "",
  user: {},
  status: "",
  ideas: [],
};
const getters = {
  isLoggedIn: (state) => !!state.token,
  authState: (state) => state.status,
  user: (state) => state.user,
  ideas: (state) => state.ideas,
};
const actions = {
  //Login Action
  async login({ commit }, user) {
    commit("auth_request");
    let res = await axios.post("http://localhost:5000/api/users/login", user);
    if (res.data.success) {
      const token = res.data.token;
      const user = res.data.user;
      //Store the token into the local storage
      localStorage.setItem("token", token);
      //Set the axios defaults
      axios.defaults.headers.common["Authorization"] = token;
      commit("auth_success", token, user);
    }
    return res;
  },
  //Register Action
  async register({ commit }, userData) {
    commit("register_request");
    let res = await axios.post(
      "http://localhost:5000/api/users/register",
      userData
    );
    if (res.data.success !== undefined) {
      commit("register_success");
    }
    return res;
  },
  //Logout Action
  async logout({ commit }) {
    await localStorage.removeItem("token");
    commit("logout");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
    return;
  },
  async fetchIdeas({ commit }) {
    let res = await axios.get("http://localhost:5000/api/users/profile");
    const ideas = res.data.user.ideas;
    commit("SET_IDEAS", ideas);
    //return ideas;
  },
  //import descriptions
  async importDescription({ commit }, ideaArray) {
    let res = await axios.patch(
      "http://localhost:5000/api/users/import",
      ideaArray
    );
    commit("SET_IDEAS", res.data);
  },
  //update ideas
  async updateIdea({ commit }, updatedIdea) {
    let res = await axios.patch(
      "http://localhost:5000/api/users/ideas/" + updatedIdea._id,
      {
        position: updatedIdea.position,
        classification: updatedIdea.classification,
        answers: updatedIdea.answers,
        similarIdeas: updatedIdea.similarIdeas,
      }
    );
    commit("SET_IDEAS", res.data);
  },
};
const mutations = {
  auth_request(state) {
    state.status = "loading";
  },
  auth_success(state, token, user) {
    state.token = token;
    state.user = user;
    state.status = "success";
  },
  register_request(state) {
    state.status = "loading";
  },
  register_success(state) {
    state.status = "success";
  },
  logout(state) {
    state.status = "";
    state.token = "";
    state.user = "";
  },
  //Ideas Mutation
  SET_IDEAS(state, ideas) {
    state.ideas = ideas;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
