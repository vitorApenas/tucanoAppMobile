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

export function AppRoutes(){
    return(
        <Navigator screenOptions={{headerShown: false}} initialRouteName={'home'}>
            <Screen name="login" component={Login}/>
            <Screen name="signup" component={Signup}/>
            <Screen name="profilePhoto" component={ProfilePhoto}/>
            <Screen name="carteirinha" component={Carteirinha}/>
            <Screen name="refeitorio" component={Refeitorio}/>
            <Screen name="editarRefeicao" component={EditarRefeicao}/>
            <Screen name="home" component={Home}/>
            <Screen name="settings" component={Settings}/>
            <Screen name="horario" component={Horario}/>
            <Screen name="horarioFunc" component={HorarioFunc}/>
            <Screen name="editarHorario" component={EditarHorario}/>
            <Screen name="editarHorarioDia" component={EditarHorarioDia}/>
            <Screen name="editarAula" component={EditarAula}/>
            <Screen name="criarPost" component={CriarPost}/>
            <Screen name="editarPresencas" component={EditarPresencas}/>
            <Screen name="emDesenvolvimento" component={EmDesenvolvimento}/>
        </Navigator>
    )
}