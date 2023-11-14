import {View, ActivityIndicator} from 'react-native'

export function Loading(){
    return(
        <View className="flex-1 bg-back justify-center items-center">
            <ActivityIndicator size="large" color="#3A4365"/>
        </View>
    )    
}