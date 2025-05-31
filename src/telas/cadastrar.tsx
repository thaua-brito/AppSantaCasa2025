import React, { useEffect, useState } from "react";
import {View, Text, Image, StatusBar, ImageBackground, KeyboardAvoidingView, TextInput} from "react-native";
import { WebView }  from 'react-native-webview';

const Web = WebView as any;

const Cadastrar = (dados:any) =>{
    const iframeUrl = 'https://portal-santa-casa-front.caprover.santacasacopacabana.com.br/cadastrar';

    function MudouURL(dadosLocalIframe:any)
    {
        console.log(dadosLocalIframe);
        if(dadosLocalIframe.url != "https://portal-santa-casa-front.caprover.santacasacopacabana.com.br/cadastrar")
        {
            dados.controle("Login");
        }
    }

  return (
    <>
    <StatusBar
        translucent={true}
        backgroundColor="transparent"
    />
    <View style={{flex: 1}}>
        <Image
            style={{
                position: "absolute",
                width: "100%",
                height:600
            }}
            source={require('../assets/imagens/fundo1.png')}
        />
        <Web source={{ uri: iframeUrl }} onNavigationStateChange={(e:any)=>{MudouURL(e)}} />

    </View>
    </>
  )
}
export default Cadastrar;