import { useIsFocused } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList} from 'react-native'
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

import { BtnForm } from '../components/BtnForm';
import { Loading } from '../components/Loading';

import { api } from '../lib/axios';

export function ProfilePhoto({route, navigation}){

    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused) getData();
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');
        
        const keys = await AsyncStorage.getAllKeys();
        if(keys.includes('@rm')) return navigation.navigate('home');
        if(keys.includes('@email') && !keys.includes('@rm')) return navigation.navigate('home');

        setIsLoading(false);
    }

    async function cadastroAluno(){
        const signup = await api.post('/cadastro/aluno', {
            rm: Number(rm.trim()),
            senha: senha.trim(),
            img: profilePic
        });
        if(signup.data.msg) return setErroBtn(signup.data.msg);

        if(signup.data.criado){
            await AsyncStorage.clear();
            await AsyncStorage.multiSet([
                ['@rm', rm.trim()],
                ['@email', signup.data.criado.email],
                ['@nome', signup.data.criado.nome],
                ['@rg', signup.data.criado.rg],
                ['@turma', signup.data.criado.turma],
                ['@profilePhoto', signup.data.criado.fotoPerfil]
            ]);

            return navigation.navigate('login');
        };
    }

    async function cadastroFunc(){
        const signup = await api.post('/cadastro/funcionario', {
            email: email.trim(),
            senha: senha.trim(),
            img: profilePic
        });
        if(signup.data.msg) return setErroBtn(signup.data.msg);

        if(signup.data.criado){
            await AsyncStorage.clear();
            await AsyncStorage.multiSet([
                ['@email', email.trim()],
                ['@nome', signup.data.criado.nome],
                ['@profilePhoto', signup.data.criado.fotoPerfil]
            ]);
            
            return navigation.navigate('login');
        }
    }

    const screenWidth = Dimensions.get('screen').width;

    const serverURL = (api.defaults.baseURL).replace('api', 'images/perfilTucanos/');
    const [profilePicURL, setProfilePicURL] = useState<string>(serverURL + 'tuca01.png');
    const [profilePic, setProfilePic] = useState<string>('tuca01.png');
    const [erroBtn, setErroBtn] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>();

    const {rm, email, senha} = route.params;
    if(!route.params.senha) return navigation.navigate('login');

    const data = [
        {
            key: 0,
            f1: 'tuca01.png',
            f2: 'tuca02.png'
        },
        {
            key: 1,
            f1: 'tuca03.png',
            f2: 'tuca04.png'
        },
        {
            key: 2,
            f1: 'tuca05.png',
            f2: 'tuca06.png'
        },
        {
            key: 3,
            f1: 'tuca07.png',
            f2: 'tuca08.png'
        },
        {
            key: 4,
            f1: 'tuca09.png',
            f2: 'tuca10.png'
        },
        {
            key: 5,
            f1: 'tuca11.png',
            f2: 'tuca08.png'
        }
    ];
    
    if(isLoading) return <Loading/>

    return(
        <View className="flex-1 bg-back items-center">
            <Text className="text-standart text-3xl font-nbold mt-12 w-3/4 text-center">
                Escolha sua foto de perfil
            </Text>

            <Image 
                source={{uri: profilePicURL}}
                className="w-1/3 rounded-full" 
                style={{resizeMode: 'contain', height: screenWidth/3}}
            />
            <View
                className="w-full mt-2"
                style={{height: screenWidth}}
            >
                <FlatList
                    data={data}
                    renderItem={({item})=>(
                        <View className="w-full flex-row justify-around mb-8" style={{height: screenWidth/3}}>
                            <TouchableOpacity
                                onPress={()=>{
                                    setProfilePicURL(serverURL + item.f1);
                                    setProfilePic(item.f1);
                                }}
                                style={{height: screenWidth/3, width: screenWidth/3}}
                            >
                                <Image
                                    source={{uri: (serverURL + item.f1)}}
                                    className="rounded-full w-full h-full"
                                    style={{resizeMode: 'contain'}}
                                />
                            </TouchableOpacity>

                            {/*item.f2 && 
                            
                            */}
                            
                            <TouchableOpacity
                                onPress={()=>{
                                    setProfilePicURL(serverURL + item.f2);
                                    setProfilePic(item.f2);
                                }}
                                style={{height: screenWidth/3, width: screenWidth/3}}
                            >
                                <Image
                                    source={{uri: (serverURL + item.f2)}}
                                    className="rounded-full w-full h-full"
                                    style={{resizeMode: 'contain'}}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <BtnForm
                className="mt-4"
                text="CONFIRMAR"
                erro={erroBtn}
                onPress={()=>{
                    if(!route.params.senha) return navigation.navigate('login');
                    if(!route.params.email) return cadastroAluno();
                    return cadastroFunc();
                }}
            />            
        </View>
    )
}