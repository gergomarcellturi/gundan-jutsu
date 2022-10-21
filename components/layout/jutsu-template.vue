<script>
import {Jutsu} from "../model/Jutsu";
import JutsuHeader from "./jutsu-header";
import JutsuBody from "./jutsu-body";
import JutsuImageCarousel from "./jutsu-image-carousel";
import JutsuFooter from "./jutsu-footer";
import {useJutsuStyleList} from "../../composables/useStates";

export default {
  name: 'JutsuTemplate',
  components: {JutsuFooter, JutsuImageCarousel, JutsuBody, JutsuHeader},
  props: {
    jutsu: Jutsu,
  },
  computed: {
    style() {
      return useJutsuStyleList().value.find(js => js.uid === this.jutsu.style.id)
    }
  }
}
</script>

<style>

</style>

<style scoped>
.jutsu-container {
  margin-top: 10px;
  margin-left: 10px;
  padding: 16px 8px 4px 8px;
  width: 400px;
  height: 450px;
  border: solid 2px #f58b00;
  border-radius: 2px;
  box-shadow: 0 0 8px #f58b00;
  transition: .4s;
}

.jutsu-container:hover {
  border-color: white !important;
  transition: .2s;
  cursor: pointer;
}

</style>

<template>

  <div
      :style="{
      'border-color': style.primaryColor,
      'box-shadow': `0 0 8px ${style.primaryColor}`
      }"
      class="jutsu-container">
    <JutsuHeader :jutsu="jutsu" :jutsuStyle="style"></JutsuHeader>
    <JutsuBody :jutsu="jutsu">
      <div class="carousel-container">
        <JutsuImageCarousel :jutsu="jutsu"></JutsuImageCarousel>
      </div>
    </JutsuBody>
    <JutsuFooter :jutsu="jutsu"></JutsuFooter>
  </div>


</template>
