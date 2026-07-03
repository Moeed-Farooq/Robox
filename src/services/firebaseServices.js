import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

export const ensureFirestoreUserDocument = async user => {
  try {
    console.log('Writing Firestore user:', user.uid);

    const userRef = firestore().collection(USERS_COLLECTION).doc(user.uid);

    await userRef.set({
      uid: user.uid,
      isAnonymous: true,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log('Firestore write success');
  } catch (e) {
    console.log('FIRESTORE ERROR');
    console.log(e);
    console.log(e.code);
    console.log(e.message);

    throw e;
  }
};
export const getCurrentUser = () => {
  return auth().currentUser;
};

export const anonymousLogin = async () => {
  try {
    const existingUser = getCurrentUser();

    if (existingUser) {
      const userDocument = await ensureFirestoreUserDocument(existingUser);

      return {
        user: existingUser,
        isNewUser: false,
        userDocument,
      };
    }

    const credential = await auth().signInAnonymously();
    const signedInUser = credential?.user;

    if (!signedInUser) {
      throw new Error('Anonymous sign-in succeeded without a user object.');
    }
    const userDocument = await ensureFirestoreUserDocument(signedInUser);
    return {
      user: signedInUser,
      isNewUser: Boolean(credential?.additionalUserInfo?.isNewUser),
      userDocument,
    };
  } catch (error) {
    const message = error?.message || 'Failed to sign in anonymously.';
    throw new Error(message);
  }
};

export const logoutAnonymousUser = async () => {
  try {
    const user = getCurrentUser();

    if (!user) {
      return false;
    }

    await auth().signOut();
    return true;
  } catch (error) {
    const message = error?.message || 'Failed to sign out anonymous user.';
    throw new Error(message);
  }
};
