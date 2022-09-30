import firebase from "firebase/compat";

export class GundanUser {

    public static ofCredentials(cred: firebase.auth.UserCredential): GundanUser {
        const user = new GundanUser();
        user.uid = cred.user.uid;
        user.displayName = cred.user.displayName;
        user.email = cred.user.email;
        user.isAdmin = false;
        user.isOperator = false;
        user.photoUrl = cred.user.photoURL
        user.creationTime = new Date(cred.user.metadata.creationTime);
        user.lastSignInTime = new Date(cred.user.metadata.lastSignInTime);
        return user;
    }

    uid: string;
    displayName: string;
    email: string;
    photoUrl: string;
    createdAt: number;
    creationTime: Date;
    lastSignInTime: Date;
    isOperator: boolean;
    isAdmin: boolean;

    public get(): {[key: string]: any} {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            photoUrl: this.photoUrl,
            creationTime: this.creationTime,
            lastSignInTime: this.lastSignInTime,
            isOperator: this.isOperator,
            isAdmin: this.isAdmin,
        }
    }
}
