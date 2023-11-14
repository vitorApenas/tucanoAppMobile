import { Loading } from "./src/components/Loading";
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
} from '@expo-google-fonts/nunito'

export default function App() {

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black
  });

  if(!fontsLoaded) return (<Loading/>);

  return(
    <>
      <Routes/>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent/>
    </>
  );
}