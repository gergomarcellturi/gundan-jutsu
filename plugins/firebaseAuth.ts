import {useJutsuList, useJutsuStyleList} from "~/composables/useStates";
import firebase from "firebase/compat";
import {defineNuxtPlugin} from "#app";
import initializeApp = firebase.initializeApp;

export default defineNuxtPlugin(nuxtApp => {
    const firebaseConfig = {
        apiKey: "AIzaSyBIQ745b4yyUCkbaM8Is6YXS3S-of13zp8",
        authDomain: "gundan-jutsu.firebaseapp.com",
        projectId: "gundan-jutsu",
        storageBucket: "gundan-jutsu.appspot.com",
        messagingSenderId: "1083124517666",
        appId: "1:1083124517666:web:9a714edd8909490b6d337b",
        measurementId: "G-5V1X7CNYPC"
    };

    initializeApp(firebaseConfig);
    const jutsuList = useJutsuList();
    const jutsuStyleList= useJutsuStyleList();

    // console.log()
    //
    const store = firebase.firestore();
    store.collection('jutsus').onSnapshot(snap => {
        console.log(snap.docs.map(d => d.data()));
        jutsuList.value = snap.docs.map(d => d.data());
    })
    store.collection('styles').onSnapshot(snap => {
        console.log(snap.docs.map(d => d.data()));
        jutsuStyleList.value = snap.docs.map(d => d.data());
    })
});
