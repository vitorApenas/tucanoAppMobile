import { View, TouchableOpacity, Text, ToastAndroid } from "react-native";
import { useState } from 'react';
import { api } from "../lib/axios";

interface Props{
    id: string,
    navigation: any
}

export function ConfigPostFix({id, navigation}:Props){
    
    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function unpinPost(){
        const res = await api.post('/desafixarPost');

        if(res.data.msg) return ToastAndroid.show(res.data.msg, ToastAndroid.LONG);
        if(res.data === 200) return navigation.navigate('login');
    }

    async function deletePost(){
        const res = await api.post('/deletarPost', {
            id: id
        });

        if(res.data.msg) return ToastAndroid.show(res.data.msg, ToastAndroid.LONG);
        if(res.data === 200) return navigation.navigate('login');
    }
    
    if(isOpen) return(
        <>
        <TouchableOpacity
            className="absolute right-2 top-0"
            onPress={()=>setIsOpen(false)}
        >
            <Text className="text-standart font-nextrabold text-4xl">
                ...
            </Text>
        </TouchableOpacity>
        <View className="bg-white w-40 absolute right-2 top-10">
            <TouchableOpacity
                className="w-full h-10 justify-center border border-gray-400"
                onPress={()=>unpinPost()}
            >
                <Text className="font-nsemibold text-black text-base ml-1">
                    Desafixar post
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="w-full h-10 justify-center border border-gray-400"
                onPress={()=>deletePost()}
            >
                <Text className="font-nsemibold text-black text-base ml-1">
                    Excluir post
                </Text>
            </TouchableOpacity>
        </View>
        </>
    )

    return(
        <TouchableOpacity
            className="absolute right-2 top-0"
            onPress={()=>setIsOpen(true)}
        >
            <Text className="text-standart font-nextrabold text-4xl">
                ...
            </Text>
        </TouchableOpacity>
    )
}