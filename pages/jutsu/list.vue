<script>
import {jutsuList} from "../../model/constants/JutsuList";

export default {
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

