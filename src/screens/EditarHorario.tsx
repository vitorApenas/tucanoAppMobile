import {View, Text, FlatList} from 'react-native';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from '../components/Loading';
import { Header } from '../components/Header';
import { EditarHorarioField } from '../components/EditarHorarioField';

import { api } from '../lib/axios';

export function EditarHorario({route, navigation}){

    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused) getData();
    },[isFocused]);

    async function getData(){
        setIsLoading(true);

        try{
            const conexao = await NetInfo.fetch();
            if(!conexao.isConnected) return navigation.navigate('login');
    
            if(!route.params.obj) return navigation.navigate('horarioFunc');
    
            const keys = await AsyncStorage.getAllKeys();
            if(keys.includes('@rm')) return navigation.navigate('home');
            if(!keys.includes('@email')) return navigation.navigate('login');

            const turmaId = route.params.obj.id;
            const res = await api.post('/horarioFunc', {
                turma: turmaId
            });
            if(res.data.msg){
                setErro(res.data.msg);
            }
            else{
                setHorario([]);
                setHorario(res.data);
                //res.data.map((item)=>setHorario(horario => [...horario, item]));
            }
        }
        catch{
            setErro("Houve um erro no servidor, tente novamente mais tarde");
        }

        setIsLoading(false);
    }

    const [horario, setHorario] = useState<object[]>([]);

    const [openedTab, setOpenedTab] = useState<number>(5);
    const [isLoading, setIsLoading] = useState<boolean>();
    const [erro, setErro] = useState<string>('');

    const diasSemana = [
        {
            key: 0,
            dia: 'Segunda-feira',
            horario: horario.length>30 ? horario.slice(0, 9) : horario.slice(0, 6)
        },
        {
            key: 1,
            dia: 'Terça-feira',
            horario: horario.length>30 ? horario.slice(9, 18) : horario.slice(6, 12)
        },
        {
            key: 2,
            dia: 'Quarta-feira',
            horario: horario.length>30 ? horario.slice(18, 27) : horario.slice(12, 18)
        },
        {
            key: 3,
            dia: 'Quinta-feira',
            horario: horario.length>30 ? horario.slice(27, 36) : horario.slice(18, 24)
        },
        {
            key: 4,
            dia: 'Sexta-feira',
            horario: horario.length>30 ? horario.slice(36, 45) : horario.slice(24, 36)
        }
    ]

    if(isLoading) return <Loading/>

    if(erro.length > 0) return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Horários"
                onPress={()=>navigation.navigate('home')}
            />
            <View className="w-5/6 items-center mt-10">
                <Text className="text-lg font-nsemibold ml-1 text-red-700 text-center">
                    {erro}
                </Text>
            </View>
        </SafeAreaView>
    );

    return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Editar horário"
                onPress={()=>navigation.navigate('horarioFunc')}
            />
            <View className="w-5/6 mt-[5%]">
                <Text className="font-nbold text-standart text-xl">
                    {route.params.obj.turma} - {route.params.obj.curso}
                </Text>
            </View>
            <View className="w-5/6 h-[70%] mt-5">
                <Text className="font-nsemibold text-standart text-lg">
                    Horário Semanal:
                </Text>
                <FlatList
                    data={diasSemana}
                    className="w-full"
                    renderItem={(dias:any)=>(
                        <EditarHorarioField
                            diaSemana={dias.item.dia}
                            horario={dias.item.horario}
                            isOpened={openedTab === dias.item.key}
                            navigation={navigation}
                            onPress={()=>{
                                if (openedTab === dias.item.key) return setOpenedTab(5)
                                setOpenedTab(dias.item.key)
                            }}
                            isFunc={true}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    )
}