import {View, Text, TouchableOpacity, Dimensions, Image, TextInput, Touchable} from 'react-native';
import {useState, useEffect} from 'react';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import * as ImagePicker from 'expo-image-picker';
import { customAlphabet } from 'nanoid/non-secure';

import { Header } from '../components/Header'
import { Loading } from '../components/Loading';

import { api } from '../lib/axios';

export function CriarAep({navigation}){

    const isFocused = useIsFocused();

    useEffect(()=>{
        if(isFocused) getData();
    }, [isFocused]);

    async function getData(){
        setIsLoading(true);

        const conexao = await NetInfo.fetch();
        if(!conexao.isConnected) return navigation.navigate('login');
        
        const keys = await AsyncStorage.getAllKeys();
        if(!keys.includes('@email')) return navigation.navigate('login');

        const res = await api.get('/tagsAep');
        setTagsServer(res.data);

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
                setIdPost(newName);

                setFormDataImg({
                    name: `${newName}.${extension}`,
                    uri: assets[0].uri,
                    type: `image/${extension}`
                });
            }
        }
        else{
            alert("{erro} você não permitiu o acesso à sua galeria")
        }
    }

    async function upload(){
        try{
            setIsLoading(true);

            const formData = new FormData();
            formData.append('file', JSON.parse(JSON.stringify(formDataImg)));

            const res = await api.post('/aepFoto', formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert(res.data);
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

    const [txt, setTxt] = useState<string>('');
    const [tagsServer, setTagsServer] = useState<any>([]);
    const [tagsItem, setTagsItem] = useState<any>([]);
    const [photoShow, setPhotoShow] = useState<string>();
    const [extensao, setExtensao] = useState<string>();
    const [idPost, setIdPost] = useState<string>();
    const [formDataImg, setFormDataImg] = useState<object>();
    
    const [isLoading, setIsLoading] = useState<boolean>();
    
    if(isLoading) return <Loading/>

    return(
        <View className="flex-1 bg-back items-center">
            <Header
                title="A&P"
                onPress={()=>navigation.navigate('achadosPerdidos')}
            />
            <View className="w-[85%] mt-5">
                <Text className="text-standart font-nsemibold text-xl">
                    Anunciar item
                </Text>
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
                    Descrição do item
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
            <View className="w-[85%] mt-4 justify-center">
                <Text className="text-standart font-nsemibold text-lg">
                    Tags
                </Text>
            </View>
            <View className="bg-[#FAFAFA] rounded-lg w-[85%] h-32 flex-row flex-wrap mt-1">
                {tagsServer && tagsServer.map((item)=>{
                    return(
                        <TouchableOpacity
                            key={item.id}
                            className={`p-1 ${tagsItem.includes(item.id) ? "bg-[#3A4365]": "bg-[#BDC3C7]"} m-1 rounded-lg`}
                            onPress={()=>{
                                tagsItem.includes(item.id) ? 
                                    setTagsItem(tagsItem.filter((tag)=>tag != item.id))
                                : 
                                    setTagsItem([...tagsItem, item.id]);
                            }}
                        >
                            <Text className={`font-nsemibold text-xs ${tagsItem.includes(item.id) ? "text-back": "text-[#3C4460]"}`}>{item.txt}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <TouchableOpacity
                className="rounded-xl items-center justify-center bg-[#99A0B1] w-[85%] h-12 mt-[15%]"
                onPress={()=>upload()}
            >
                <Text className="text-white font-nbold text-base">
                    Enviar item
                </Text>
            </TouchableOpacity>
        </View>
    )
}