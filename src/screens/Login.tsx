import { Image, Text, View, TouchableOpacity, Keyboard } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import NetInfo from '@react-native-community/netinfo'

import { TabForm } from "../components/TabForm";
import { InputLogin } from "../components/InputLogin";
import { BtnForm } from "../components/BtnForm";
import { Loading } from "../components/Loading";

import {api} from '../lib/axios';

export function Login({navigation}){

    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused) getData();
        
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);
        
        const conexao = await NetInfo.fetch();
        
        const keys = await AsyncStorage.getAllKeys();
        if(!conexao.isConnected && keys.includes('@rm')) return navigation.navigate('carteirinha');
        if(keys.includes('@rm')) return navigation.navigate('home');
        if(keys.includes('@email') && !keys.includes('@rm')) return navigation.navigate('home');

        setIsLoading(false);
    }

    async function loginAluno(){
        Keyboard.dismiss();
        if(rm.trim().includes('.') || !Number.isInteger(Number(rm.trim())) || isNaN(Number(rm.trim())) || rm.trim().length !== 6) return setErroAluno("O RM é inválido!");
        if(passAluno.trim().length === 0) return setErroAluno("Insira uma senha!");
        setErroAluno('');
        
        try{
            setIsLoading(true);
            const login = await api.post('/login/aluno', {
                rm: rm.trim(),
                senha: passAluno.trim()
            });

            if(login.data.msg){
                setErroAluno(login.data.msg);
            }
            else{
                await AsyncStorage.multiSet([
                    ['@rm', rm.trim()],
                    ['@email', login.data.email],
                    ['@nome', login.data.nome],
                    ['@rg', login.data.rg],
                    ['@turma', login.data.turma],
                    ['@profilePhoto', login.data.fotoPerfil]
                ]);
                return navigation.navigate('home')
            }
        }
        catch(err){
            setErroAluno("Houve um problema, tente novamente mais tarde");
            console.log(`Erro: ${err}`);
        }
        return setIsLoading(false);
    }

    async function loginFunc(){
        Keyboard.dismiss();
        const regexEmail = /^[^\s@]+@etec.sp.gov.br$/;
        if(!regexEmail.test(email.trim()) || email.trim().length <= 16) return setErroFunc("O E-mail é inválido!");
        if(passFunc.trim().length === 0) return setErroFunc("Insira uma senha!");
        setErroFunc('');

        try{
            setIsLoading(true);

            const login = await api.post('/login/funcionario', {
                email: email.trim(),
                senha: passFunc.trim()
            });
            if(login.data.msg){
                setErroFunc(login.data.msg);
            }
            else{
                const nome = login.data.nome;
                const nomeProf = await api.post('/isProfessor', {
                    nome: nome.trim()
                });

                if(nomeProf.data == 200){
                    await AsyncStorage.multiSet([
                        ['@email', email.trim()],
                        ['@nome', login.data.nome],
                        ['@profilePhoto', login.data.fotoPerfil]
                    ]);
                }
                else{
                    await AsyncStorage.multiSet([
                        ['@email', email.trim()],
                        ['@nome', login.data.nome],
                        ['@profilePhoto', login.data.fotoPerfil],
                        ['@idProf', nomeProf.data.id.trim()],
                        ['@siglaProf', nomeProf.data.sigla.trim()],
                        ['@presencaProf', nomeProf.data.presente.trim()]
                    ]);
                }

                return navigation.navigate('home')
            }
        }
        catch(err){
            setErroFunc("Houve um problema, tente novamente mais tarde");
            console.log(`Erro: ${err}`);
        }
        return setIsLoading(false);
    }
    
    const [teclado, setTeclado] = useState<boolean>(false);
    const [formFunc, setFormFunc] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hidePassAluno, setHidePassAluno] = useState<boolean>(true);
    const [hidePassFunc, setHidePassFunc] = useState<boolean>(true);
    
    const [rm, setRm] = useState<string>('')
    const [passAluno, setPassAluno] = useState<string>('');
    const [erroAluno, setErroAluno] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [passFunc, setPassFunc] = useState<string>('');
    const [erroFunc, setErroFunc] = useState<string>('');

    Keyboard.addListener('keyboardDidShow', ()=>setTeclado(true));
    Keyboard.addListener('keyboardDidHide', ()=>setTeclado(false));

    if(isLoading) return <Loading/>

    return(
        <View className="flex-1 bg-back items-center">
            {!teclado ?
                <>
                    <Image
                        source={require('../assets/Logo_tucano.png')}
                        className="h-24 mt-24"
                        style={{resizeMode: 'contain'}}
                    />
                    <Text className="text-standart font-nsemibold text-4xl mt-10">
                        ENTRAR
                    </Text>
                </>
                :
                    <Text className="text-standart font-nsemibold text-4xl mt-16">
                        ENTRAR
                    </Text>
            }

            <View className="flex-row w-3/4 justify-between mt-8">
                <TabForm
                    text="ALUNO"
                    isMarked={!formFunc}
                    onPress={()=>setFormFunc(false)}
                />
                <TabForm
                    text="FUNCIONÁRIO"
                    isMarked={formFunc}
                    onPress={()=>setFormFunc(true)}
                />
            </View>
            
            <View className="w-full items-center mt-3 h-2/6">
                {formFunc ? 
                    <>
                        <View className="w-full items-center h-1/2">
                            <InputLogin
                                label="E-mail"
                                value={email}
                                onChangeText={(value)=>setEmail(value)}
                                className="mt-2"
                            />
                            <InputLogin
                                label="Senha"
                                value={passFunc}
                                onChangeText={(value)=>setPassFunc(value)}
                                className="mt-4"
                                secureTextEntry={hidePassFunc}
                            />
                        </View>
                        {!teclado &&
                            <View className="w-3/4 justify-start items-center flex-row mt-4">
                                <TouchableOpacity
                                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                                    onPress={()=>setHidePassFunc(!hidePassFunc)}
                                    activeOpacity={1}
                                >
                                    {!hidePassFunc &&
                                        <Feather
                                            name="check"
                                            size={24}
                                            color="#82878A"
                                        />
                                    }
                                </TouchableOpacity>
                                <Text className="font-nsemibold ml-1 text-[#7F779A]">
                                    Mostrar senha
                                </Text>
                            </View>
                        }
                        {teclado &&
                            <View className="w-3/4 justify-start items-center flex-row mt-16">
                                <TouchableOpacity
                                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                                    onPress={()=>setHidePassFunc(!hidePassFunc)}
                                    activeOpacity={1}
                                >
                                    {!hidePassFunc &&
                                        <Feather
                                            name="check"
                                            size={24}
                                            color="#82878A"
                                        />
                                    }
                                </TouchableOpacity>
                                <Text className="font-nsemibold ml-1 text-[#7F779A]">
                                    Mostrar senha
                                </Text>
                            </View>
                        }
                        <BtnForm
                            text="ENTRAR"
                            className="mt-20"
                            onPress={()=>loginFunc()}
                            erro={erroFunc}
                        />
                    </>
                : 
                    <>
                        <View className="w-full items-center h-1/2">
                            <InputLogin
                                label="RM"
                                keyboardType="number-pad"
                                value={rm}
                                onChangeText={(value)=>setRm(value)}
                                className="mt-2"
                                maxLength={6}
                            />
                            <InputLogin
                                label="Senha"
                                value={passAluno}
                                onChangeText={(value)=>setPassAluno(value)}
                                className="mt-4"
                                secureTextEntry={hidePassAluno}
                            />
                        </View>
                        {!teclado &&
                            <View className="w-3/4 justify-start items-center flex-row mt-4">
                                <TouchableOpacity
                                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                                    onPress={()=>setHidePassAluno(!hidePassAluno)}
                                    activeOpacity={1}
                                >
                                    {!hidePassAluno &&
                                        <Feather
                                            name="check"
                                            size={24}
                                            color="#82878A"
                                        />
                                    }
                                </TouchableOpacity>
                                <Text className="font-nsemibold ml-1 text-[#7F779A]">
                                    Mostrar senha
                                </Text>
                            </View>
                        }
                        {teclado &&
                            <View className="w-3/4 justify-start items-center flex-row mt-16">
                                <TouchableOpacity
                                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                                    onPress={()=>setHidePassAluno(!hidePassAluno)}
                                    activeOpacity={1}
                                >
                                    {!hidePassAluno &&
                                        <Feather
                                            name="check"
                                            size={24}
                                            color="#82878A"
                                        />
                                    }
                                </TouchableOpacity>
                                <Text className="font-nsemibold ml-1 text-[#7F779A]">
                                    Mostrar senha
                                </Text>
                            </View>
                        }
                        
                        <BtnForm
                            text="ENTRAR"
                            className="mt-28"
                            onPress={()=>loginAluno()}
                            erro={erroAluno}
                        />
                    </>
                }
            </View>

            {!teclado &&
                <View className="items-center mt-24">
                    <Text className="text-gray-600 text-sm font-nsemibold">
                        Não tem conta?
                    </Text>

                    <TouchableOpacity
                        onPress={()=>navigation.navigate('signup')}
                    >
                        <Text className="text-standart text-base font-nbold underline">
                            CLIQUE AQUI!
                        </Text>
                    </TouchableOpacity>
                </View>
            }
    </View>
            
    )
}