import { Image, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import { Loading } from '../components/Loading';
import { CarteirinhaField } from '../components/CarteirinhaField';

import { api } from '../lib/axios';

export function Carteirinha({navigation}){

    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused) getData();
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);

        const conexao = await NetInfo.fetch();
        setConexaoNet(conexao.isConnected);
        
        const keys = await AsyncStorage.getAllKeys();
        if(!keys.includes('@rm')) return navigation.navigate('login');
        
        const asData = await AsyncStorage.multiGet(['@rm', '@email', '@nome', '@rg', '@turma']);
        setRm(asData[0][1]);
        setEmail(asData[1][1]);
        setNome(asData[2][1]);
        setRg(asData[3][1]);
        setTurma(asData[4][1]);

        const foto = await AsyncStorage.getItem('@profilePhoto');
        setProfilePic(serverURL + foto);

        setIsLoading(false);
    }
    
    const [rm, setRm] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [rg, setRg] = useState<string>('');
    const [turma, setTurma] = useState<string>('');

    const serverURL = (api.defaults.baseURL).replace('api', 'images/perfilTucanos/');
    const [profilePic, setProfilePic] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [conexaoNet, setConexaoNet] = useState<boolean>();

    if(isLoading) return <Loading/>
    
    return(
        <View className="flex-1 bg-back items-center">
            <LinearGradient
                colors={['#6F87C3', '#A4AAB9']}
                className="w-full h-[28%] items-center"
            >
                <View className='w-full h-1/3'>
                        {conexaoNet &&
                        <TouchableOpacity
                            className='mt-1 h-full w-1/6 justify-end items-center'
                            onPress={()=>{navigation.navigate('home')}}
                        >
                            <Feather
                                name="arrow-left"
                                size={38}
                                color="#3A4365"
                            />
                        </TouchableOpacity>
                    }
                </View>
                
                <View className="rounded-full mt-[8%] border-4 border-[#99A0B1]">
                    <Image
                        source={{uri: profilePic}}
                        className="rounded-full h-36 w-36"
                    />  
                </View>
                
            </LinearGradient>
            <CarteirinhaField
                label="Nome do aluno"
                text={nome}
                className="mt-7"
            />
            <CarteirinhaField
                label="RM Escolar"
                text={rm}
                className="mt-5"
            />
            <CarteirinhaField
                label="E-mail institucional"
                text={email}
                className="mt-5"
            />
            <CarteirinhaField
                label="Curso"
                text={turma}
                className="mt-5"
            />
            <CarteirinhaField
                label="RG"
                text={rg}
                className="mt-5"
            />
        </View>
    );
}