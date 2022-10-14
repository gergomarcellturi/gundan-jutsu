import {initializeApp} from "@firebase/app";

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

    const app = initializeApp(firebaseConfig);
    console.log(app);
});
