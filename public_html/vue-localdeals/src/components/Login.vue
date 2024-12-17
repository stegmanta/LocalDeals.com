<template>
    <div>
        <h1 class="margin-top-50">Login</h1>
        <form @submit.prevent="onSubmit" class="margin-top-50">
            <div class = "mb-3">
                <label for="email-input" class="form-label">Email</label>
                <input type="email" class = "form-control" id="email-input" required placeholder="Enter email" v-model="email">
            </div>
            <div class = "mb-3">
                <label for="password-input" class="form-label">Password</label>
                <input type="password" class = "form-control" id="password-input" required placeholder="Enter password" v-model="password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
            <p v-if="credentialsError" class = "form-text text-danger">Invalid Credentials</p>
            <p v-if="loginError" class="form-text text-danger">Error with login, please try again later</p>
        </form>
    </div>
</template>    
<script>
import axios from 'axios';
export default {
    data(){
        return {
            email: "",
            password: "",
            loginError: false,
            credentialsError: false 
        }
    },
    methods: {
        onSubmit() {
            const myFormData = {
                email: this.email,
                password: this.password
            };
            //check/change the "/contacts/login"
            axios.post("/Member/login",myFormData)
                .then((myResponse)=>{
                    //console logs
                    //commit to store via mutators
                    this.$store.commit("storeTokenInApp",myResponse.data.token);
                    this.$store.commit("storeUserInApp", myResponse.data.user);
                    //redirect the user to the account page
                    this.$router.replace("/account");
                })
                .catch((err)=>{
                    this.credentialsError = true;
                    console.log("error in login",err);
                });
        }
    }
}
</script>
<style>
</style>