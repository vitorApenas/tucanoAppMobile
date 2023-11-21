import {View, Text, ViewProps} from 'react-native';

interface Props extends ViewProps {
    label: string
    text: string
}

export function CarteirinhaField({label, text, ...rest}:Props){
    return(
        <View className="h-[10%] w-[85%] justify-between" {...rest}>
            <Text className="font-nmedium text-standart text-base">
                {label}
            </Text>
            <View className="w-full h-2/3 border border-gray-300 rounded-lg justify-center p-1 pb-2">
                <Text className="font-nsemibold text-black text-lg">
                    {text}
                </Text>
            </View>
        </View>
    )
}