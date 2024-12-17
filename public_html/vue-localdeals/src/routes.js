import {createRouter, createWebHistory} from "vue-router";
import myStore from "./store.js";
import Home from "./components/Home.vue";
import Account from "./components/Account.vue";
// import CreateReport from "./components/CreateReport.vue";
import Login from "./components/Login.vue";
import LocationDetails from "./components/LocationDetails.vue";
import Locations from "./components/Locations.vue";
import NotFound from "./components/NotFound.vue";
import Signup from "./components/Signup.vue";
import CreateReport from "./components/CreateReport.vue";


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path: "/", component: Home},
        {path: "/account", component: Account, beforeEnter(to,from,next){
            if (myStore.state.token) {
                next(); //keep on rolling
            }
            else {
                next("/login"); //redirects to login page
            }
        }},
        {path: "/login", component: Login},
        {path: "/locations", component:Locations},
        {path: "/locations/:id", component: LocationDetails,//was pk
            children: [{path: "report", component:CreateReport, beforeEnter(to,from,next){
                if(myStore.state.token) {
                    next();
                }
                else{
                    next("/login")
                }
            }}] 
        },
        //{path: "/films/:pk", component: FilmDetails, 
                //children: [{path: "review", component: CreateReview}]},
        {path: "/signup", component: Signup},
        {path: "/:invalidroute(.*)",component: NotFound}
    ]
});
export default router;