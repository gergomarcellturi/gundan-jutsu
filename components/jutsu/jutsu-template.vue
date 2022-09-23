<script>
import JutsuHeader from "./jutsu-header";
import JutsuBody from "./jutsu-body";
import JutsuImageCarousel from "./jutsu-image-carousel";
import JutsuFooter from "./jutsu-footer";
import {Jutsu} from "../../model/Jutsu";

export default {
  name: 'JutsuTemplate',
  components: {JutsuFooter, JutsuImageCarousel, JutsuBody, JutsuHeader},
  props: {
    jutsu: Jutsu,
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
  height: 470px;
  border: solid 2px #f58b00;
  border-radius: 2px;
  box-shadow: 0 0 8px #f58b00;
}

/*.carousel-container {*/
/*  width: 225px;*/
/*}*/
</style>

<template>
  <!--  {{jutsu}}-->

  <div
      :style="{
      'border-color': jutsu.type.primaryColor,
      'box-shadow': `0 0 8px ${jutsu.type.primaryColor}`
      }"
      class="jutsu-container">
    <JutsuHeader :jutsu="jutsu"></JutsuHeader>
    <JutsuBody :jutsu="jutsu">
      <div class="carousel-container">
        <JutsuImageCarousel :jutsu="jutsu"></JutsuImageCarousel>
      </div>
    </JutsuBody>
    <JutsuFooter :jutsu="jutsu"></JutsuFooter>
  </div>


</template>
