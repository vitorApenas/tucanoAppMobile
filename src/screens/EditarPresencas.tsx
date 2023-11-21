import { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from "react-native-safe-area-context";

import { Loading } from '../components/Loading';
import { Header } from '../components/Header';
import { DropDownProf } from '../components/DropDownProf';

import { api } from '../lib/axios';

export function EditarPresencas({navigation}){

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
            if(!keys.includes('@email')) return navigation.navigate('login');
            if(keys.includes('@rm')) return navigation.navigate('home');

            const profsData = await api.get('/getPresencaProfs');
            if(profsData.data.msg) setErro(profsData.data.msg);
            setProfs(profsData.data);
            setOpenedTab(profsData.data.length)
        }
        catch{
            setErro("Houve um erro no servidor, tente novamente mais tarde");
        }

        setIsLoading(false);
    }

    const switchPresenca = async (id: string, presenca: string) => {
        try{
            setIsLoading(true);

            const res = await api.post('/editarPresencaProf', {
                id: id,
                presenca: presenca
            });
            if(res.data.msg) setErro(res.data.msg);
            if(res.data == 200){
                setOpenedTab(profs.length);
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

    const [isLoading, setIsLoading] = useState<boolean>();
    const [erro, setErro] = useState<string>('');

    const [pesquisa, setPesquisa] = useState<string>('');
    const [profsPesquisa, setProfsPesquisa] = useState<any>([]);

    const [profs, setProfs] = useState<any>([]);
    const [openedTab, setOpenedTab] = useState<number>();

    if(isLoading) return <Loading/>

    if(erro.length > 0) return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Professores"
                onPress={()=>navigation.navigate('horarioFunc')}
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
                title="Professores"
                onPress={()=>navigation.navigate('horarioFunc')}
            />
            <View className="bg-white w-[90%] h-12 rounded-xl mt-5 p-1 flex-row items-center justify-start">
                <Image source={require('../assets/lupa.png')} className='h-8 w-8'/>
                <TextInput
                    className="w-5/6 h-8 ml-3 text-[#8087A0] font-nsemibold text-base"
                    placeholder="Pesquisar professor por sigla"
                    value={pesquisa}
                    onChangeText={(value)=>{
                        setProfsPesquisa(profs.filter(prof => prof.sigla.includes(value.toUpperCase())));
                        setPesquisa(value);
                    }}
                />
            </View>
            <View className="w-[90%] h-12 rounded-xl mt-3 p-1 flex-row items-center justify-between">
                <Text className="text-standart font-nbold text-xl">Lista de Professores:</Text>
                <Text className="text-standart font-nbold text-xs">Nome/Sigla</Text>
            </View>
            <FlatList
                className="w-[90%] mt-3"
                data={pesquisa.length > 0 ? profsPesquisa : profs}
                renderItem={(prof:any)=>(
                    <DropDownProf
                        key={prof.index}
                        id={prof.item.id}
                        nome={prof.item.nome}
                        sigla={prof.item.sigla}
                        presente={prof.item.presente}
                        isOpen={openedTab === prof.index}
                        funcPresenca={switchPresenca}
                        onPress={()=>{
                            if(openedTab === prof.index) return setOpenedTab(profs.length);
                            setOpenedTab(prof.index);
                        }}
                    />
                )}
            />
        </SafeAreaView>
    )
}