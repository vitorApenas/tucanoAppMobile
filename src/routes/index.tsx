import { View } from 'react-native'
import { AppRoutes } from './app.routes'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const {Navigator, Screen} = createNativeStackNavigator();

import { Login } from "../screens/Login";
import { Signup } from "../screens/Signup";
import { Carteirinha } from "../screens/Carteirinha";
import { ProfilePhoto } from "../screens/ProfilePhoto";
import { Refeitorio } from "../screens/Refeitorio";
import { EditarRefeicao } from "../screens/EditarRefeicao";
import { Home } from "../screens/Home";
import { Settings } from "../screens/Settings";
import { Horario } from "../screens/Horario";
import { HorarioFunc } from "../screens/HorarioFunc";
import { EditarHorario } from "../screens/EditarHorario";
import { EditarHorarioDia } from "../screens/EditarHorarioDia";
import { EditarAula } from "../screens/EditarAula";
import { CriarPost } from "../screens/CriarPost";
import { EditarPresencas } from "../screens/EditarPresencas";
import { EmDesenvolvimento } from "../screens/EmDesenvolvimento";

export function Routes(){
    return(
        <View className='flex-1 bg-green-500'>
            <NavigationContainer>
                <AppRoutes/>
            </NavigationContainer>
        </View>
    )
}