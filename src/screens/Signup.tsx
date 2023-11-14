import {View, Text, TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import { TabForm } from '../components/TabForm';
import { InputLogin } from '../components/InputLogin';
import { BtnForm } from '../components/BtnForm'
import { Loading } from '../components/Loading';
import { Feather } from '@expo/vector-icons';

import { api } from '../lib/axios';

export function Signup({navigation}){   

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
        if(rm.trim().includes('.') || !Number.isInteger(Number(rm.trim())) || isNaN(Number(rm.trim())) || rm.length !== 6) return setErroAluno("O RM é inválido!");
        if(passAluno.trim().includes(' ')) return setErroAluno("A senha não pode ter espaços!")
        if(passAluno.trim().length < 8) return setErroAluno("A senha precisa de no mínimo 8 caracteres.");
        if(!regexPass.test(passAluno)) return setErroAluno("A senha precisa ter letras e números.")
        if(confirmPassAluno.trim() !== passAluno.trim()) return setErroAluno("As senhas não são iguais!");
        setErroAluno('');
        
        try{
            setIsLoading(true);
            
            const check = await api.post('/check/aluno', {
                rm: Number(rm.trim())
            });
            if(check.data.msg) return setErroAluno(check.data.msg);

            navigation.navigate('profilePhoto', {
                rm: rm.trim(),
                senha: passAluno.trim()
            });
        }
        catch(err){
            setErroAluno("Houve um problema, tente novamente mais tarde");
            console.log(`Erro: ${err}`);
        }
        finally{
            setIsLoading(false);
        }
    }

    async function cadastroFunc(){
        if(!regexEmail.test(email) || email.length <= 16) return setErroFunc("O E-mail é inválido!");
        if(passFunc.trim().includes(' ')) return setErroFunc("A senha não pode ter espaços!")
        if(passFunc.trim().length < 8) return setErroFunc("A senha precisa de no mínimo 8 caracteres.");
        if(!regexPass.test(passFunc)) return setErroFunc("A senha precisa ter letras e números.")
        if(confirmPassFunc.trim() !== passFunc.trim()) return setErroFunc("As senhas não são iguais!");
        setErroFunc('');

        try{
            setIsLoading(true);

            const check = await api.post('/check/funcionario', {
                email: email.trim()
            });
            if(check.data.msg) return setErroFunc(check.data.msg);

            navigation.navigate('profilePhoto', {
                email: email.trim(),
                senha: passAluno.trim()
            });
        }
        catch(err){
            setErroFunc("Houve um problema, tente novamente mais tarde");
            console.log(`Erro: ${err}`);
        }
        finally{
            setIsLoading(false);
        }
    }

    const regexEmail = /^[^\s@]+@etec.sp.gov.br$/;
    const regexPass = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formFunc, setFormFunc] = useState<boolean>(false);
    const [hidePass, setHidePass] = useState<boolean>(true);

    const [rm, setRm] = useState<string>('210066');
    const [passAluno, setPassAluno] = useState<string>('vitorvitor123');
    const [confirmPassAluno, setConfirmPassAluno] = useState<string>('vitorvitor123');
    const [erroAluno, setErroAluno] = useState<string>('');

    const [email, setEmail] = useState<string>('nilson.anjos@etec.sp.gov.br');
    const [passFunc, setPassFunc] = useState<string>('vitorvitor123');
    const [confirmPassFunc, setConfirmPassFunc] = useState<string>('vitorvitor123');
    const [erroFunc, setErroFunc] = useState<string>('');

    if(isLoading) return <Loading/>
    
    return(
        <View className="flex-1 bg-back items-center">
            <Text className="text-standart font-nsemibold text-4xl mt-16">
                CADASTRE-SE
            </Text>
            <View className="flex-row w-3/4 justify-between mt-4">
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
            {formFunc ? 
                <>
                    <InputLogin
                        label="E-mail"
                        legenda="Digite seu email institucional (@etec.sp.gov.br)."
                        value={email}
                        onChangeText={(value)=>setEmail(value)}
                        className="mt-8"
                    />
                    {
                    regexEmail.test(email) &&
                        <>
                            <InputLogin
                                label="Senha"
                                legenda="Crie uma senha com pelo menos 8 caracteres sem espaços, incluindo letras e números."
                                value={passFunc}
                                onChangeText={(value)=>setPassFunc(value)}
                                secureTextEntry={hidePass}
                                className="mt-4"
                            />
                            <InputLogin
                                label="Confirme a senha"
                                value={confirmPassFunc}
                                onChangeText={(value)=>setConfirmPassFunc(value)}
                                secureTextEntry={hidePass}
                                className="mt-4"
                            />

                            <View className="w-3/4 justify-start items-center flex-row mt-4">
                                <TouchableOpacity
                                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                                    onPress={()=>setHidePass(!hidePass)}
                                    activeOpacity={1}
                                >
                                    {!hidePass &&
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

                            <BtnForm
                                text="CADASTRAR"
                                erro={erroFunc}
                                className="mt-44"
                                onPress={()=>cadastroFunc()}
                            />
                        </>
                    }
                </>
            :
                <>
                    <InputLogin
                        label="RM"
                        legenda="Digite seu RM escolar."
                        value={rm}
                        onChangeText={(value)=>setRm(value)}
                        keyboardType="number-pad"
                        className="mt-8"
                        maxLength={6}
                    />
                    {rm.length === 6 &&
                        <>
                            <InputLogin
                                label="Senha"
                                legenda="Crie uma senha com pelo menos 8 caracteres sem espaços, incluindo letras e números."
                                value={passAluno}
                                onChangeText={(value)=>setPassAluno(value)}
                                secureTextEntry={hidePass}
                                className="mt-4"
                            />
                            <InputLogin
                                label="Confirme a senha"
                                value={confirmPassAluno}
                                onChangeText={(value)=>setConfirmPassAluno(value)}
                                secureTextEntry={hidePass}
                                className="mt-4"
                            />

                            <View className="w-3/4 justify-start items-center flex-row mt-4">
                                <TouchableOpacity
                                    className="h-7 w-7 border-2 border-[#82878A] rounded-md items-center justify-center"
                                    onPress={()=>setHidePass(!hidePass)}
                                    activeOpacity={1}
                                >
                                    {!hidePass &&
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

                            <BtnForm
                                text="CADASTRAR"
                                erro={erroAluno}
                                className="mt-44"
                                onPress={()=>cadastroAluno()}
                            />
                        </>
                    }
                </>
            }
        </View>
    )
}