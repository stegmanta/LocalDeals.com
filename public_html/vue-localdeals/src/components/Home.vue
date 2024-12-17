<template>
    <div>
        <div class="container column main-border lighter-bg" style="padding:50px; margin-top:150px;">
            <div class="parent-container" >
                <div class="parent-container">
                    <div class="child-container">
                        <h1>Welcome to LocalDeals.com</h1>
                    </div>
                    <div class="child-container" style="padding: 0;">
                        <h5>Browse Fort Collins Locations</h5>
                    </div>
                </div>
            </div>
            <div class="parent-container">
                <div class="parent-container">
                    <router-link class="nav-link active" aria-current="page" to="/locations">
                        <div class="child-container">
                            <img class="img-fluid img-shadow rounded" src="../assets/oldtown.png" width="80%" height="auto">
                        </div>
                    </router-link>
                </div>
            </div>
            <br><br>
            <div class="parent-container">
                <router-link class="nav-link active" aria-current="page" to="/locations">
                        <div class="child-container">
                            <a type="button" class="btn btn-home text-white w-100" href="browseDeals.html" target="_blank">BROWSE FORT COLLINS LOCATIONS NOW!</a>
                        </div>
                </router-link> 
            </div>
        </div>
    </div>
</template>
<script></script>
<style></style>