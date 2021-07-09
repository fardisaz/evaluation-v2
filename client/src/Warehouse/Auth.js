import axios from "axios";
import router from "../router";

const state = {
  token: localStorage.getItem("token") || "",
  user: {},
  status: "",
  ideas: [],
  saved: false,
  error: null,
};
const getters = {
  isLoggedIn: (state) => !!state.token,
  authState: (state) => state.status,
  user: (state) => state.user,
  ideas: (state) => state.ideas,
  saved: (state) => state.saved,
  error: (state) => state.error,
  token: (state) => state.token,
};
const actions = {
  //Login Action
  async login({ commit }, user) {
    commit("auth_request");
    try {
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
    } catch (err) {
      commit("auth_error", err);
    }
  },
  //Register Action
  async register({ commit }, userData) {
    try {
      commit("register_request");
      let res = await axios.post(
        "http://localhost:5000/api/users/register",
        userData
      );
      if (res.data.success !== undefined) {
        commit("register_success");
      }
      return res;
    } catch (err) {
      commit("register_error", err);
    }
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
    console.log("Here is the ideaArr", ideaArray);
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
        novelAnswers: updatedIdea.novelAnswers,
        notNovelAnswers: updatedIdea.notNovelAnswers,
        similarIdeas: updatedIdea.similarIdeas,
      }
    );
    commit("SET_IDEAS", res.data);
  },
  //compare ideas
  async compareIdeas(_, payload) {
    let res = await axios.post("http://localhost:5000/api/users/similarity", {
      text1: payload.text1,
      text2: payload.text2,
    });
    return res.data.similarity;
  },
};
const mutations = {
  auth_request(state) {
    state.error = null;
    state.status = "loading";
  },
  auth_success(state, token, user) {
    state.token = token;
    state.user = user;
    state.status = "success";
    state.error = null;
  },
  auth_error(state, err) {
    state.error = err.response.data.msg;
  },
  register_request(state) {
    state.error = null;
    state.status = "loading";
  },
  register_success(state) {
    state.error = null;
    state.status = "success";
  },
  register_error(state, err) {
    state.error = err.response.data.msg;
  },
  logout(state) {
    state.error = null;
    state.status = "";
    state.token = "";
    state.user = "";
  },
  //Ideas Mutation
  SET_IDEAS(state, ideas) {
    state.ideas = ideas;
  },
  UPDATE_SAVED(state, saved) {
    state.saved = saved;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
