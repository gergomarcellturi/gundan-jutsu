<script>

import {JutsuStyle} from "../../../model/JutsuStyle";
import firebase from "firebase/compat";

// const styleList = useJutsuStyles().value;
// console.log(styleList);

export default {
  data() {
    return {
      filter: '',
      temp: null,
      selectedJutsuStyle: new JutsuStyle(),
      kanji: '',
      name: '',
      primaryColor: '',
      secondaryColor: '',
      saveStyle() {
        const {kanji, primaryColor, secondaryColor, name, uid} = this.selectedJutsuStyle;
        if (!kanji || !primaryColor || !secondaryColor || !name) return;
        const store = firebase.firestore();
        if (!uid) {
          store.collection('styles').add({
            kanji, primaryColor, secondaryColor, name
          }).then(snap => {
            snap.set({uid: snap.id}, {merge: true});
            this.reset();
          });
        }
        else {
          store.doc(`styles/${uid}`).set({
            kanji, primaryColor, secondaryColor, name
          }, {merge: true}).then(() => this.reset())
        }

      },
      deleteStyle() {
        const {uid} = this.selectedJutsuStyle;
        const store = firebase.firestore();
        store.doc(`styles/${uid}`).delete().then(() => this.reset());
      },
      reset() {
        this.selectedJutsuStyle = new JutsuStyle();

      }
    }
  }
}

</script>

<template>

  <div>
    <JutsuNav></JutsuNav>

    <div class="nav-button-container">
      <NuxtLink to="/"><button class="gundan-button">Vissza</button></NuxtLink>
    </div>

    <div class="admin-panel">
      <h2>Jutsu Stílusok kezelése</h2>


      <div class="add-container">
        <input v-model="selectedJutsuStyle.kanji" class="gundan-input style-input kanji-input" placeholder="Kanji">
        <input v-model="selectedJutsuStyle.name" class="gundan-input style-input" placeholder="Név">
        <input v-model="selectedJutsuStyle.primaryColor" class="gundan-input style-input" placeholder="Elsődleges szín">
        <input v-model="selectedJutsuStyle.secondaryColor" class="gundan-input style-input" placeholder="Másodlagos szín">
      </div>
      <div class="button-container">
        <button @click="saveStyle" class="gundan-button gundan-button-accept">{{ selectedJutsuStyle.uid ? 'Módosítás' : 'Hozzáadás' }}</button>
        <button v-if="selectedJutsuStyle.uid" @click="deleteStyle" class="gundan-button gundan-button-alert">Törlés</button>
      </div>
    </div>


    <div class="horizontal-divider"></div>

    <h3 style="margin-top: 2rem">Jutsu stílusok</h3>

    <div class="filter-container">
      <input v-model="filter" class="filter-input gundan-input" placeholder="Szűrés">
    </div>


    <table class="style-table">
      <tr>
        <th>Kanji</th>
        <th>Név</th>
        <th>Elsődleges szín</th>
        <th>Másodlagos szín</th>
        <th>Kezelés</th>
      </tr>

      <tr v-for="style of useJutsuStyles().value.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))"
      :class="{'selected': style.uid === selectedJutsuStyle.uid}"
      >
        <td>
          <div
              :style="{border: `1px solid ${style.secondaryColor}`,
                 'box-shadow': `0 0 3px ${style.secondaryColor}`,
                 background: `radial-gradient(${style.secondaryColor}, ${style.primaryColor})`
        }"
              class="kanji-container">
            {{ style.kanji }}
          </div>
        </td>
        <td><span>{{style.name}}</span></td>
        <td><span class="color-text" :style="{color: style.primaryColor}">{{style.primaryColor}}</span></td>
        <td><span class="color-text" :style="{color: style.secondaryColor}">{{style.secondaryColor}}</span></td>
        <td>
          <button
              v-if="!selectedJutsuStyle.uid" @click="selectedJutsuStyle = {...style};"
              class="gundan-button">Módosítás</button>
          <button
              v-if="selectedJutsuStyle.uid === style.uid" @click="reset"
              class="gundan-button gundan-button-warn">Mégsem</button>
        </td>
      </tr>


    </table>
  </div>


</template>

<style scoped>

.nav-button-container {
  margin: 2rem;
}

.filter-container {
  width: 100%;
  margin: 2rem;
}

.filter-input {
  min-width: 200px;
  width: 30%;
}

.style-input {
  margin-top: 1rem;

}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.button-container button {
  margin: 12px 6px;
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
  line-height: 50px;
  color: #171717;
}

.style-table {
  border-radius: 4px;
  width: 90%;
  margin: 1rem auto;
}

.style-table th {
  color: #f7eacd;
  padding: 8px;
}

.style-table td {
  color: #f7eacd88;
  padding: 8px;
}

.style-table tr:nth-child(2) {
  background-color: rgba(0,0,0,.01);
}

.color-text {
  font-weight: bold;
  text-transform: uppercase;
}

.add-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  margin: 2rem;
}
tr {
  transition: .2s;
}

.selected {
  background-color: #f58b0011;
}

</style>
