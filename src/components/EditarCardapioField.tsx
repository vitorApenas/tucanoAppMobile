import {View, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';

interface Props extends TouchableOpacityProps {
    isOpened: boolean
    title: string
    content1:string
    content2?:string
    horarioOpen:string
    horarioClose:string
    funcEditar:()=>void
}

export function EditarCardapioField({isOpened, title, content1, content2, horarioOpen, horarioClose, funcEditar,  ...rest}:Props){

    
    if(!isOpened) return(
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
    );

    if(isOpened) return(
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
            <View className="flex-row items-center w-full -mt-[2%]">
                <View className="flex-row items-center w-full justify-between">
                    <View className="flex-row items-center">
                        <View className="ml-[10%]">
                            <FontAwesome name="circle" size={8} color="#8087A0"/>
                        </View>
                        <Text className="font-nsemibold text-[#8087A0] text-base ml-[2%]">
                            {`${horarioOpen} às ${horarioClose}`}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="bg-[#3A4365] rounded-full w-12 h-12 items-center justify-center mr-[5%]"
                        onPress={()=>funcEditar()}
                    >
                        <Feather
                            name="edit"
                            size={28}
                            color="#ECF0F1"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}