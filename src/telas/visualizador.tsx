import { Video } from "expo-av";
import React from "react";
import {View, Text, Image,ScrollView} from "react-native";



export default function Visualizador({navigation, route} : any){
    return(
        <>
        <View style={{flex: 1}}>
            <Video
                source={{
                    uri: route.params.video,
                  }}
                  style={{alignSelf:"stretch", backgroundColor: "#000", height: "100%", width: "100%"}}
                useNativeControls={true}
                resizeMode={"contain"}
                isMuted={false}
                shouldPlay={true}
            />
        </View>      
        </>
    )
}