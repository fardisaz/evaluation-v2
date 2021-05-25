import { createStore } from "vuex";
import IdeaServices from "./services/IdeaServices";
import Auth from "./Warehouse/Auth";
const store = createStore({
  modules: {
    Auth,
  },
  state: {
    ideas: [],
    idea: {},
  },
  mutations: {
    SET_IDEAS(state, ideas) {
      state.ideas = ideas;
    },
    UPDATE_IDEA(state, idea) {
      // update the position of the moved idea
      const index = state.ideas.findIndex((item) => {
        item.id === idea.id;
      });
      state.ideas[index] = idea;
    },
  },
  actions: {
    fetchIdeas({ commit }) {
      IdeaServices.getIdeas()
        .then((response) => {
          commit("SET_IDEAS", response.data);
        })
        .catch((error) => console.log(error));
    },
    changeIdeas({ commit, dispatch }, idea) {
      // the updated idea will be PUT to the server
      IdeaServices.putIdea(idea);
      // commit the mutation method
      commit("UPDATE_IDEA", idea);
      dispatch("fetchIdeas");
    },
  },
});
export default store;
