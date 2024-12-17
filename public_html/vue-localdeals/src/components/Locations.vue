<template>
    <div class="margin-top-50">
        <h1>Locations</h1>
        <hr>
        <table class = "table">
            <thead>
                <tr>
                    <!--film pk, title, pitch-text, rating-->
                    <!-- <th>LocationID</th> -->
                    <th>Name</th>
                    <th>Description</th>
                    <th>Google Maps</th>
                    <th>Location Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aLocation in theLocations" :key="aLocation.LocationID">
                    <!-- <td> {{ aLocation.LocationID }}</td> -->
                    <td> {{ aLocation.LocationName }}</td>
                    <td> {{ aLocation.LocationDescription }}</td>
                    <td><iframe :src="aLocation.GoogleMapEmbed" width="300" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></td>
                    <td> {{ aLocation.Category }}</td>
                    <td>
                        <router-link :to="`/locations/${aLocation.LocationID}`">
                            <button class="btn btn-primary" >Details</button>
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <!-- <h1 v-for>this.$store.state.locations[0].GoogleMapEmbed</h1> -->
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        //no clue if this will work
        theLocations() {
            // console.log("in theLocations");
            // console.log(this.$store.state.locations);
            // console.log(this.$store.state.locations[0].GoogleMapEmbed);
            return this.$store.state.locations;
        }
        // theFilms() {
        //     return this.$store.state.films;
        // }
    }
};
</script>
    
<style>
    
</style>