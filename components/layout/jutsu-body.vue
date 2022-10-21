<script>
import JutsuImageCarousel from "./jutsu-image-carousel";

import ninjaCouncilLogo from "assets/svg/ninjacouncilIcon.svg";
import moderatorLogo from "assets/svg/moderatorIcon.svg";
import gearLogo from "assets/svg/gear.svg";
import infoLogo from "assets/icons/info.png";
import {Jutsu} from "../model/Jutsu";
import {Restriction} from "../model/enum/Restriction";
import {useJutsuList} from "../../composables/useStates";

let rankMap = {
  Splus: '#e0b302',
  S: '#edca40',
  A: '#06b835',
  B: '#264ede',
  C: '#aa06cf',
  D: '#b51628',
  E: '#ababab',
};

export default {
  name: 'JutsuBody',
  props: {
    jutsu: Jutsu,
  },
  components: [JutsuImageCarousel],
  data() {
    return {
      rankMap,
      ninjaCouncilLogo,
      moderatorLogo,
      gearLogo,
      infoLogo,
      Restriction
    }
  },
  computed: {
    jutsuReq() {
      return useJutsuList().value.filter(j => this.jutsu.jutsuRequirements.map(r => r.id).includes(j.uid))
    }
  }
}
</script>

<style scoped>
.body {
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.carousel-container {
  height: 140px;
  width: 225px;
  margin-left: 4px;
  border-radius: 6px;
}

.basic-info-container {
  max-height: 140px;
  width: 160px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.info-bar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}

.image-container {
  background-size: contain;
  width: 26px;
  height: 26px;
}

.chakra-image {
  background-image: url("assets/icons/chakra.png");
}

.rank-image {
  background-image: url("assets/icons/rank.png");
  margin-left: 6px;
}

.chara-label {
  font-weight: bold;
  color: #f7efd0;
  font-size: 26px;
  text-shadow: 0 0 4px white;
}

.upper-part {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.lower-part {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  /*justify-content: flex-start;*/
}

.restriction-row {
  height: 26px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.requirement-row {
  /*height: 26px;*/
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.logo {
  margin-top: 6px;
  margin-left: 1px;
  margin-right: 8px;
}

.restriction-logo {
  height: 26px;
}

.requirement-item {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  width: 155px;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 2px;
}

.requirement-logo {
  height: 14px;
}

.requirement-text {
  font-size: 12px;
  font-weight: bolder;
  font-style: italic;
  color: #d4d0c9;
  text-shadow: 0 0 6px #f58b00;
  margin-left: 4px;
  text-overflow: ellipsis;
}

.requirement-text-hun {
  font-size: 12px;
  font-weight: lighter;
  color: #242323;
  text-shadow: 0 0 1px #575757;
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description-container {
  /*border: solid thin red;*/
  height: 200px;
  width: 375px;
  overflow-y: scroll;
  padding-right: 18px;
  margin-top: 8px;
  margin-left: 8px;
}

.description {
  margin-top: 0;
  margin-bottom: 10px;
  color: #f7eacd;
}

.info-logo {
  height: 16px;
  margin-right: 4px;
  /*fill: red;*/
}

/* width */
::-webkit-scrollbar {
  width: 3px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f111;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f58b00;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f58b00aa;
}
</style>

<template>

  <div class="body">

    <div class="info-container">
      <div class="carousel-container" v-if="jutsu.image">
        <div class="carousel-container">
          <slot/>
        </div>
      </div>
      <div class="basic-info-container">
        <div class="upper-part">
          <div class="info-bar">
            <div class="image-container chakra-image"></div>
            <span class="chara-label">{{jutsu.chakra}}</span>
          </div>
          <div class="info-bar">
            <div class="image-container rank-image"></div>
            <span
                :style="{color: rankMap[jutsu.rank], textShadow: 'none'}"
                class="chara-label">{{jutsu.rank}}</span>
          </div>
        </div>

        <div class="lower-part" v-if="jutsu.restriction > 0 || jutsu.jutsuRequirements.length > 0">
          <div class="restriction-row">
            <div class="logo" v-if="jutsu.restriction === Restriction.ENGEDELYES">
              <img :src="ninjaCouncilLogo" class="restriction-logo" alt="nt logo">
            </div>
            <div class="logo" v-if="jutsu.restriction === Restriction.ENGEDELYES">
              <img :src="moderatorLogo" class="restriction-logo" alt="nt logo">
            </div>
          </div>

          <div class="requirement-row" v-if="jutsuReq.length > 0">
            <div class="requirement-item" v-for="req in jutsuReq">
              <img :src="gearLogo" class="requirement-logo">
              <span class="requirement-text">{{req.jpName}}</span>
              <span class="requirement-text-hun">{{req.huName}}</span>
            </div>
          </div>


        </div>
      </div>
    </div>

    <div class="description-container">
      <p :style="{color: '#EF5F5F'}" v-if="jutsu.info"
         class="description">
        <img class="info-logo" :src="infoLogo">
        {{jutsu.info}}
      </p>

      <p class="description">
        {{jutsu.description}}
      </p>
    </div>

  </div>

</template>
