<script>
import JutsuTemplate from "../../components/layout/jutsu-template";
import {jutsuList} from "../../components/model/constants/JutsuList";

// const jutsus = useJutsuList().value
// console.log(jutsus);

export default {
  name: 'JutsuHome',
  components: {JutsuTemplate},
  data() {
    return {
      filter: '',
    }
  }
}

</script>

<style>
  .main {
    background-color: #171717;

  }

  .jutsu-list {
    display: flex;
    padding: 16px;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>

<template>

  <div class="main">

    <div class="filter-container">
      <input v-model="filter" class="gundan-input" placeholder="Szűrés">
    </div>

    <div class="jutsu-list"
         v-if="useJutsuList().value.length > 0 && useJutsuStyleList().value.length > 0">


      <JutsuTemplate v-for="jutsu in useJutsuList().value.filter(j => `${j.huName} ${j.jpName}`.toLowerCase().trim().includes(filter.toLowerCase().trim()))"
                     :jutsu="jutsu"></JutsuTemplate>
    </div>

  </div>



</template>

