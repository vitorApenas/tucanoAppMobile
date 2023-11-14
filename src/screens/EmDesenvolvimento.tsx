import { View, Text } from 'react-native';

import { Header } from '../components/Header';

export function EmDesenvolvimento({navigation}){
    return(
        <View className="flex-1 bg-back items-center">
            <Header
                title="Em desenvolvimento"
                onPress={()=>navigation.navigate('home')}
            />
            <View className="w-5/6 items-center mt-10">
                <Text className="text-lg font-nsemibold ml-1 text-red-700 text-center">
                    Essa funcionalidade ainda está em desenvolvimento
                </Text>
            </View>
        </View>
    )
}