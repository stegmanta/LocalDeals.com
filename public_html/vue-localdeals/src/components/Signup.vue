<template>
    <div>
        <h1 class="margin-top-50">Sign up</h1>
        <form @submit.prevent="onSubmit" class="margin-top-50">
            <div class = "mb-3">
                <label for="fnameInput" class = "form-label">First Name</label>
                <input type = "text" class = "form-control" id =fnameInput required placeholder="First Name" v-model="firstName">
            </div>
            <div class = "mb-3">
                <label for="lnameInput" class = "form-label">Last Name</label>
                <input type ="text" class="form-control" id = "lnameInput" 
                required placeholder="Last Name" v-model = "lastName">
            </div>
            <div class = "mb-3">
                <label for="email" class = "form-label">Email</label>
                <input type ="email" class ="form-control" id ="email" required placeholder ="Enter email" v-model="email">
            </div>
            <!-- add v-if for email error message -->
             <small v-if="dupEmail" class="text-danger">Please choose a different email</small>
            <div class = "mb-3">
                <label for="password" class = "form-label">Password</label>
                <input type = "password" class="form-control" id ="password" 
                required placeholder="Enter password" v-model = "password">
            </div>
            <!-- submit button and general error display -->
             <button type="submit" class="btn btn-primary">Submit</button>
             <p id="error-signup" class='text-danger'>{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            errorMessage: "",
            dupEmail: false
        }
    },
    methods: {
        onSubmit(){   
            const myFormData = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password
            };
            console.log("Signup Form submmitted");
            //post to axios and signup endpoint
            
            axios.post("/Member/signup",myFormData)
                .then((myResponse)=>{
                    console.log("made it to then")
                    console.log("response:",myResponse);
                    this.$router.replace("/login");//FIXME
                })
                .catch((err)=>{
                    console.log("Made it to the err");
                    console.log(err);
                    if (err.response.status===409){
                        this.dupEmail=true;
                    }
                    else {
                        this.errorMessage="General signup error, please try again";
                    }
                });
        }
    }
};


</script>
<style>

</style>