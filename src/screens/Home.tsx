import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Text, ScrollView, useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { FontAwesome, Feather } from "@expo/vector-icons";

import { Loading } from "../components/Loading";
import { TextoPost } from "../components/TextoPost";
import { ConfigPost } from "../components/ConfigPost";
import { ConfigPostFix } from "../components/ConfigPostFix";

import { api } from "../lib/axios";

export function Home({navigation}){

    interface typePost{
        id: string,
        txt?: string,
        foto: boolean,
        extensao?: string,
        funcNome: string,
        funcFoto: string,
        createdAt:{
            dia: number,
            mes: string,
            ano: number
        }
    }

    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused){
            getData();
        }
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);
        setIsLoadingPosts(true);

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');

        const keys = await AsyncStorage.getAllKeys();
        if(keys.includes('@rm')){
            try{
                const check = await api.post('/check/aluno', {rm: await AsyncStorage.getItem('@rm')});
                if(check.data.msg !== "O aluno com esse RM já está cadastrado") return navigation.navigate('login');
                const asNome = await AsyncStorage.getItem('@nome');
                setNome(asNome.split(' ')[0]);
                setIsFunc(false);
            }
            catch{
                return navigation.navigate('login');
            }
        };
        if(keys.includes('@email') && !keys.includes('@rm')){
            try{
                const check = await api.post('/check/funcionario', {email: await AsyncStorage.getItem('@email')});
                if(check.data.msg !== "Esse funcionário já está cadastrado") return navigation.navigate('login');
                const asNome = await AsyncStorage.getItem('@nome');
                setNome(asNome.split(' ')[0]);
                setIsFunc(true);
                
            }
            catch{
                return navigation.navigate('login');
            }
        }
        if(!keys.includes('@email')) return navigation.navigate('login');
        
        const foto = await AsyncStorage.getItem('@profilePhoto');
        setProfilePic(serverURL + 'perfilTucanos/' + foto);

        const resPosts = await api.get('/posts');
        setPosts(resPosts.data);
        
        const postFixado = await api.get('/postFixado');
        if(postFixado.data !== 200){
            setPostFix(postFixado.data);
        }
        setIsLoadingPosts(false);

        if(keys.includes('@turma') && !isFunc){
            const siglaTurma = (await AsyncStorage.getItem('@turma')).split(' ')[0];
            const date = new Date();
            const aulaAtual = await api.post('/aulaAtual', {
                turma: siglaTurma,
                /*dia: date.getDay(),
                hora: date.getHours(),
                minuto: date.getMinutes()*/
                dia: 5,
                hora: 8,
                minuto: 25
            });
            const nomeMateria = await api.post('/getMateria', {
                sigla: aulaAtual.data.aulaAtual,
                /*dia: date.getDay(),
                hora: date.getHours(),
                minuto: date.getMinutes()*/
                dia: 5,
                hora: 8,
                minuto: 25
            });
            setImgAula(`${serverURL}iconesHorario/${aulaAtual.data.aulaAtual}.png`);

            setMateriaAtual(nomeMateria.data);
            setPresenteAtual(aulaAtual.data.presenteAtual);
            setProfAtual(aulaAtual.data.profAtual);
            setSalaAtual(aulaAtual.data.salaAtual);
        }

        setIsLoading(false);
    }

    const {height, width} = useWindowDimensions();
    const [nome, setNome] = useState<string>('');
    const [posts, setPosts] = useState<any>([]);
    const [postFix, setPostFix] = useState<typePost>();

    const [materiaAtual, setMateriaAtual] = useState<string>();
    const [presenteAtual, setPresenteAtual] = useState<string>();
    const [profAtual, setProfAtual] = useState<string>();
    const [salaAtual, setSalaAtual] = useState<string>();
    
    const [isLoading, setIsLoading] = useState<boolean>();
    const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
    const [isFunc, setIsFunc] = useState<boolean>();
    
    const serverURL = (api.defaults.baseURL).replace('api', 'images/');
    const [profilePic, setProfilePic] = useState<string>();
    const [imgAula, setImgAula] = useState<string>();

    if(isLoading) return <Loading/>

    return(
        <View className="flex-1 bg-back items-center">
            <View className="w-full bg-[#99A0B1] flex-row items-end pb-1 pl-2" style={{height: 88}}>
                {isFunc ? 
                    (
                        <View className="border-[#3A4365] border-2 rounded-full">
                            <Image
                                source={{uri: profilePic}}
                                className="rounded-full h-12 w-12"
                            />
                        </View>
                    )
                :
                    (
                        <TouchableOpacity
                            className="border-[#3A4365] border-2 rounded-full"
                            onPress={()=>navigation.navigate('carteirinha')}
                        >
                            <Image
                                source={{uri: profilePic}}
                                className="rounded-full h-12 w-12"
                            />
                        </TouchableOpacity>
                    )
                }
                <TouchableOpacity
                    className="absolute right-3 bottom-2"
                    onPress={()=>navigation.navigate('settings')}
                >
                    <Feather
                        name="settings"
                        size={42}
                        color="#3A4365"
                    />
                </TouchableOpacity>

            </View>

            <View className="w-full h-[90%] items-center">
                <ScrollView
                    contentContainerStyle={{alignItems: 'center'}}
                    className="w-full h-full"
                >
                    <View className="mt-5 w-[85%]" key={0}>
                        <Text className="text-standart text-lg font-nbold">
                            Bem vindo(a), {nome}!
                        </Text>
                    </View>

                    {!isFunc &&
                        <View className="w-[85%] items-start mt-5 -mb-2">
                            <Text className="text-[#8087A0] text-base font-nbold">
                                Sua aula nesse momento:
                            </Text>
                            <View className="flex-row w-full justify-between">
                                <View
                                    className="bg-white rounded-xl items-center justify-evenly mt-1 p-1"
                                    style={{
                                        width: height/9,
                                        height: height/9
                                    }}
                                >
                                    <Text
                                        className="font-nsemibold text-black text-center"
                                        style={{
                                            fontSize: 13,
                                            lineHeight: 18
                                        }}
                                    >
                                        {materiaAtual}
                                    </Text>
                                    <Image
                                        source={{uri: imgAula}}
                                        style={{
                                            width: width*0.12,
                                            height: width*0.12
                                        }}
                                    />
                                </View>
                                <View 
                                    className="bg-white rounded-xl items-start justify-evenly mt-1 p-1"
                                    style={{
                                        width: height/3.5,
                                        height: height/9
                                    }}
                                >
                                    <View className="flex-row items-center">
                                        <Text
                                            className="font-nsemibold text-black"
                                            style={{
                                                fontSize: 15,
                                                lineHeight: 22
                                            }}
                                        >
                                            Nome do professor:
                                        </Text>
                                        <Text
                                            className="text-[#51545B] font-nsemibold ml-1"
                                            style={{
                                                fontSize: 15,
                                                lineHeight: 22
                                            }}
                                        >
                                            {profAtual}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text
                                            className="font-nsemibold text-black"
                                            style={{
                                                fontSize: 15,
                                                lineHeight: 22
                                            }}
                                        >
                                            Sala:
                                        </Text>
                                        <Text
                                            className="text-[#51545B] font-nsemibold ml-1"
                                            style={{
                                                fontSize: 15,
                                                lineHeight: 22
                                            }}
                                        >
                                            {salaAtual}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text
                                            className="font-nsemibold text-black"
                                            style={{
                                                fontSize: 15,
                                                lineHeight: 22
                                            }}
                                        >
                                            Status do professor:
                                        </Text>
                                        <View className="ml-1 mt-0.5">
                                            <FontAwesome
                                                name="circle"
                                                size={18}
                                                color={presenteAtual}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>    
                    }

                    <View className="w-[85%] items-start mt-5 -mb-2">
                        <Text className="text-[#8087A0] text-base font-nbold">
                            Feed
                        </Text>
                    </View>
                    
                    {
                        isLoadingPosts ?
                            <>
                                <View className="mt-3 mb-5 w-[85%] bg-white h-44 rounded-xl border border-gray-300"/>
                                <View className="mt-5 mb-5 w-[85%] bg-white h-44 rounded-xl border border-gray-300"/>
                                <View className="mt-5 mb-5 w-[85%] bg-white h-44 rounded-xl border border-gray-300"/>
                            </>
                        :
                            <>
                                {postFix &&
                                    <View
                                        className="mt-5 mb-5 w-[85%] bg-[#949BB440] rounded-xl border border-gray-300 items-center"
                                    >
                                        <View className="w-[95%] mt-1">
                                            <View className="flex-row justify-start items-center z-10">
                                                <View className="border-[#3A4365] border-2 rounded-full">
                                                    <Image
                                                        source={{uri: serverURL + 'perfilTucanos/' + postFix.funcFoto}}
                                                        className="rounded-full h-10 w-10"
                                                    />
                                                </View>
                                                <Text
                                                    className="text-standart font-nbold text-sm ml-1"
                                                >
                                                    {postFix.funcNome}
                                                </Text>
                                                    {isFunc &&
                                                        <ConfigPostFix
                                                            id={postFix.id}
                                                            navigation={navigation}
                                                        />
                                                    }    
                                            </View>
                                            {postFix.foto &&
                                                <Image
                                                    source={{uri: `${serverURL}postImages/${postFix.id}.${postFix.extensao}`}}
                                                    className="w-full rounded-xl mt-1"
                                                    style={{
                                                        height: height*0.22,
                                                        resizeMode: 'contain',
                                                    }}
                                                />
                                            }
                                            {postFix.txt.length < 144 ?
                                                <Text className="mt-2 text-justify text-black font-nregular text-sm">
                                                    {postFix.txt}
                                                </Text>
                                            :
                                                <TextoPost text={postFix.txt}/>
                                            }
                                            <View className="w-full h-6 items-end justify-start">
                                                <Text className="text-[#727B80] font-nsemibold text-sm">
                                                    {postFix.createdAt.dia} de {postFix.createdAt.mes}, {postFix.createdAt.ano}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                                {
                                    posts.map((item:typePost)=>{
                                        if(!postFix || (item.id !== postFix.id)) return(
                                            <View
                                                className="mt-5 mb-5 w-[85%] bg-white rounded-xl border border-gray-300 items-center"
                                                key={item.id}
                                            >
                                                <View className="w-[95%] mt-1">
                                                    <View className="flex-row justify-start items-center z-10">
                                                        <View className="border-[#3A4365] border-2 rounded-full">
                                                            <Image
                                                                source={{uri: serverURL + 'perfilTucanos/' + item.funcFoto}}
                                                                className="rounded-full h-10 w-10"
                                                            />
                                                        </View>
                                                        <Text
                                                            className="text-standart font-nbold text-sm ml-1"
                                                        >
                                                            {item.funcNome}
                                                        </Text>
                                                        {isFunc &&
                                                            <ConfigPost
                                                                id={item.id}
                                                                navigation={navigation}
                                                            />
                                                        }
                                                        
                                                    </View>
                                                    {item.foto &&
                                                        <Image
                                                            source={{uri: `${serverURL}postImages/${item.id}.${item.extensao}`}}
                                                            className="w-full rounded-xl mt-1"
                                                            style={{
                                                                height: height*0.23,
                                                                resizeMode:'contain'
                                                            }}
                                                        />
                                                    }
                                                    {item.txt.length < 144 ?
                                                        <Text className="mt-2 text-justify text-black font-nregular text-sm">
                                                            {item.txt}
                                                        </Text>
                                                    :
                                                        <TextoPost text={item.txt}/>
                                                    }
                                                    <View className="w-full h-6 items-end justify-start">
                                                        <Text className="text-[#727B80] font-nsemibold text-sm">
                                                            {item.createdAt.dia} de {item.createdAt.mes}, {item.createdAt.ano}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                    )})
                                }
                            </>
                        }
                    <View className="h-36"/>
                </ScrollView>
            </View>

            <View className="w-full bg-[#99A0B1] h-16 absolute bottom-0 justify-center items-center">
                <View className="w-5/6 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={()=>{isFunc ? navigation.navigate('horarioFunc') : navigation.navigate('horario')}}
                    >
                        <Image
                            source={require("../assets/home/Horario_icon.png")}
                            className="h-8 w-8"
                        />
                    </TouchableOpacity>
                    <View
                        className="w-0.5 h-8 bg-white rounded-full"
                    />
                    <TouchableOpacity
                        onPress={()=>navigation.navigate('refeitorio')}
                    >
                        <Image
                            source={require("../assets/home/Cardapio_icon.png")}
                            className="h-8 w-8"
                        />
                    </TouchableOpacity>
                    <View
                        className="w-0.5 h-8 bg-white rounded-full"
                    />
                    <TouchableOpacity
                        onPress={()=>navigation.navigate('login')}
                        className="items-center justify-center"
                    >
                        <Image
                            source={require("../assets/home/Home.png")}
                            className="h-8 w-8"
                        />
                        <Text className="font-nbold text-white text-sm">Home</Text>
                    </TouchableOpacity>
                    <View
                        className="w-0.5 h-8 bg-white rounded-full"
                    />
                    <TouchableOpacity
                        onPress={()=>navigation.navigate('emDesenvolvimento')}
                    >
                        <Image
                            source={require("../assets/home/Biblioteca_icon.png")}
                            className="h-8 w-8"
                        />
                    </TouchableOpacity>
                    <View
                        className="w-0.5 h-8 bg-white rounded-full"
                    />
                    <TouchableOpacity
                        onPress={()=>navigation.navigate('emDesenvolvimento')}
                    >
                        <Image
                            source={require("../assets/home/A_P_icon.png")}
                            className="h-8 w-8"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {isFunc &&
                <TouchableOpacity
                    className="bg-[#3A4365] rounded-full w-16 h-16 items-center justify-center"
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '8%',
                        zIndex: 9
                    }}
                    onPress={()=>navigation.navigate('criarPost')}
                >
                    <Feather
                        name="plus"
                        size={38}
                        color="#FFF"
                    />
                </TouchableOpacity>
            }
        </View>
    )
}