import { Video } from "expo-av";
import React from "react";
import {View, Text, Image,ScrollView, TouchableOpacity} from "react-native";



export default function Detalhes({navigation, route} : any){
    return(
        <>
        <View style={{flex: 0.5}}>
            <Video
                source={{
                    uri: route.params.trailer,
                  }}
                  style={{alignSelf:"stretch", backgroundColor: "#000", height: "100%", width: "100%"}}
                useNativeControls={false}
                resizeMode={"contain"}
                isMuted={true}
                shouldPlay={true}
            />
        </View>

        <ScrollView style={{flex: 0.5}} horizontal={false}>

        {console.log(route.params.episodios.length)}
        {route.params.episodios.map((item: any, index: number) => {
            return(
        <TouchableOpacity 
            onPress={()=>navigation.navigate("Visualizador", {video: item.link})}
            activeOpacity={1}
            key={index}
        >
        <View style={{
               flexDirection:"row",
               height:80,
               width:"90%",
               alignSelf: "center",
               backgroundColor:"#fff",
               elevation:2,
               padding: 0,
               marginVertical:10,
               borderRadius:10
        }}> 
            <View>
                <Image
                    source={{uri: item.thumb}}
                    style={{
                        height: "100%",
                        width: 90,
                        marginRight: 2,
                        borderRadius:10
                    }}
                />
            </View>

            <View style={{
                    width:"65%",
                    paddingHorizontal: 10,
                    justifyContent: "center",
                    height:"100%"
                }}>
                    <Text style={{
                        fontSize:12,
                        fontFamily:"Bold",
                        marginBottom: 2
                    }}>
                    {item.titulo}
                    </Text>

                    <Text style={{
                        fontSize: 11,
                        fontFamily:"Medium",
                        color: "#555555"

                    }}>
                    {item.descricao.substring(0,80)}...
                    </Text>

                    <Text style={{
                        fontSize:12,
                        fontFamily:"Bold",
                        marginTop: 2,
                        color: "#353535"
                    }}>
                    {item.duracao}
                    </Text>
            </View>

        </View>

        </TouchableOpacity>
        )})}
        
        </ScrollView>
        
        </>
    )
}