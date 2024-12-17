<template>
  <div class="d-flex flex-column min-vh-100">
    <my-header />
    <div class="container-fluid flex-grow-1">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-7">
          <router-view />
        </div>
      </div>
    </div>
    <my-footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
export default {
  name: 'App',
  components: {
    "my-header": Header,
    "my-footer": Footer
  },
  created(){
    this.$store.dispatch("getLocations")
  }
};
</script>

<style>
.d-flex { 
    display: flex; 
    flex-direction: column; 
    min-height: 100vh; 
} 
.flex-grow-1 { 
    flex-grow: 1;
 }

footer {
    text-align: center;
    padding: 50px;
    margin-top: auto;
    font-size: 14px;
    background-color: gainsboro;
}

.parent-container  {
    /* border: 3px dashed red; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.child-container  {
    padding: 20px;
    display: flex;
    /* border: 3px solid green; */
    justify-content: center;
    align-items: center;
}

.container {
    /* border: solid yellow; */
    display: flex;
    justify-content: center;
    align-items: center;
}

.item {
    /* border: solid red; */
    padding: 20px;
}

.item-no-padding {
    /* border: solid red; */
    padding: 5px;
}

.item-title {
    padding: 30px;
    text-decoration: underline;
}

.space-between {
    justify-content: space-between;
}

.space-evenly {
    justify-content: space-evenly;
}

.border {
    border: solid black;
}

.flex-wrap {
    flex-wrap: wrap;
}

.column {
    flex-direction: column;
}

.img-shadow {
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.40);
}

.dark-bg {
    background-color: #36454f;
    color:white;
}

.lighter-bg {
    background-color: #6e7f80;
    color:azure
}

.main-border{
    border: 2mm ridge rgba(83, 104, 120, .6);
}

.btn-home {
    background-color: #708090;
    border-color: #708090;
}

.btn-home:hover {
    background-color: #5a6b76;
}
.btn-darker {
    background-color: #606078; /* Slightly darker shade */
    color: white;
    padding: 10px 20px; /* Ensure it looks like a button */
    border-radius: 4px; /* Optional: Add border radius for rounded corners */
    transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.btn-darker:hover {
    background-color: #505068; /* Even darker shade on hover */
}

.margin-top-50 {
    margin-top: 50px;
}

</style>
