<script>

import offensiveIcon from 'assets/svg/katana.svg';
import defensiveIcon from 'assets/svg/shield.svg';
import utilityIcon from 'assets/svg/hand.svg';
import {Jutsu} from "../model/Jutsu";
import {JutsuFunctionality} from "../model/enum/JutsuFunctionality";


export default {
  name: 'JutsuFooter',
  props: {
    jutsu: Jutsu,
  },
  data() {
    return {
      defensiveIcon,
      offensiveIcon,
      utilityIcon,
      JutsuFunctionality
    }
  }
}
</script>

<style scoped>
  .footer-main {
    width: 100%;
    margin-top: 10px;
    height: 30px;
    display: flex;
    flex-direction: row-reverse;
  }

  .funtionality-icon {
    height: 30px;
  }

  /*.functionality {*/
  /*  border: solid thin green;*/
  /*  padding: 4px;*/
  /*}*/
</style>

<template>
  <div class="footer-main">
    <div class="functionality" v-if="jutsu.functionality === JutsuFunctionality.DEFENSIVE">
      <img :src="defensiveIcon" class="funtionality-icon" alt="functionality icon">
    </div>

    <div class="functionality" v-if="jutsu.functionality === JutsuFunctionality.OFFENSIVE">
      <img :src="offensiveIcon" class="funtionality-icon" alt="functionality icon">
    </div>

    <div class="functionality" v-if="jutsu.functionality === JutsuFunctionality.UTILITY">
      <img :src="utilityIcon" class="funtionality-icon" alt="functionality icon">
    </div>
  </div>

</template>
