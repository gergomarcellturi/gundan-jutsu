import {useJutsuList, useJutsuStyleList} from "~/composables/useStates";
import {defineNuxtPlugin} from "#app";
import {initializeApp} from "@firebase/app";
import {collection, getFirestore, onSnapshot} from "@firebase/firestore";

export default defineNuxtPlugin(nuxtApp => {
    const firebaseConfig = {
        apiKey: "AIzaSyBIQ745b4yyUCkbaM8Is6YXS3S-of13zp8",
        authDomain: "gundan-jutsu.firebaseapp.com",
        databaseURL: "https://gundan-jutsu-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "gundan-jutsu",
        storageBucket: "gundan-jutsu.appspot.com",
        messagingSenderId: "1083124517666",
        appId: "1:1083124517666:web:d9c8cb4a9d937caa6d337b",
        measurementId: "G-L760SHBZQ8"
    };

    initializeApp(firebaseConfig);
    const jutsuList = useJutsuList();
    const jutsuStyleList= useJutsuStyleList();

    onSnapshot(collection(getFirestore(), 'jutsus'), snapshot => {
        jutsuList.value = snapshot.docs.map(d => d.data());
    })

    onSnapshot(collection(getFirestore(), 'styles'), snapshot => {
        jutsuStyleList.value = snapshot.docs.map(d => d.data());
    })

});
