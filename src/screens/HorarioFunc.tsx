import { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { Loading } from '../components/Loading';
import { Header } from '../components/Header';

import { api } from '../lib/axios';

export function HorarioFunc({navigation}){
    
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

            if(keys.includes('@idProf')){
                const presencaProfOnline = await api.post('/getPresencaProfUnico', {id: await AsyncStorage.getItem('@idProf')});
                if(presencaProfOnline.data.msg){
                    setErro(presencaProfOnline.data.msg);
                }
                else{
                    setPresencaProf(presencaProfOnline.data);
                }
                
                setIsProf(true);
            }
            else{
                setIsProf(false);
            }

            const turmas = await api.get('/turmas');
            if(turmas.data.msg){
                setErro(turmas.data.msg);
            }
            else{
                setTurmas([]);
                setTurmas(turmas.data);
                //turmas.data.map((item)=>setTurmas(turma => [...turma, item]));
            }
        }
        catch{
            setErro("Houve um erro no servidor, tente novamente mais tarde");
        }

        setIsLoading(false);
    }

    async function switchPresenca(presenca: string){
        try{
            setIsLoading(true);

            const id = await AsyncStorage.getItem('@idProf');
            const res = await api.post('/editarPresencaProf', {
                id: id,
                presenca: presenca
            });
            if(res.data.msg) setErro(res.data.msg);
            if(res.data == 200){
                await AsyncStorage.setItem('@presencaProf', presenca);
                getData();
            }
        }
        catch{
            setErro("Houve um erro no servidor, tente novamente mais tarde");
        }
        finally{
            setIsLoading(false);
        }
    }

    const [turmas, setTurmas] = useState<object[]>([]);

    const [isProf, setIsProf] = useState<boolean>(false);
    const [presencaProf, setPresencaProf] = useState<string>('');
    
    const [isLoading, setIsLoading] = useState<boolean>();
    const [erro, setErro] = useState<string>('');

    if(isLoading) return <Loading/>

    if(erro.length > 0) return(
        <View className="flex-1 bg-back items-center">
            <Header
                title="Horários"
                onPress={()=>navigation.navigate('login')}
            />
            <View className="w-5/6 items-center mt-10">
                <Text className="text-lg font-nsemibold ml-1 text-red-700 text-center">
                    {erro}
                </Text>
            </View>
        </View>
    );

    return(
        <View className="flex-1 bg-back items-center">
            <Header
                title="Horários"
                onPress={()=>navigation.navigate('home')}
            />
            <View className="w-full h-full absolute top-24 items-center">

                <View className="w-5/6 mt-1">
                    {isProf &&
                        <View className="w-full bg-white h-36 rounded-xl p-1 items-center">
                            <View className="w-[90%] items-start">
                                <Text className="font-nsemibold text-base text-standart mt-1">
                                    Você irá para a escola hoje?
                                </Text>
                            </View>
                            <View className="w-2/3 flex-row justify-between mt-4">
                                <TouchableOpacity
                                    className="bg-[#99A0B1] w-20 h-10 rounded-md items-center justify-center"
                                    onPress={()=>switchPresenca('#00B489')}
                                >
                                    <Text className="text-white font-nsemibold">
                                        Sim
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-[#99A0B1] w-20 h-10 rounded-md items-center justify-center"
                                    onPress={()=>switchPresenca('#CC3535')}
                                >
                                    <Text className="text-white font-nsemibold">
                                        Não
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="w-[90%] flex-row items-center justify-start mt-4">
                                <Text className="font-nsemibold text-base text-standart">
                                    Sua presença:
                                </Text>
                                <View className="ml-1 mt-0.5">
                                    <FontAwesome
                                        name="circle"
                                        size={24}
                                        color={presencaProf}
                                    />
                                </View>
                            </View>
                        </View>   
                    }
                    <TouchableOpacity
                        className="w-full h-20 bg-[#5C6480] items-center justify-center rounded-xl mt-3"
                        onPress={()=>navigation.navigate('editarPresencas')}
                    >
                        <Text className="font-nsemibold text-white text-xl text-center">
                            EDITAR PRESENÇAS
                        </Text>
                    </TouchableOpacity>
                </View>

                <View 
                    className="mt-3 -mb-2 w-5/6 flex-row items-center justify-between"
                >
                    <View className="bg-standart w-[38%] h-0.5"/>
                        <Text className="font-nsemibold text-base text-center text-standart">
                            Turmas
                        </Text>
                    <View className="bg-standart w-[38%] h-0.5"/>
                </View>

                <FlatList
                    className="w-5/6"
                    data={turmas}
                    renderItem={(turma:any)=>(
                        <TouchableOpacity
                            className="w-full h-20 bg-white mt-5 items-center justify-center rounded-xl border border-gray-300"
                            onPress={()=>navigation.navigate('editarHorario', {obj: turma.item})}
                            key={turma.id}
                        >
                            <Text className="font-nsemibold text-standart text-xl text-center">
                                {`${turma.item.turma} - ${turma.item.curso.toUpperCase()}`}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}