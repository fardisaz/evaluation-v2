import { createStore } from "vuex";
import Auth from "./Warehouse/Auth";
const store = createStore({
  modules: {
    Auth,
  },
});
export default store;
