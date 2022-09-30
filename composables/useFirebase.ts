import firebase from "firebase/compat";
import {GundanUser} from "~/model/GundanUser";
import {useJutsuStyles} from "~/composables/useStates";
import {JutsuStyle} from "~/model/JutsuStyle";
export const signInWithGoogle = (): void => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
        updateUserData(result);

        }).catch((error) => {
            console.log(error);
    });
}

export const initUser = async () => {
    const store = firebase.firestore();
    const gundanUser = useGundanUser();

    if (firebase.auth().currentUser)
        gundanUser.value = (await store.doc(`users/${firebase.auth().currentUser}`).get()).data() as GundanUser;;
    firebase.auth().onAuthStateChanged(async credential => {
        console.log(credential);
        if (credential) {
            gundanUser.value =  (await store.doc(`users/${credential.uid}`).get()).data() as GundanUser;;
            console.log(gundanUser.value);
        } else {
            gundanUser.value = null;
        }
    })
}

export const initjutsuSyles = async () => {
    const store = firebase.firestore();
    const jutsuStyles = useJutsuStyles();
    store.collection('styles').onSnapshot(snapshot => {
       jutsuStyles.value = snapshot.docs.map(d => d.data()) as JutsuStyle[];
    });
    // jutsuStyles.value = (await store.collection('styles').get()).docs.map(d => d.data()) as JutsuStyle[];

}

const updateUserData = (cred): void => {
    const store = firebase.firestore();
    const user = GundanUser.ofCredentials(cred);
    const userRef = store.doc(`users/${cred.user.uid}`);
    userRef.get().then(snap => {
        if (!snap.exists) {
            return userRef.set(user.get());
        }
    })

}

export const signOut = (): void => {
    firebase.auth().signOut().then(result => {
        window.location.href = `/`
    });
}
