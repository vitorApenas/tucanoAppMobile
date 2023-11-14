import {TouchableOpacity, Text, TouchableOpacityProps, View, FlatList} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props extends TouchableOpacityProps {
    isOpened: boolean,
    diaSemana: string
    horario: any,
    navigation?: any,
    isFunc: boolean
}

export function EditarHorarioField({isOpened, diaSemana, horario, navigation, isFunc, ...rest}:Props){
    return !isOpened ? (
        <TouchableOpacity className="w-full h-20 bg-white mt-5 rounded-xl border border-gray-300 items-center justify-center" {...rest}>
            <Text className="font-nbold text-[#7C839C] text-lg text-center">
                {diaSemana}
            </Text>
        </TouchableOpacity>
    )
    :
    (
        <View className="w-full bg-white mt-5 rounded-xl items-center">
            <TouchableOpacity className="w-full h-20 bg-[#5C6480] rounded-xl items-center justify-center" {...rest}>
                <Text className="font-nbold text-white text-lg text-center">
                    {diaSemana}
                </Text>
                {isFunc && 
                    <TouchableOpacity
                        className="bg-[#ECF0F1] rounded-full w-12 h-12 items-center justify-center absolute right-[2%]"
                        onPress={()=>navigation.navigate('editarHorarioDia', {
                            dia: diaSemana,
                            horario: horario
                        })}
                    >
                        <Feather
                            name="edit"
                            size={28}
                            color="#3A4365"
                        />
                    </TouchableOpacity>
                }
            </TouchableOpacity>
            <View className="w-full flex-row justify-center">
                <View className="w-1/3 items-center">
                    <Text className="font-nbold text-standart text-base">
                        Horário
                    </Text>
                </View>
                <View className="w-1/3 items-center">
                    <Text className="font-nbold text-standart text-base">
                        Matéria
                    </Text>
                </View>
                <View className="w-1/3 items-center">
                    <Text className="font-nbold text-standart text-base">
                        Professor
                    </Text>
                </View>
            </View>
            {horario.map((item)=>(
                <View className="w-full flex-row justify-evenly" key={item.aula}>
                    <View className="border-standart border-r w-1/3 items-center justify-center">
                        <Text className="font-nbold text-standart text-base">
                            {item.horario}
                        </Text>
                    </View>
                    <View className="w-1/3 items-center justify-center">
                        <Text className="font-nbold text-standart text-base">
                            {item.materia}
                        </Text>
                    </View>
                    <View className="border-standart border-l w-1/3 items-center justify-center">
                        <Text className="font-nbold text-standart text-base">
                            {item.prof}
                        </Text>
                    </View>
                </View>
            ))}
            <View className="h-1"/>
        </View>
    )
}