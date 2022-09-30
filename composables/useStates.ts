import {JutsuStyle} from "~/model/JutsuStyle";

export const useGundanUser = () => useState('firebaseUser', () => ({}))

export const useJutsuStyles = () => useState<JutsuStyle[]>('jutsuStyles', () => []);

// @ts-ignore
// export const useFireStore = () => useState<firebase.firestore>('firestore', () => ({}))
