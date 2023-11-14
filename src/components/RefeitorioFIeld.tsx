import {View, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

interface Props extends TouchableOpacityProps {
    isOpened: boolean
    title: string,
    content1:string,
    content2?:string,
    horarioOpen:string,
    horarioClose:string
}

export function RefeitorioField({isOpened, title, content1, content2, horarioOpen, horarioClose,  ...rest}:Props){

    
    return !isOpened ? (
        <TouchableOpacity className="w-5/6 h-[8%] border border-gray-400 rounded-xl flex-row items-center justify-between" {...rest}>
            <Text className="font-nbold text-standart text-xl ml-[5%]">{title}</Text>
            <View className="mr-[5%]">
                <Feather
                    name="chevron-down"
                    color="#3A4365"
                    size={40}
                />
            </View>
        </TouchableOpacity>
    )

    : (
        <TouchableOpacity className="w-5/6 h-[25%] border border-gray-400 rounded-xl" {...rest}>
            <View className='w-full flex-row justify-between items-center mt-[3.5%]'>
                <Text className="font-nbold text-standart text-xl ml-[5%]">{title}</Text>
                <View className="mr-[5%]">
                    <Feather
                        name="chevron-right"
                        color="#3A4365"
                        size={40}
                    />
                </View>
            </View>
            <View className="flex-row items-center w-full mt-[1%]">
                <View className="ml-[5%]">
                    <FontAwesome name="circle" size={8} color="#8087A0"/>
                </View>
                <Text className="font-nsemibold text-[#8087A0] text-base ml-[2%]">
                    {content1}
                </Text>
            </View>
            {content2 &&
                <View className="flex-row items-center w-full mt-0">
                    <View className="ml-[5%]">
                        <FontAwesome name="circle" size={8} color="#8087A0"/>
                    </View>
                    <Text className="font-nsemibold text-[#8087A0] text-base ml-[2%]">
                        {content2}
                    </Text>
                </View>
            }
            <Text className="font-nsemibold text-standart text-lg ml-[5%] mt-[2%]">Horário:</Text>
            <View className="flex-row items-center w-full">
                <View className="flex-row items-center w-full mt-[1%]">
                    <View className="ml-[5%]">
                        <FontAwesome name="circle" size={8} color="#8087A0"/>
                    </View>
                    <Text className="font-nsemibold text-[#8087A0] text-base ml-[2%]">
                        {`${horarioOpen} às ${horarioClose}`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}