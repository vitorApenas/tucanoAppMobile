import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import {useState, useEffect} from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from '../components/Header';
import { EditarHorarioField } from '../components/EditarHorarioField';
import { Loading } from '../components/Loading';

import { api } from '../lib/axios';

export function Horario({navigation}){

    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused) getData();
    },[isFocused])

    async function getData(){
        setIsLoading(true);

        try{
            const conexao = await NetInfo.fetch();
            if(!conexao.isConnected) return navigation.navigate('login');

            const keys = await AsyncStorage.getAllKeys();
            if(!keys.includes('@rm')) return navigation.navigate('home');
            if(!keys.includes('@email')) return navigation.navigate('login');

            const turma = await AsyncStorage.getItem('@turma');
            const siglaTurma = turma.split(' ')[0];

            const res = await api.post('/horarioAluno', {turma: siglaTurma});
            if(res.data.msg){
                setErro(res.data.msg);
            }
            else{
                setHorario([]);
                setHorario(res.data);

                const date = new Date();

                const aulaAtual = await api.post('/aulaAtual', {
                    turma: siglaTurma,
                    dia: date.getDay(),
                    hora: date.getHours(),
                    minuto: date.getMinutes()
                });

                setAulaAtual(aulaAtual.data.aulaAtual);
                setProfAtual(aulaAtual.data.profAtual);
                setSalaAtual(aulaAtual.data.salaAtual);
                setAtualPresente(aulaAtual.data.presenteAtual);

                setProxAula(aulaAtual.data.proxAula);
                setProxProf(aulaAtual.data.proxProf);
                setProxSala(aulaAtual.data.proxSala);
                setProxPresente(aulaAtual.data.proxPresente);
            }
        }
        catch{
            setErro("Houve um erro no servidor, tente novamente mais tarde");
        }
        
        setIsLoading(false);
    }

    const {width} = useWindowDimensions();

    const [aulaAtual, setAulaAtual] = useState<string>('');
    const [profAtual, setProfAtual] = useState<string>('');
    const [atualPresente, setAtualPresente] = useState<string>('#FFCC18');
    const [salaAtual, setSalaAtual] = useState<string>('');
    
    const [proxAula, setProxAula] = useState<string>('');
    const [proxProf, setProxProf] = useState<string>('');
    const [proxPresente, setProxPresente] = useState<string>('#FFCC18');
    const [proxSala, setProxSala] = useState<string>('');
    
    const [horario, setHorario] = useState<object[]>([]);

    const [openedTab, setOpenedTab] = useState<number>(0);
    const [erro, setErro] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>();

    const diasSemana = [
        {
            key: 1,
            dia: 'Segunda-feira',
            horario: horario.length>30 ? horario.slice(0, 9) : horario.slice(0, 6)
        },
        {
            key: 2,
            dia: 'Terça-feira',
            horario: horario.length>30 ? horario.slice(9, 18) : horario.slice(6, 12)
        },
        {
            key: 3,
            dia: 'Quarta-feira',
            horario: horario.length>30 ? horario.slice(18, 27) : horario.slice(12, 18)
        },
        {
            key: 4,
            dia: 'Quinta-feira',
            horario: horario.length>30 ? horario.slice(27, 36) : horario.slice(18, 24)
        },
        {
            key: 5,
            dia: 'Sexta-feira',
            horario: horario.length>30 ? horario.slice(36, 45) : horario.slice(24, 36)
        }
    ];
    
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
                title="Horários"
                onPress={()=>navigation.navigate('home')}
            />
            <ScrollView className="w-full h-full bg-back">
                <View className="h-full items-center">
                    <View className="w-[85%] items-start mt-[5%]">
                        <Text className="text-standart text-xl font-nbold">Sua aula nesse momento:</Text>
                    </View>
                    <View
                        className="bg-white rounded-xl border border-gray-300 w-[85%] p-1 mt-2"
                        style={{
                            height: width*0.33,
                        }}
                    >
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">
                                Matéria:
                            </Text>
                            <Text className="text-[#51545B] font-nsemibold text-base ml-1">
                                {aulaAtual}
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">
                                Professor(a):
                            </Text>
                            <Text className="text-[#51545B] font-nsemibold text-base ml-1">
                                {profAtual}
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">Status do professor:</Text>
                            <View className="mt-1 ml-1">
                                <FontAwesome
                                        name="circle"
                                        size={20}
                                        color={atualPresente}
                                />
                            </View>
                        </View>
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">
                                Sala:
                            </Text>
                            <Text className="text-[#51545B] font-nsemibold text-base ml-1">
                                {salaAtual}
                            </Text>
                        </View>
                    </View>
                    <View className="w-[85%] items-start mt-3">
                        <Text className="text-standart text-xl font-nbold">Sua próxima aula:</Text>
                    </View>
                    <View
                        className="bg-white rounded-xl border border-gray-300 w-[85%] p-1 mt-2"
                        style={{
                            height: width*0.33,
                        }}
                    >
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">
                                Matéria:
                            </Text>
                            <Text className="text-[#51545B] font-nsemibold text-base ml-1">
                                {proxAula}
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">
                                Professor(a):
                            </Text>
                            <Text className="text-[#51545B] font-nsemibold text-base ml-1">
                                {proxProf}
                            </Text>
                        </View>
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">Status do professor:</Text>
                            <View className="mt-1 ml-1">
                                <FontAwesome
                                        name="circle"
                                        size={20}
                                        color={proxPresente}
                                />
                            </View>
                        </View>
                        <View className="flex-row items-center mt-[1%] ml-2">
                            <Text className="text-black font-nsemibold text-base">
                                Sala:
                            </Text>
                            <Text className="text-[#51545B] font-nsemibold text-base ml-1">
                                {proxSala}
                            </Text>
                        </View>
                    </View>
                    <View className="w-[85%] items-start mt-3">
                        <Text className="text-standart text-xl font-nbold">Seu horário semanal:</Text>
                    </View>
                    <View className="w-5/6 h-[70%] mb-10">
                        {diasSemana.map((dias)=>(
                            <EditarHorarioField
                                diaSemana={dias.dia}
                                horario={dias.horario}
                                isOpened={openedTab === dias.key}
                                onPress={()=>{
                                    if (openedTab === dias.key) return setOpenedTab(0)
                                    setOpenedTab(dias.key)
                                }}
                                isFunc={false}
                                key={dias.key}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}