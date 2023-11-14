import { View, TouchableOpacityProps, TouchableOpacity, Text } from "react-native";

interface Props extends TouchableOpacityProps {
    text: string
    erro?: string
}

export function BtnForm({text="", erro, ...rest}:Props){
    return(
        <View className="w-3/4 items-start">
            <TouchableOpacity
                className="bg-[#F5F7FA] h-14 w-full border border-gray-400 items-center justify-center rounded-xl"
                {...rest}
            >
                <Text className="text-standart font-nsemibold text-xl">
                    {text}
                </Text>
            </TouchableOpacity>
            {erro &&
                <Text className="font-nsemibold ml-1 text-red-700">
                    {erro}
                </Text>
            }
        </View>
    )
}