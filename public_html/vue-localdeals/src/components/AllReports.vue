<template>
    <div class="margin-top-50">
        <h1>All Deals</h1>
        <hr>
        <p v-if="accountError">Unable to load deals</p>
        <br>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Reported By</th>
                    <th>Location</th>
                    <!-- <th>i</th> -->
                    <th>What is it</th>
                    <th>When is it</th>
                    <th>Original Price</th>
                    <th>Savings Estimate</th>
                    <th>Limited Time?</th>
                    <th>Date Discovered</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="thisReport in allReports" :key="thisReport.ReportID">
                    <td>{{ thisReport.FirstName }}</td>
                    <td>{{ thisReport.LocationName }}<br>
                        <iframe :src="thisReport.GoogleMapEmbed" width="100" height="100" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </td>
                    <td>{{ thisReport.DescWhat }}</td>
                    <td>{{ thisReport.DescWhen }}</td>
                    <td>{{ formattedDollars(thisReport.OriginalPrice) }}</td>
                    <td>{{ formattedDollars(thisReport.DiscountAmount) }}</td>
                    <td>
                        <h6 v-if="thisReport.IsLimitedTime === 'True'">&#x2705;</h6>
                        <h6 v-else>&#x274C;</h6>
                    </td>
                    <td>{{ thisReport.DateDiscovered.split('T')[0] }}</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios';
export default{
    data(){
        return{
            allReports:[],
            error: false
        }
    },
    methods: {
            formattedDollars(dollarValue){
                return new Intl.NumberFormat("en-US",{
                    style: "currency",
                    currency: "USD"
                }).format(dollarValue)
            }
        },
    created(){
        axios.get("/All/Reports",{
        })
        .then((theResponse)=>{
            this.allReports = theResponse.data
        })
        .catch((err)=>{
            console.log("Error getting all user reports", err)
            this.error = true;
        })
    }
}
</script>
<style></style>