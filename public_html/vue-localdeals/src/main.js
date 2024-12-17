import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios';
//router stuff
import myRouter from "./routes.js";
//add the store
import theStore from "./store.js";

//just need to put correct link and axios error will stop
axios.defaults.baseURL = "http://localhost:5000";
//axios.defaults.baseURL = "https://cisweb.biz.colostate.edu/cis410/fa23kinnett/rockwell-api";

const myApp = createApp(App);
myApp.use(myRouter);
myApp.use(theStore);
myApp.mount('#app');