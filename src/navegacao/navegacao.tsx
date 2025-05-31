import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../telas/home";
import Detalhes from "../telas/detalhes";
import Perfil from "../telas/perfil";
import Favoritos from "../telas/favoritos";
import Visualizador from "../telas/visualizador";
import { Image, StatusBar } from "react-native";

const Tab = createBottomTabNavigator() as any;

const BottomTabsNav = (dados: any) => {
    return(
        <Tab.Navigator
            screenOptions={{
                    tabBarStyle:{
                        height:65,
                        justifyContent:"center",
                        paddingVertical:15,
                        backgroundColor:"#eff4f0",
                        elevation:2
                    }
                }
            }
            initialParams={{ dados: 'Valor que você quer passar 2' }}
        >
            <Tab.Screen name="Home" component={Home} options={{
                    headerShown: false,
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size}:any)=>(
                        <Image source={require("../imagens/888.png")} 
                        style={{height: 20, width: 20}}/>
                    )
                    
                }
            }

            initialParams={dados}
            
            />

            <Tab.Screen name="Favoritos" component={Favoritos} options={{
                    headerShown: false,
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size}:any)=>(
                        <Image source={require("../imagens/88.png")} 
                        style={{height: 20, width: 20}}/>
                    )
            }}
            />

            <Tab.Screen name="Perfil" component={Perfil} options={{
                    headerShown: false,
                    tabBarLabel: "",
                    tabBarIcon: ({ color, size}:any)=>(
                        <Image source={require("../imagens/8.png")} 
                        style={{height: 20, width: 20}}/>
                    )
            }}
            />

            
        </Tab.Navigator>
    )
}

const Stack = createStackNavigator() as any;
const telaStyle = {
    headerShown: false,
    orientation: 'portrait'
}

const HomeStackNavegacao = (dados:any) =>{
    return(
        <>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
            />
            <Stack.Navigator screenOptions={telaStyle} >
                <Stack.Screen name="Home" component={BottomTabsNav} initialParams={dados}/>
                <Stack.Screen name="Detalhes" component={Detalhes} />
                <Stack.Screen name="Visualizador" component={Visualizador} />
            </Stack.Navigator>
        </>
    )
}

export default HomeStackNavegacao;