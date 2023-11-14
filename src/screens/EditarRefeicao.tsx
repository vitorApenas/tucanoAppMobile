import { TouchableOpacity, View, Text } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import NetInfo from '@react-native-community/netinfo';

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { InputLogin } from "../components/InputLogin";

import { api } from "../lib/axios";

export function EditarRefeicao({route, navigation}){

    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused) getData();
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');
        
        const keys = await AsyncStorage.getAllKeys();
        if(keys.includes('@rm')) return navigation.navigate('refeitorio');
        if(!keys.includes('@email')) return navigation.navigate('login');

        const cardapio = await api.get('/cardapio');
        if(cardapio.data.msg) return alert(cardapio.data.msg);
        const {id} = route.params;

        setContent1(cardapio.data[id].content1);
        setContent2(cardapio.data[id].content2);
        setAbertura(cardapio.data[id].abertura);
        setFechamento(cardapio.data[id].fechamento);
        setCancelado(cardapio.data[id].cancelado);
        
        setIsLoading(false);
    }

    async function update(){
        setIsLoading(true);
        const editado = await api.post('/cardapio/edit', {
            id: route.params.id,
            content1: content1.trim(),
            content2: content2.trim(),
            abertura: abertura.trim(),
            fechamento: fechamento.trim(),
            cancelado: cancelado
        });
        if(editado.data.msg) return alert(editado.data.msg);
        if(editado.data === 200) return navigation.navigate('refeitorio');
        setIsLoading(false)
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [content1, setContent1] = useState<string>('');
    const [content2, setContent2] = useState<string>('');
    const [abertura, setAbertura] = useState<string>('');
    const [fechamento, setFechamento] = useState<string>('');
    const [cancelado, setCancelado] = useState<boolean>(false);
    
    if(isLoading) return <Loading/>

    return(
        <View className="flex-1 bg-back items-center">
            <Header
                title="Editar cardápio"
                onPress={()=>{navigation.navigate('refeitorio')}}
            />
            <View className="w-5/6 mt-[5%]">
                <Text className="font-nbold text-standart text-2xl">Editar cardápio</Text>
            </View>
            <InputLogin
                label="Prato primário"
                value={content1}
                onChangeText={(value)=>setContent1(value)}
                className="mt-[5%]"
            />
            <InputLogin
                label="Prato secundário"
                value={content2}
                onChangeText={(value)=>setContent2(value)}
                className="mt-[5%]"
            />
            <View className="w-3/4 flex-row mt-[5%]">
                <View className="w-1/2">
                    <InputLogin
                        label="Abre"
                        value={abertura}
                        onChangeText={(value)=>setAbertura(value)}
                    />
                </View>
                <View className="w-1/2 items-end">
                    <InputLogin
                        label="Fecha"
                        value={fechamento}
                        onChangeText={(value)=>setFechamento(value)}
                    />
                </View>
                
            </View>
            <View className="w-3/4 justify-start items-center flex-row mt-[5%]">
                <TouchableOpacity
                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                    onPress={()=>setCancelado(!cancelado)}
                    activeOpacity={1}
                >
                    {cancelado &&
                        <Feather
                            name="check"
                            size={24}
                            color="#82878A"
                        />
                    }
                </TouchableOpacity>
                <Text className="font-nsemibold ml-1 text-[#7F779A]">
                    Cancelar refeição
                </Text>
            </View>
            <TouchableOpacity
                className="bg-[#3A4365] rounded-full w-16 h-16 items-center justify-center"
                style={{
                    position: 'absolute',
                    bottom: '5%',
                    right: '5%'
                }}
                onPress={()=>update()}
            >
                <Feather
                    name="check"
                    color="#ECF0F1"
                    size={38}
                />
            </TouchableOpacity>
        </View>
    )
}