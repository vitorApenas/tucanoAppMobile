import { useFonts } from "expo-font";
import { StatusBar } from 'react-native'
import { Routes } from "./src/routes";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';

import { Loading } from "./src/components/Loading";

export default function App() {

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded, errorFont] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black
  });

  if(fontsLoaded){
    SplashScreen.hideAsync();

    return(
      <>
        <Routes/>
        <StatusBar barStyle="light-content" backgroundColor="black" translucent/>
      </>
    );
  }

  if(errorFont) alert(errorFont)

  return(<Loading/>)
}