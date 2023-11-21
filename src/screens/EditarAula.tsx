import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from '../components/Loading';
import { Header } from '../components/Header';
import { InputLogin } from '../components/InputLogin';
import { BtnForm } from '../components/BtnForm';

import { api } from '../lib/axios';

export function EditarAula({route, navigation}){
    
    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused) getData();
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);

        try{
            const conexao = await NetInfo.fetch();
            if(!conexao.isConnected) return navigation.navigate('login');

            const keys = await AsyncStorage.getAllKeys();
            if(keys.includes('@rm')) return navigation.navigate('home');
            if(!keys.includes('@email')) return navigation.navigate('login');

            if(!route.params.dia || !route.params.horario || !route.params.aula) return setErro("Houve um erro no servidor, tente novamente mais tarde");

            setProf(route.params.prof);
            setMateria(route.params.materia);
        }
        catch{
            setErro("Houve um erro no servidor, tente novamente mais tarde");
        }

        setIsLoading(false);
    }

    async function editar(){
        setMateria(materia.toUpperCase());
        setProf(prof.toUpperCase());
        const resMateria = await api.post('/check/materia', {sigla: materia.trim()});
        const resProf = await api.post('/check/professor', {sigla: prof.trim()})

        if(resMateria.data.msg) return setErroBtn(resMateria.data.msg)
        if(resProf.data.msg) return setErroBtn(resProf.data.msg)
        setErroBtn('');

        const editarHorario = await api.post('/horario/edit', {
            idHorario: route.params.aula,
            idMateria: resMateria.data.id,
            idProf: resProf.data.id
        });

        if(editarHorario.data == 200) return navigation.navigate('horarioFunc')
    }

    const [materia, setMateria] = useState<string>();
    const [prof, setProf] = useState<string>();
    
    const [erroBtn, setErroBtn] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>();

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
                title="Editar Aula"
                onPress={()=>navigation.goBack()}
            />
                <View className="w-5/6 mt-[5%]">
                    <Text className="font-nbold text-standart text-2xl">
                        Aula de {route.params.horario}
                    </Text>
                    <Text className="font-nbold text-standart text-lg">
                        {route.params.dia}
                    </Text>
                </View>
                <View className="w-3/4 mt-[5%]">
                    <Text className="font-nbold text-standart text-xl">
                        Matéria
                    </Text>
                </View>
                <InputLogin
                    label="Matéria"
                    value={materia}
                    onChangeText={(value)=>{setMateria(value)}}
                    className="mt-[5%]"
                    onBlur={()=>setMateria(materia.toUpperCase())}
                />
                <View className="w-3/4 mt-[5%]">
                    <Text className="font-nbold text-standart text-xl">
                        Professor
                    </Text>
                </View>
                <InputLogin
                    label="Professor"
                    value={prof}
                    onChangeText={(value)=>setProf(value)}
                    className="mt-[5%]"
                    onBlur={()=>setProf(prof.toUpperCase())}
                />
                <BtnForm
                    text="Editar"
                    onPress={()=>editar()}
                    erro={erroBtn}
                    className="mt-[90%]"
                />
        </SafeAreaView>
    );
}