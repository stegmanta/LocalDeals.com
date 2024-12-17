import {createStore} from 'vuex';
import axios from 'axios';
import myRoutes from './routes.js';

export default createStore({
    //3 sections of store
    //1. state
    state: {
        token: null,
        user: null,
        locations:[]
    },
    //2. mutations
    mutations: {
        storeTokenInApp(state,myToken){
            console.log("calling storeToken mutator");
            state.token = myToken;
        },
        storeUserInApp(state,theUser){
            //console log as needed
            state.user = theUser;
        },
        storeLocations(state, locations){
            state.locations = locations;
        },
        //help with logout
        clearAuthData(state){
            state.token=null;
            state.user=null;
        }
    },
    //3. actions (fetch from axios)
    actions: {
        getLocations({commit}) {
            axios.get("/Locations")
                .then((aResponse)=>{
                    commit("storeLocations",aResponse.data);
               });
        },
        logout({commit,state}){
            axios.post("/Member/logout",null,{
                headers: {Authorization: `Bearer ${state.token}`}
            })
                .then(()=>{
                    commit("clearAuthData");
                    myRoutes.replace("/"); //redirect user to the root of app
                })
                .catch((err)=>{
                    console.log("error in logout",err);
                });
        }
    }
});