import {TouchableOpacity, Text, View, TouchableOpacityProps } from 'react-native'

interface Props extends TouchableOpacityProps {
    text: string
    isMarked: boolean
}

export function TabForm({text="", isMarked=false, ...rest}: Props){
    return(
        <TouchableOpacity className="w-32 items-center" {...rest}>
            <Text className="text-standart font-nmedium text-sm">
                {text}
            </Text>
            {/*
                <View className={`h-1 w-full rounded-full bg-${isMarked ? 'standart' : '[#BDC3C7]'}`}/>
            */}
            {isMarked ? 
                <View className={`h-1 w-full rounded-full bg-standart`}/>
            :
                <View className={`h-1 w-full rounded-full bg-[#BDC3C7]`}/>
            }
            
        </TouchableOpacity>
    )
}