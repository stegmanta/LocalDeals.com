<template>
    <div>
        <br>
        <div class="card">
            <div class="card-body">
                <h2 class="text-primary">{{ location.LocationName }}</h2>
                <h5 class="text-secondary">{{ location.Category }}</h5>
                <iframe :src="location.GoogleMapEmbed" width="75%" height="auto" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                <br />
                <p>Location Description: <br> <strong>{{ location.LocationDescription }}</strong></p>
                <!-- <p>Budget: <br><strong>{{ formattedBudget }}</strong></p> -->
                <!-- <p>Summary: <br><strong>{{ location.Summary }}</strong></p> -->
            </div>
        </div>
        <br>
        <router-link v-if="auth" :to="`/Locations/${this.$route.params.id}/report`">
            <button class="btn btn-success">Create a Deal Report</button>
        </router-link>
        <router-link v-else :to="`/login`">
            <button class="btn btn-outline-success">Login to Create a Deal Report</button>
        </router-link>
        <br><br>
        <router-view />
    </div>
</template>
<script>
export default {
    computed: {
        location(){
            let allLocations = this.$store.state.locations;
            let thisLocation = allLocations.find((aLocation)=>{
                return aLocation.LocationID == this.$route.params.id;
            });
            // console.log(allLocations);
            return thisLocation;
        },
        auth(){
            return this.$store.state.token;
        }
    }
}
</script>
<style></style>