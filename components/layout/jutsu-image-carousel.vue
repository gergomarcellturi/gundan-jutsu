<script>
// If you are using PurgeCSS, make sure to whitelist the carousel CSS classes
import 'vue3-carousel/dist/carousel.css';
import {Carousel, Slide, Pagination, Navigation} from 'vue3-carousel';
import {Jutsu} from "../model/Jutsu";

export default {
  name: 'JutsuImageCarousel',
  props: {jutsu: Jutsu},
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  }
};
</script>

<style scoped>

.image-element {
  height: 140px;
  width: 100%;
  background-size: cover;
  border-radius: 6px;
  box-sizing: border-box;
}
</style>

<template>
  <div class="image-element"
       :style="{'background-image': `url(${jutsu.image})`,
            'border-color': `${jutsu.style.primaryColor}`,
            'box-shadow': `0 0 8px ${jutsu.style.primaryColor}`
            }">
  </div>
</template>
