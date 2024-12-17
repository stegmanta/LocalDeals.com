<template>  
   <div>
    <div class = "row justify-content-center">
        <div class = "col-log-10">
            <div class = "card">
                <div class = 'card-body'>
                    <h4>Create a Report</h4>
                    <form id = "review-form" @submit.prevent = "submitReport">
                        <div class = 'mb-3'>
                            <label for = "DescWhat-input" class = "form-label">
                                What is the deal?
                            </label>
                            <input type = "text" id = "DescWhat-input" class = "form-control" required v-model = "descWhat"
                            placeholder="What item and price is associated with the deal">
                        </div>
                        <div class = "mb-3">
                            <label for = "DescWhen-input" class = "form-label">When is the deal?</label>
                            <input type = "text" id = "DescWhen-input" class = "form-control" required row = "3" v-model = "descWhen" 
                            placeholder="Days of the week, time range, or specific date the deal occurs">
                        </div>
                        <div class = "mb-3">
                            <label for = "OriginalPrice-input" class = "form-label">Original Price</label>
                            <div class="input-group">
                                    <span class="input-group-text">$</span>
                                <input type = "number" min = "0.01" step="0.01" max="10000" id = "OriginalPrice-input" class = "form-control" v-model = "originalPrice"
                                placeholder="Educated guess on the item's original price" required>
                            </div>
                        </div>
                        <div class = "mb-3">
                            <label for = "DiscountAmount-input" class = "form-label">Discount Amount</label>
                            <div class="input-group">
                                    <span class="input-group-text">$</span>
                            <input type = "number" min = "0.01" step = "0.01" max="10000" id = "DiscountAmount-input" class = "form-control" v-model = "discountAmount"
                            placeholder="(Original price - price associated with deal)" required>
                            </div>
                        </div>
                        <div class = "mb-1">
                            <label for = "IsLimitedTime-input" class = "form-label">Is the deal limited time (select)</label>
                                <select id="IsLimitedTime-input" class="form-select" v-model="isLimitedTime" required>
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                </select>
                        </div>
                        <button type = "submit" class = "btn btn-primary">Submit</button>
                        <button type = "reset" class = "btn btn-outline-danger" v-on:click = "cancelReport">Cancel</button>
                        <p class = "form-text text-danger" v-if = "errorMessage">{{ errorMessage }}</p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
   </template>
   <script>
   import axios from 'axios';
   export default {
       data(){
           return {
               descWhat: "",
               descWhen: "",
               originalPrice: null,
               discountAmount: null,
               isLimitedTime: "",
               errorMessage: ""
           }
       },
       methods: {
           submitReport() {
               //package up review into object
                const myReport = {
                descWhat: this.descWhat,
                descWhen: this.descWhen,
                originalPrice: this.originalPrice,
                discountAmount: this.discountAmount,
                locationID: this.$route.params.id,
                isLimitedTime: this.isLimitedTime
                };
               axios.post("/Report",myReport,{
                   headers: {
                       Authorization: `Bearer ${this.$store.state.token}`
                   }
               })
               .then(()=>{
                   //if successful, redirect user to account page
                   this.$router.replace("/account");
               })
               .catch(()=>{
                   this.errorMessage="Unable to create review :/";
               });
               //else populate error message
           },
           cancelReport() {
               this.$router.go(-1); //go back one route
           }
       }
   };
   </script>
   <style></style>