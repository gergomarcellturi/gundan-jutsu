<script>
import JutsuTemplate from "../../components/layout/jutsu-template";
import {jutsuList} from "../../components/model/constants/JutsuList";

export default {
  name: 'JutsuHome',
  components: {JutsuTemplate},
  data() {
    return {jutsuList}
  }
}

</script>

<style>
  .main {
    display: flex;
    background-color: #171717;
    padding: 16px;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>

<template>
  <div class="main">
    <JutsuTemplate v-for="jutsu in jutsuList"
                   :jutsu="jutsu"></JutsuTemplate>
  </div>

</template>

