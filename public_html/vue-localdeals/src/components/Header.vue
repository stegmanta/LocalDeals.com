<template>

    <nav class="navbar navbar-expand-lg" style="background-color: #708090;">
            <div class="container-fluid">
            <router-link class="navbar-brand text-white" to="/">
                <img src="../assets/LocalDealsLogo.png" alt="logo" height="100" width="100" class="d-inline-block rounded-circle">
            </router-link>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item me-3">
                        <router-link class="nav-link btn-darker active" aria-current="page" to="/Locations">Locations</router-link>
                    </li>
                    <li v-if="auth" class="nav-item me-2">
                        <router-link class="nav-link active btn-darker" aria-current="page" to="/account">My Account</router-link>
                    </li>
                    <li v-if="!auth" class="nav-item me-2">
                        <router-link class="nav-link active" to="/login">
                            <button class="btn btn-outline-warning">Login</button>
                        </router-link>
                    </li>
                    <li v-if="!auth" class="nav-item me-2">
                        <router-link class="nav-link active" aria-current="page" to="/signup">
                            <button class="btn btn-outline-warning">Sign Up</button>
                        </router-link>
                    </li>
                    <li v-if="auth" class="nav-item me-2">
                        <router-link class="nav-link active" aria-current="page" to="/logout">
                            <button class="btn btn-warning" @click="onLogout()">Logout</button>
                        </router-link>
                    </li>
                </ul>
            </div>
            </div>
    </nav>
  </template>
  <script>
  export default {
    computed: {
        auth() {
            return this.$store.state.token;
        }
    },
    methods: {
        onLogout(){
            this.$store.dispatch("logout");
        }
    }
  }
  </script>
  <style scoped>
    .navbar-nav {
        align-items: center;
    }
  </style>