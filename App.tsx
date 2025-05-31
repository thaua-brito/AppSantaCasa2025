import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeStackNavegacao from "./src/navegacao/navegacao";
import {View, Text, Image} from "react-native";
import Login from "./src/telas/login";
import Toast from 'react-native-toast-message';
import Cadastrar from "./src/telas/cadastrar";
import EsqueciSenha from "./src/telas/esquecisenha";

const App = () =>{
  const [controleTela,setControleTela] = useState("Login");
  return(
    <>
      <NavigationContainer>
          {controleTela == "App"?
            <HomeStackNavegacao controle={setControleTela} />
            :
            controleTela == "Login" ?
            <Login controle={setControleTela}/>
            :
            controleTela == "Cadastrar" ? 
            <Cadastrar controle={setControleTela} />
            :
            <EsqueciSenha controle={setControleTela} />
          }
      </NavigationContainer>
      <Toast />
    </>
  )
}

export default App;