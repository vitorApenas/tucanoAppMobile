import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

export function Settings({navigation}){
    
    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused) getData();
    }, [isFocused]);
    
    async function getData(){
        setIsLoading(true);

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');
        
        const keys = await AsyncStorage.getAllKeys();
        if(!keys.includes('@email')) return navigation.navigate('login');

        setIsLoading(false);
    }

    async function logout(){
        setIsLoading(true);
        await AsyncStorage.clear();
        return navigation.navigate('login');
    }

    const [isLoading, setIsLoading] = useState<boolean>();

    if(isLoading) return <Loading/>

    return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Configurações"
                onPress={()=>navigation.navigate('home')}
            />
            <TouchableOpacity
                className="bg-[#BA3C3C] w-5/6 h-14 flex-row items-center rounded-lg absolute bottom-[4%]"
                onPress={()=>logout()}
            >
                <View className="ml-[3%]">
                    <Feather
                        name="log-out"
                        size={36}
                        color="#F5F7FA"
                    />
                </View>
                <Text className="font-nbold text-[#F5F7FA] text-base ml-[3%]">Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}