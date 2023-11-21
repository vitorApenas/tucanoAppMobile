import { View, Text, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import * as ImagePicker from 'expo-image-picker';
import { customAlphabet } from "nanoid/non-secure";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "../components/Header";
import { Loading } from '../components/Loading';

import { api } from "../lib/axios";

export function CriarPost({navigation}){

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
        if(!keys.includes('@email')) return navigation.navigate('login');

        setIsLoading(false);
    }

    async function imagem(){
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(granted){
            const {assets, canceled} = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [16, 9],
                allowsEditing: true
            });

            if(!canceled){
                setPhotoShow(assets[0].uri);

                const fileName = assets[0].uri.substring(assets[0].uri.lastIndexOf('/')+1, assets[0].uri.length);
                const extension = fileName.split('.')[1];
                setExtensao(extension);

                const newName = nanoId();
                setIdName(newName);

                setFormDataImg({
                    name: `${newName}.${extension}`,
                    uri: assets[0].uri,
                    type: 'image/' + extension
                });
            }

        }
        else{
            alert("{erro} voce não permitiu o acesso a sua galeria")   
        }
    }

    async function upload(){
        try{
            setIsLoading(true);
            const email = await AsyncStorage.getItem('@email');
            if(!formDataImg){
                const newId = nanoId();
                const resPost = await api.post('/uploadPost', {
                    id: newId,
                    txt: txt,
                    foto: false,
                    email: email
                });
                if(resPost.data === 200) return navigation.navigate('home');
            }
            else{
                const formData = new FormData();
                formData.append('file', JSON.parse(JSON.stringify(formDataImg)));

                const res = await api.post('/postFoto', formData, {
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if(res.data === 200){
                    const resPost = await api.post('/uploadPost', {
                        id: idName,
                        txt: txt,
                        foto: true,
                        ext: extensao,
                        email: email
                    });
                    if(resPost.data === 200) return navigation.navigate('home');
                }
                else navigation.navigate('login');
            }
            setIdName('');
        }
        catch(err){
            navigation.navigate('login');
        }
        finally{
            setIsLoading(false);
        }
    }

    const screenWidth = Dimensions.get('screen').width;
    const nanoId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-");
    
    const [formDataImg, setFormDataImg] = useState<object>();
    const [extensao , setExtensao] = useState<string>('');
    const [photoShow, setPhotoShow] = useState<string>();
    const [txt, setTxt] = useState<string>();
    const [idName, setIdName] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>();

    if(isLoading) return <Loading/>

    return(
        <SafeAreaView className="flex-1 bg-back items-center">
            <Header
                title="Nova Postagem"
                onPress={()=>{navigation.navigate('home')}}
            />
            <View className="w-[85%] flex-row mt-5 items-center">
                <Text className="text-standart font-nsemibold text-xl">
                    Novo Post
                </Text>
                <Image
                    className="w-5 h-5 ml-1"
                    source={require('../assets/estrelas.png')}
                />
            </View>
            <TouchableOpacity
                style={{
                    width: screenWidth*0.85,
                    height: screenWidth*0.48
                }}
                className="bg-[#FAFAFA] rounded-xl items-center justify-center mt-1"
                onPress={()=>imagem()}
            >
                {photoShow ?
                    <Image
                        source={{uri: photoShow}} 
                        className="h-full w-full rounded-xl"
                        style={{resizeMode: 'contain'}}
                    />
                    :
                    <>
                        <Image
                        source={require('../assets/adcImagem.png')}
                        className="h-12 w-12"
                        />
                        <Text className="text-standart font-nbold text-base">
                            Adicionar foto
                        </Text>
                        <Text className="text-[#8889A0] font-nsemibold text-sm">
                            Utilize uma foto nítida e na horizontal
                        </Text>
                    </>
                }
            </TouchableOpacity>

            <View className="w-[85%] mt-5 justify-center">
                <Text className="text-standart font-nsemibold text-lg">
                    Descrição do post
                </Text>
            </View>
            <TextInput
                className="bg-[#FAFAFA] rounded-lg w-[85%] h-20 items-start font-nregular p-1 mt-1"
                multiline
                textAlignVertical={"top"}
                placeholder="Escreva aqui..."
                value={txt}
                onChangeText={(value)=>setTxt(value)}
            />

            <TouchableOpacity
                className="rounded-xl items-center justify-center bg-[#FAFAFA] w-[85%] h-12 mt-[60%]"
                onPress={()=>{setPhotoShow(undefined); setFormDataImg(undefined)}}
            >
                <Text className="text-standart font-nbold text-base">
                    Remover imagem
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="rounded-xl items-center justify-center bg-[#99A0B1] w-[85%] h-12 mt-[5%]"
                onPress={()=>upload()}
            >
                <Text className="text-white font-nbold text-base">
                    Enviar item
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}