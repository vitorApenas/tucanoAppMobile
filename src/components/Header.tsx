import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Feather } from "@expo/vector-icons";

interface Props extends TouchableOpacityProps {
    title: string
}

export function Header({title, ...rest}: Props){
    return(
        <View className="w-full bg-[#99A0B1] flex-row items-center px-2 h-14 rounded-b-md">
            <TouchableOpacity
                {...rest}
            >
                <Feather
                    name="arrow-left"
                    size={32}
                    color="#3A4365"
                />
            </TouchableOpacity>
            <Text className="font-nsemibold text-back text-xl ml-2">
                {title}
            </Text>
        </View>
    )
}