import {TouchableOpacity, TouchableOpacityProps, View, Text} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface DropDownProps extends TouchableOpacityProps{
    id: string
    nome: string
    sigla: string
    presente: string
    isOpen: boolean
    funcPresenca: any
}

export function DropDownProf({id, nome="-", sigla="-", presente="#FFC700", isOpen=false, funcPresenca, ...rest}:DropDownProps){

    if(isOpen) return(
        <View className="w-full mb-3">
            <View className="flex-row justify-between">
                <View className="bg-white h-36 w-[75%] rounded-xl justify-between">
                    <TouchableOpacity className="bg-standart h-[40%] w-full rounded-xl justify-between items-center p-2 flex-row" {...rest}>
                        <Text className="text-white font-nsemibold text-base">
                            {nome}
                        </Text>
                        <FontAwesome
                            name="circle"
                            size={20}
                            color={presente}
                        />
                    </TouchableOpacity>
                    <View className="h-[60%] items-center p-1">
                        <View className="w-full items-center">
                            <Text className="font-nsemibold text-base text-standart">
                                Este professor está presente?
                            </Text>
                        </View>
                        <View className="w-2/3 flex-row justify-between mt-2">
                            <TouchableOpacity
                                className="bg-[#99A0B1] w-20 h-10 rounded-md items-center justify-center"
                                onPress={()=>funcPresenca(id, "#00B489")}
                            >
                                <Text className="text-white font-nsemibold">
                                    Sim
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-[#99A0B1] w-20 h-10 rounded-md items-center justify-center"
                                onPress={()=>funcPresenca(id, "#CC3535")}
                            >
                                <Text className="text-white font-nsemibold">
                                    Não
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity className="bg-standart h-16 w-16 rounded-xl justify-center items-center" {...rest}>
                    <Text className="text-white font-nsemibold text-base">
                        {sigla}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return(
        <TouchableOpacity className="w-full mb-3" {...rest}>
            <View className="flex-row justify-between">
                <View className="bg-white h-16 w-[75%] rounded-xl justify-between items-center p-2 flex-row">
                    <Text className="text-standart font-nsemibold text-base">
                        {nome}
                    </Text>
                    <FontAwesome
                        name="circle"
                        size={20}
                        color={presente}
                    />
                </View>
                <View className="bg-white h-16 w-16 rounded-xl justify-center items-center">
                    <Text className="text-standart font-nsemibold text-base">
                        {sigla}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}