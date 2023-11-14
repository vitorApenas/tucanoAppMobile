import { View, Text } from 'react-native';
import { TextInput as PTextInput} from 'react-native-paper';

type Props = React.ComponentProps<typeof PTextInput> & {
    label: string
    legenda?: string
}

export function InputLogin({label="", legenda,  ...rest}:Props){
    return(
        <View className="w-3/4 items-start">
            <PTextInput
                mode="outlined"
                label={`${label}`}
                outlineColor='#6B7280'
                activeOutlineColor='#6B7280'
                textColor='#5C6480'
                className="bg-[#F5F7FA] w-full rounded-lg text-md"
                {...rest}
            />
            {legenda && 
                <Text className="font-nsemibold ml-1 text-[#7F779A] mt-0">
                    {legenda}
                </Text>
            }
        </View>
    )
}