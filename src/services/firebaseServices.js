import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const USERS_COLLECTION = 'users';

const getUserRefByUid = uid => firestore().collection(USERS_COLLECTION).doc(uid);

const sanitizePoints = points => {
  const numericPoints = Number(points);

  if (!Number.isFinite(numericPoints) || numericPoints <= 0) {
    return 0;
  }

  return Math.floor(numericPoints);
};

export const ensureFirestoreUserDocument = async user => {
  try {
    console.log('Writing Firestore user:', user.uid);

    const userRef = getUserRefByUid(user.uid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      await userRef.set({
        uid: user.uid,
        isAnonymous: Boolean(user.isAnonymous),
        totalPoints: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await userRef.set(
        {
          uid: user.uid,
          isAnonymous: Boolean(user.isAnonymous),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    console.log('Firestore write success');

    return userRef;
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

export const refreshUserTotalPoints = async () => {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('No authenticated user found while loading total points.');
  }

  await ensureFirestoreUserDocument(user);

  const snapshot = await getUserRefByUid(user.uid).get();
  return Number(snapshot.data()?.totalPoints || 0);
};

export const subscribeToUserTotalPoints = (onValue, onError) => {
  const user = getCurrentUser();

  if (!user) {
    onValue?.(0);
    return () => {};
  }

  return getUserRefByUid(user.uid).onSnapshot(
    snapshot => {
      const points = Number(snapshot.data()?.totalPoints || 0);
      onValue?.(points);
    },
    error => {
      onError?.(error);
    },
  );
};

export const addPointsToUserTotal = async points => {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('No authenticated user found while adding points.');
  }

  const safePoints = sanitizePoints(points);

  if (safePoints === 0) {
    return refreshUserTotalPoints();
  }

  const userRef = getUserRefByUid(user.uid);

  const updatedTotalPoints = await firestore().runTransaction(async transaction => {
    const snapshot = await transaction.get(userRef);
    const previousPoints = Number(snapshot.data()?.totalPoints || 0);
    const nextPoints = previousPoints + safePoints;

    if (!snapshot.exists) {
      transaction.set(userRef, {
        uid: user.uid,
        isAnonymous: Boolean(user.isAnonymous),
        totalPoints: nextPoints,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      transaction.update(userRef, {
        totalPoints: nextPoints,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    }

    return nextPoints;
  });

  return updatedTotalPoints;
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
