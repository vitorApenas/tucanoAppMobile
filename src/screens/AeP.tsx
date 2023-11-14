import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

import { Loading } from "../components/Loading";
import { Header } from "../components/Header"

import {api} from '../lib/axios';

export function AeP({navigation}){

    const isFocused = useIsFocused();

    useEffect(()=>{
        getData();
    }, [isFocused]);

    async function getData(){
        setIsLoading(true)

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');

        const keys = await AsyncStorage.getAllKeys();
        if(!keys.includes('@email')) return navigation.navigate('login');

        keys.includes('@rm') ? setIsFunc(false) : setIsFunc(true)

        setIsLoading(false)
    }

    
    const [isFunc, setIsFunc] = useState<boolean>();
    const [isLoading, setIsLoading] = useState<boolean>();

    if(isLoading) return <Loading/>

    return(
        <View className="flex-1 bg-back items-center">
            <Header
                title="A&P"
                onPress={()=>navigation.navigate('home')}
            />
            {isFunc &&
                <TouchableOpacity
                    className="bg-[#3A4365] w-[85%] mt-5 h-10 items-center justify-center rounded-lg"
                >
                    <Text className="text-back font-nsemibold text-base">
                        15 itens ainda precisam de verificação
                    </Text>
                </TouchableOpacity>
            }
            <Text>Itens perdidos:</Text>
            <TouchableOpacity
                className="bg-[#3A4365] rounded-full w-16 h-16 items-center justify-center"
                style={{
                    position: 'absolute',
                    bottom: '3%',
                    right: '8%',
                    zIndex: 9
                }}
                onPress={()=>navigation.navigate('criarAep')}
            >
                <Feather
                    name="plus"
                    size={38}
                    color="#FFF"
                />
            </TouchableOpacity>
        </View>
    )
}