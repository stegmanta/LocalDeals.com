<template>
    <div class="margin-top-50">
        <h1>Account</h1>
        <hr>
        <h3 v-if="firstName" class="text-secondary">{{ firstName }}'s Reported Deals</h3>
        <p v-if="accountError">Unable to load current user's report</p>
        <br>
        <!-- check if  -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Location</th>
                    <!-- <th>i</th> -->
                    <th>What is it</th>
                    <th>When is it</th>
                    <th>Original Price</th>
                    <th>Savings Estimate</th>
                    <th>Limited Time?</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="thisReport in reportsByUser" :key="thisReport.ReportID">
                    <td>{{ thisReport.LocationName }}<br>
                        <iframe :src="thisReport.GoogleMapEmbed" width="100" height="100" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </td>
                    <!-- <td><img class="img-fluid img-shadow" :src="require('../assets/LocationPictures/' + thisReport.LocationID[0] + '.jpg')" ></td> -->
                    <td>{{ thisReport.DescWhat }}</td>
                    <td>{{ thisReport.DescWhen }}</td>
                    <td>{{ formattedDollars(thisReport.OriginalPrice) }}</td>
                    <td>{{ formattedDollars(thisReport.DiscountAmount) }}</td>
                    <td>
                        <h6 v-if="thisReport.IsLimitedTime === 'True'">&#x2705;</h6>
                        <h6 v-else>&#x274C;</h6>
                    </td>
                </tr> 
            </tbody>
        </table>
        <h4 v-if="reportsByUser.length === 0">The current user has 0 reported deals, browse locations to report a new deal!</h4>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            // What would the reviewsbyUser be in our case?
            reportsByUser: [],
            accountError: false
        };
    },
        computed: {
            firstName(){
                if(this.$store.state.user) {
                    return this.$store.state.user.firstName;
                }
                else {
                    return "";
                }
            },
        },
        methods: {
            formattedDollars(dollarValue){
                return new Intl.NumberFormat("en-US",{
                    style: "currency",
                    currency: "USD"
                }).format(dollarValue)
            }
        },
        created() {
            // /reviews/me could be /account?
            axios.get("/Member-reports",{
                headers: {
                    Authorization: `Bearer ${this.$store.state.token}`
                }
            })
            .then((theResponse)=>{
                this.reportsByUser=theResponse.data
            })
            .catch((err)=>{
                console.log("error fetching current user account",err);
                this.accountError = true;
            });
        }
};
</script>

<style>

</style>