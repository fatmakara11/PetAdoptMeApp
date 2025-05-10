import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
//import firebase from '../config/FirebaseConfig';
export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // console.log('Firebase Application:', firebase);
  //Sconsole.log('deneme');

  if (!isLoaded) {
    return null;

  }

  if (isSignedIn) {

    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}