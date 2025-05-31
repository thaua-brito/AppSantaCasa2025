import React, { useEffect, useState } from "react";
import {View, Text, Image, StatusBar, ImageBackground, KeyboardAvoidingView, TextInput} from "react-native";
//import { TextInput } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const Login = (dados:any) =>{

 const [cpf, setCpf] = useState("");
 const [senha, setSenha] = useState("");
 const [carregando, setCarregando] = useState(false);
 const [tipoCliente, setTipoCliente] = useState("");


 useEffect(() => {
    loadToken();
  }, []);

  // Função para carregar o token armazenado
  const loadToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('userToken');
      if (savedToken !== null) {
        dados.controle("App");
      }
    } catch (error) {
      console.error('Erro ao carregar o token:', error);
    }
  };

  // Função para salvar o token
  const saveToken = async (newToken:any) => {
    try {
      await AsyncStorage.setItem('userToken', newToken);
      console.log('Token salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o token:', error);
    }
  };
  
 async function FazerLogin()
 {
    console.log("Chamou aqui");
    setCarregando(true);
    if(cpf != "" && senha != "" && cpf.length == 14)
    {
        
        await axios({
            method: "post",
            url: "https://ecommerce-backend-novo.caprover.santacasacopacabana.com.br/auth/login",
            data: {
                "usuario": cpf,
                "password": senha
            }
        }).then((resp)=>{
            
            console.log(resp.data)
            if(resp.data.AccessToken)
            {
                Toast.show({
                    type: 'success',
                    text1: 'Login efetuado!',
                    text2: 'Carrgando dados...'
                });
                saveToken(resp.data.AccessToken.toString());
                dados.controle("App");
            }
            else
            {
                Toast.show({
                    type: 'error',
                    text1: 'Verifique seus dados!',
                    text2: 'Verifique os dados digitados e tente novamente.'
                });
            }
            setCarregando(false);
        }).catch((er)=>{
            console.log(er);
            Toast.show({
                type: 'error',
                text1: 'Verifique seus dados!',
                text2: 'Verifique os dados digitados e tente novamente.'
            });
            setCarregando(false);
        });
        
    }
    else if(cpf != "" && senha != "" && cpf.length == 18)
    {
        
        await axios({
            method: "post",
            url: "https://ecommerce-backend-novo.caprover.santacasacopacabana.com.br/auth/login",
            data: {
                "usuario": cpf,
                "password": senha
            }
        }).then((resp)=>{
            
            console.log(resp.data)
            if(resp.data.AccessToken)
            {
                Toast.show({
                    type: 'success',
                    text1: 'Login efetuado!',
                    text2: 'Carrgando dados...'
                });
                saveToken(resp.data.AccessToken.toString());
                dados.controle("App");
            }
            else
            {
                Toast.show({
                    type: 'error',
                    text1: 'Verifique seus dados!',
                    text2: 'Verifique os dados digitados e tente novamente.'
                });
            }
            setCarregando(false);
        }).catch((er)=>{
            console.log(er);
            Toast.show({
                type: 'error',
                text1: 'Verifique seus dados!',
                text2: 'Verifique os dados digitados e tente novamente.'
            });
            setCarregando(false);
        });
        
    }
    else if(cpf.length != 18 && tipoCliente == "CNPJ")
    {
        Toast.show({
            type: 'info',
            text1: 'Informação Incompleta!',
            text2: "O CNPJ informado não é valido."
        });
        setCarregando(false);
    }
    else if(cpf.length != 14 && tipoCliente == "CPF")
    {
        Toast.show({
            type: 'info',
            text1: 'Informação Incompleta!',
            text2: "O CPF informado não é valido."
        });
        setCarregando(false);
    }
    else
    {
        Toast.show({
            type: 'error',
            text1: 'Verifique seus dados!',
            text2: 'Verifique os dados digitados e tente novamente.'
        });
        setCarregando(false);
    }

 }

 function Cadastro()
 {
    dados.controle("Cadastrar");
 }

 function EsqueciSenha()
 {
    dados.controle("EsqueciSenha");
 }

 const formatCPF = (inputCPF:any) => {
    // Remove caracteres não numéricos
    const numericCPF = inputCPF.replace(/[^\d]/g, '');

    // Aplica a máscara XXX.XXX.XXX-XX
    const maskedCPF = numericCPF.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );

    return maskedCPF;
  };

  const formatCNPJ = (inputCNPJ:any) => {
    // Remove caracteres não numéricos
    const numericCNPJ = inputCNPJ.replace(/[^\d]/g, '');
  
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    const maskedCNPJ = numericCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  
    return maskedCNPJ;
  };

  return (
    <>
    <StatusBar
        translucent={true}
        backgroundColor="transparent"
    />
    <View style={{flex: 1, position: "relative"}}>
        <Image
            style={{
                position: "absolute",
                width: "100%",
                height: "100%"
            }}
            source={require('../assets/imagens/fundo1.png')}
        />
        <View style={{flexGrow: 1,alignItems: 'center', justifyContent: 'center',}}>
            <Image
                style={{
                    height: "25%",
                }}
                resizeMode="contain"
                source={require('../assets/imagens/logo.png')}
            />
            {tipoCliente == "CPF" &&
            <>
            <View style={{
                backgroundColor:"#FFF",
                paddingVertical:8,
                paddingHorizontal:20,
                marginHorizontal:20,
                borderRadius:15,
                marginTop:25,
                flexDirection:"row",
                alignItems:"center",
                zIndex: 5
            }}>
                <TextInput
                    placeholder="CPF"
                    placeholderTextColor="#9C9C9C"
                    style={{
                        fontWeight:"bold",
                        fontSize:18,
                        width:"95%"
                    }}
                    value={cpf}
                    maxLength={14} // Limita o tamanho máximo para a máscara
                    onChangeText={(text) => {
                        const formattedCPF = formatCPF(text);
                        setCpf(formattedCPF);
                    }}
                />
                <Image
                source={require('../assets/imagens/user.png')}
                style={{height:20,width:20}}
                />
            </View>
            <View style={{
                backgroundColor:"#FFF",
                paddingVertical:8,
                paddingHorizontal:20,
                marginHorizontal:20,
                borderRadius:15,
                marginTop:25,
                flexDirection:"row",
                alignItems:"center",
                zIndex: 5
            }}>
                <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#9C9C9C"
                    style={{
                        fontWeight:"bold",
                        fontSize:18,
                        width:"95%"
                    }}
                    secureTextEntry={true}
                    value={senha}
                    onChange={(e)=>{
                        //console.log(e.nativeEvent.text); // Exibe o valor no console
                        setSenha(e.nativeEvent.text); // Atualiza o estado com o valor
                    }}
                />
                <Image
                source={require('../assets/imagens/key.png')}
                style={{height:20,width:20}}
                />
            </View>

            <View style={{flexDirection:"row",}}>
                <View style={{
                    paddingVertical:8,
                    paddingHorizontal:10,
                    marginHorizontal:10,
                    borderRadius:10,

                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 10,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && Cadastro()}}
                        >
                            Primeiro Acesso?
                        </Text>
                </View>
                <View style={{
                    paddingVertical:8,
                    paddingHorizontal:10,
                    marginHorizontal:10,
                    borderRadius:10,

                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 10,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && EsqueciSenha()}}
                        >
                            Esqueci Minha Senha.
                        </Text>
                </View>
            </View>

            <View style={{flexDirection:"row"}}>
                <View style={{
                    backgroundColor:`${carregando == false ? '#006ACE' : '#7E7E7E'}`,
                    paddingVertical:8,
                    paddingHorizontal:20,
                    marginHorizontal:20,
                    borderRadius:15,
                    marginTop:15,
                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 16,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && setTipoCliente("")}}
                        >
                            Voltar
                        </Text>
                    
                </View>
                <View style={{
                    backgroundColor:`${carregando == false ? '#1848A0' : '#7E7E7E'}`,
                    paddingVertical:8,
                    paddingHorizontal:20,
                    marginHorizontal:20,
                    borderRadius:15,
                    marginTop:15,
                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 16,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && FazerLogin()}}
                        >
                            {carregando == false ? 'Entrar' : 'Carregando...'}
                        </Text>
                    
                </View>
            </View>
            
            </>}

            {tipoCliente == "CNPJ" &&
            <>
            <View style={{
                backgroundColor:"#FFF",
                paddingVertical:8,
                paddingHorizontal:20,
                marginHorizontal:20,
                borderRadius:15,
                marginTop:25,
                flexDirection:"row",
                alignItems:"center",
                zIndex: 5
            }}>
                <TextInput
                    placeholder="CNPJ"
                    placeholderTextColor="#9C9C9C"
                    style={{
                        fontWeight:"bold",
                        fontSize:18,
                        width:"95%"
                    }}
                    value={cpf}
                    maxLength={18} // Limita o tamanho máximo para a máscara
                    onChangeText={(text) => {
                        const formattedCNPJ = formatCNPJ(text);
                        setCpf(formattedCNPJ);
                    }}
                />
                <Image
                source={require('../assets/imagens/user.png')}
                style={{height:20,width:20}}
                />
            </View>
            <View style={{
                backgroundColor:"#FFF",
                paddingVertical:8,
                paddingHorizontal:20,
                marginHorizontal:20,
                borderRadius:15,
                marginTop:25,
                flexDirection:"row",
                alignItems:"center",
                zIndex: 5
            }}>
                <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#9C9C9C"
                    style={{
                        fontWeight:"bold",
                        fontSize:18,
                        width:"95%"
                    }}
                    secureTextEntry={true}
                    value={senha}
                    onChange={(e)=>{
                        //console.log(e.nativeEvent.text); // Exibe o valor no console
                        setSenha(e.nativeEvent.text); // Atualiza o estado com o valor
                    }}
                />
                <Image
                source={require('../assets/imagens/key.png')}
                style={{height:20,width:20}}
                />
            </View>

            <View style={{flexDirection:"row",}}>
                <View style={{
                    paddingVertical:8,
                    paddingHorizontal:10,
                    marginHorizontal:10,
                    borderRadius:10,

                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 10,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && Cadastro()}}
                        >
                            Primeiro Acesso?
                        </Text>
                </View>
                <View style={{
                    paddingVertical:8,
                    paddingHorizontal:10,
                    marginHorizontal:10,
                    borderRadius:10,

                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 10,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && EsqueciSenha()}}
                        >
                            Esqueci Minha Senha.
                        </Text>
                </View>
            </View>

            <View style={{flexDirection:"row"}}>
                <View style={{
                    backgroundColor:`${carregando == false ? '#006ACE' : '#7E7E7E'}`,
                    paddingVertical:8,
                    paddingHorizontal:20,
                    marginHorizontal:20,
                    borderRadius:15,
                    marginTop:15,
                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 16,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && setTipoCliente("")}}
                        >
                            Voltar
                        </Text>
                    
                </View>
                <View style={{
                    backgroundColor:`${carregando == false ? '#1848A0' : '#7E7E7E'}`,
                    paddingVertical:8,
                    paddingHorizontal:20,
                    marginHorizontal:20,
                    borderRadius:15,
                    marginTop:15,
                    flexDirection:"row",
                    alignItems:"center",
                    zIndex: 5
                }}>
                    <Text style={{
                            paddingHorizontal:10,
                            fontWeight:"bold",
                            color:"#FFF",
                            fontSize: 16,
                            paddingTop:3
                        }}
                        onPress={()=>{carregando == false && FazerLogin()}}
                        >
                            {carregando == false ? 'Entrar' : 'Carregando...'}
                        </Text>
                    
                </View>
            </View>
            </>}

            {tipoCliente == "" &&
            <>
            <Text style={{
                        paddingHorizontal:10,
                        fontWeight:"bold",
                        color:"#FFF",
                        fontSize: 18,
                        paddingTop:3,
                        marginTop: 8,
                        textAlign: "center"
                    }}
                    >
                        Ecolha uma opção {"\n"}para começar:
                    </Text>

            <View style={{
                backgroundColor:`#1848A0`,
                paddingVertical:8,
                paddingHorizontal:20,
                marginHorizontal:20,
                borderRadius:15,
                marginTop:15,
                flexDirection:"row",
                alignItems:"center",
                zIndex: 5
            }}>
                <Text style={{
                        paddingHorizontal:10,
                        fontWeight:"bold",
                        color:"#FFF",
                        fontSize: 16,
                        paddingTop:3
                    }}
                    onPress={()=>{setTipoCliente("CPF")}}
                    >
                        Pessoa Física
                    </Text>
                
            </View>

            <View style={{
                backgroundColor:`#1848A0`,
                paddingVertical:8,
                paddingHorizontal:20,
                marginHorizontal:20,
                borderRadius:15,
                marginTop:15,
                flexDirection:"row",
                alignItems:"center",
                zIndex: 5
            }}>
                <Text style={{
                        paddingHorizontal:10,
                        fontWeight:"bold",
                        color:"#FFF",
                        fontSize: 16,
                        paddingTop:3
                    }}
                    onPress={()=>{setTipoCliente("CNPJ")}}
                    >
                        Pessoa Jurídica
                    </Text>
                
            </View>
            </>}


            
            
        </View>
    </View>
    </>
  )
}
export default Login;