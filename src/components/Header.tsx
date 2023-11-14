import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Feather } from "@expo/vector-icons";

interface Props extends TouchableOpacityProps {
    title: string
}

export function Header({title, ...rest}: Props){
    return(
        <View className="w-full bg-[#99A0B1] h-20 flex-row items-end px-2">
            <TouchableOpacity
                className="mb-1"
                {...rest}
            >
                <Feather
                    name="arrow-left"
                    size={38}
                    color="#3A4365"
                />
            </TouchableOpacity>
            <Text className="font-nsemibold text-back text-3xl ml-2">
                {title}
            </Text>
        </View>
    )
}