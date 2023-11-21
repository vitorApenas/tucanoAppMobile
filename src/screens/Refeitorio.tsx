import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from "../components/Loading";
import { Header } from "../components/Header";
import { RefeitorioField } from "../components/RefeitorioFIeld";
import { EditarCardapioField } from "../components/EditarCardapioField";

import { api } from "../lib/axios";

export function Refeitorio({navigation}){

    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused) getData();
        
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');
        
        const keys = await AsyncStorage.getAllKeys();
        if(keys.includes('@rm')) setIsFunc(false);
        if(keys.includes('@email') && !keys.includes('@rm')) setIsFunc(true);
        if(!keys.includes('@email')) return navigation.navigate('login');

        const cardapio = await api.get('/cardapio');
        if(cardapio.data.msg) return alert(cardapio.data.msg);
        setCafe(cardapio.data[0]);
        setAlmoco(cardapio.data[1]);
        setLanche(cardapio.data[2]);
        setJanta(cardapio.data[3]);
        
        setIsLoading(false);
    }

    const [isFunc, setIsFunc] = useState<boolean>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openedTab, setOpenedTab] = useState<number>();
    const [cafe, setCafe] = useState<object>({})
    const [almoco, setAlmoco] = useState<object>({})
    const [lanche, setLanche] = useState<object>({})
    const [janta, setJanta] = useState<object>({})

    if(isLoading) return <Loading/>

    if(isFunc) return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Refeitório"
                onPress={()=>{navigation.navigate('home')}}
            />
            <View className="w-5/6 mt-[5%]">
                <Text className="font-nbold text-standart text-2xl">Cardápio</Text>
            </View>
            <EditarCardapioField
                isOpened={openedTab === 0}
                title="Café da manhã"
                content1={cafe["content1"]}
                content2={cafe["content2"]}
                horarioOpen={cafe["abertura"]}
                horarioClose={cafe["fechamento"]}
                onPress={()=>{
                    if(openedTab === 0) return setOpenedTab(4)
                    setOpenedTab(0)
                }}
                className="mt-2"
                funcEditar={()=>{navigation.navigate('editarRefeicao', {
                    id: 0
                })}}
            />
            <EditarCardapioField
                isOpened={openedTab === 1}
                title="Almoço"
                content1={almoco["content1"]}
                content2={almoco["content2"]}
                horarioOpen={almoco["abertura"]}
                horarioClose={almoco["fechamento"]}
                onPress={()=>{
                    if(openedTab === 1) return setOpenedTab(4)
                    setOpenedTab(1)
                }}
                className="mt-2"
                funcEditar={()=>{navigation.navigate('editarRefeicao', {
                    id: 1
                })}}
            />
            <EditarCardapioField
                isOpened={openedTab === 2}
                title="Café da tarde"
                content1={lanche["content1"]}
                content2={lanche["content2"]}
                horarioOpen={lanche["abertura"]}
                horarioClose={lanche["fechamento"]}
                onPress={()=>{
                    if(openedTab === 2) return setOpenedTab(4)
                    setOpenedTab(2)
                }}
                className="mt-2"
                funcEditar={()=>{navigation.navigate('editarRefeicao', {
                    id: 2
                })}}
            />
            <EditarCardapioField
                isOpened={openedTab === 3}
                title="Janta"
                content1={janta["content1"]}
                content2={janta["content2"]}
                horarioOpen={janta["abertura"]}
                horarioClose={janta["fechamento"]}
                onPress={()=>{
                    if(openedTab === 3) return setOpenedTab(4)
                    setOpenedTab(3)
                }}
                className="mt-2"
                funcEditar={()=>{navigation.navigate('editarRefeicao', {
                    id: 3
                })}}
            />
        </SafeAreaView>
    )
    
    return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Refeitório"
                onPress={()=>{navigation.navigate('home')}}
            />
            <View className="w-5/6 mt-[5%]">
                <Text className="font-nbold text-standart text-2xl">Cardápio</Text>
            </View>
            <RefeitorioField
                isOpened={openedTab === 0}
                title="Café da manhã"
                content1={cafe["content1"]}
                content2={cafe["content2"]}
                horarioOpen={cafe["abertura"]}
                horarioClose={cafe["fechamento"]}
                onPress={()=>{
                    if(openedTab === 0) return setOpenedTab(4)
                    setOpenedTab(0)
                }}
                className="mt-2"
            />
            <RefeitorioField
                isOpened={openedTab === 1}
                title="Almoço"
                content1={almoco["content1"]}
                content2={almoco["content2"]}
                horarioOpen={almoco["abertura"]}
                horarioClose={almoco["fechamento"]}
                onPress={()=>{
                    if(openedTab === 1) return setOpenedTab(4)
                    setOpenedTab(1)
                }}
                className="mt-2"
            />
            <RefeitorioField
                isOpened={openedTab === 2}
                title="Café da tarde"
                content1={lanche["content1"]}
                content2={lanche["content2"]}
                horarioOpen={lanche["abertura"]}
                horarioClose={lanche["fechamento"]}
                onPress={()=>{
                    if(openedTab === 2) return setOpenedTab(4)
                    setOpenedTab(2)
                }}
                className="mt-2"
            />
            <RefeitorioField
                isOpened={openedTab === 3}
                title="Janta"
                content1={janta["content1"]}
                content2={janta["content2"]}
                horarioOpen={janta["abertura"]}
                horarioClose={janta["fechamento"]}
                onPress={()=>{
                    if(openedTab === 3) return setOpenedTab(4)
                    setOpenedTab(3)
                }}
                className="mt-2"
            />
        </SafeAreaView>
    )
}