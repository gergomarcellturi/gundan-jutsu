<script>
import {Jutsu} from "../model/Jutsu";

export default {
  name: 'JutsuHeader',
  props: {
    jutsu: Jutsu,
  }
}
</script>

<style scoped>
.header-container {
  width: 100%;
  /*border: solid thin green;*/
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 8px;
}

.kanji-container {
  margin-right: 8px;
  font-size: 50px;
  font-family: "nagayama_kai08", serif;
  width: 50px;
  height: 50px;
  text-align: center;
  border-radius: 1em;
  /*background-color: #a86f32;*/
  z-index: 1;
  color: #171717;
}

.name-container {
  display: flex;
  flex-direction: column;
  width: 100%;

}

.divider {
  width: 90%;
  height: 2px;
  /*height: 26px;*/
  background-color: #f58b0044;
  border-radius: 1em;
  margin-top: 6px;
  margin-bottom: -1px;
}

.jutsu-name {
  font-size: 17px;
  color: #d4d0c9;
  text-shadow: 0 0 6px #f58b00;
  font-style: italic;
  font-weight: bolder;
  z-index: 1;
  letter-spacing: 1px;
  background-color: #171717;
}

.hungarian-name {
  font-family: "ComicSansMS3", serif;
  z-index: 1;
}

.japanese-name {
  font-family: "nagayama_kai08", serif;
}

</style>

<template>
  <div class="header-container">
    <div
        :style="{border: `1px solid ${jutsu.type.secondaryColor}`,
                 'box-shadow': `0 0 3px ${jutsu.type.secondaryColor}`,
                 background: `radial-gradient(${jutsu.type.secondaryColor}, ${jutsu.type.primaryColor})`
        }"
        class="kanji-container">
      {{ jutsu.kanji }}
    </div>
    <div class="name-container">
      <div class="japanese-name jutsu-name">{{ jutsu.jpName }}</div>
      <div class="divider"/>
      <div class="hungarian-name jutsu-name">{{ jutsu.huName }}</div>
    </div>
    <!--    <div class="header-gradient"></div>-->
  </div>
</template>
