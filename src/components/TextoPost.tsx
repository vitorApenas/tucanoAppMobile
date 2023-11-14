import { TouchableOpacity, Text, View } from 'react-native'
import { useState } from 'react'

interface Props{
    text: string
}

export function TextoPost({text}:Props){

    const [fullText, setFullText] = useState<boolean>(false);

    return(
        <TouchableOpacity
            onPress={()=>setFullText(!fullText)}
        >
            {fullText ?
                <>
                <Text className="mt-2 text-justify text-black font-nregular text-sm">
                    {text}
                </Text>
                <View className="w-full items-end">
                    <Text className="mt-2 text-justify text-standart font-nsemibold text-sm">
                        Mostrar menos
                    </Text>
                </View>
            </>
            :
                <>
                    <Text className="mt-2 text-justify text-black font-nregular text-sm">
                        {text.slice(0, 143)}...
                    </Text>
                    <View className="w-full items-end">
                        <Text className="mt-2 text-justify text-standart font-nsemibold text-sm">
                            Ler mais
                        </Text>
                    </View>
                </>
            }
            
        </TouchableOpacity>
    )
}