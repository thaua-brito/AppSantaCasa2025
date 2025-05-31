import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {View, Text, Image} from "react-native";
import {TextInput,ScrollView,TouchableOpacity} from 'react-native-gesture-handler';
import jsonBase from "../constantes/constantesBase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {ApiConstantes}  from "../constantes/apiconstantes";
import { useRoute } from '@react-navigation/native';


const Home = ({ navigation , route } : any) =>{

    const [acessToken,setAcessToken] = useState("");

    const [dadosUser, setDadosUser] = useState({
        Cpf: "",
        PrimeiroNome: "",
        Sobrenome: "",
        FotoURL: null,
        Email: "",
        Telefone: "",
        tipoUser: "",
    });
    const [meusDadosTotvs, setMeusDadosTotvs] = useState({} as any);
    const [codigoContrato, setCodigoContrato] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        loadToken();
      }, []);
    
      // Função para carregar o token armazenado
      const loadToken = async () => {
        try {
          const savedToken = await AsyncStorage.getItem('userToken');
          if (savedToken !== null) {
            setAcessToken(savedToken);
            BuscarMeusDados(savedToken);
          }
        } catch (error) {
          console.error('Erro ao carregar o token:', error);
        }
      };

    async function BuscarMeusDados(token: any)
    {
        await axios({
            method: "post",
            url: "https://ecommerce-backend-novo.caprover.santacasacopacabana.com.br/Login/VerificaToken",
            data: {
                "token": token,
            }
        }).then((resp)=>{
            console.log(resp.data);
            setDadosUser({
                Cpf: resp.data.Cpf,
                PrimeiroNome: resp.data.PrimeiroNome,
                Sobrenome: resp.data.Sobrenome,
                FotoURL: resp.data.FotoURL,
                Email: resp.data.Email,
                Telefone: resp.data.Telefone,
                tipoUser: resp.data.tipoUser,
            });
            BuscarMeusTotvs(token);

        }).catch((er)=>{
            console.log(er);
        });
    }

    async function BuscarMeusTotvs(token: any)
    {
        await axios({
            method: "get",
            url: "https://ecommerce-backend-novo.caprover.santacasacopacabana.com.br/Carterinha/buscar-minhas-infos",
            headers: {
                "Authorization": "Bearer "+token,
            }
        }).then((resp)=>{
            console.log(resp.data);
            setMeusDadosTotvs(resp.data.dados.data[0]);
            BuscarContrato(token);

        }).catch((er)=>{
            console.log(er);
        });
    }

    async function BuscarContrato(token: any)
    {
        await axios({
            method: "get",
            url: "https://ecommerce-backend-novo.caprover.santacasacopacabana.com.br/Carterinha/buscar-meu-contrato",
            headers: {
                "Authorization": "Bearer "+token,
            }
        }).then((resp)=>{
            console.log(resp.data);
            setCodigoContrato(resp.data.dados.data[0].CODIGOCONTRATO);
            setCarregando(false);

        }).catch((er)=>{
            console.log(er);
        });
    }


    function formatarNomes(str: string) {
        // Divide a string em palavras separadas por espaço
        const palavras = str.split(" ");
    
        // Itera sobre cada palavra e formata a primeira letra como maiúscula e o restante como minúscula
        const nomesFormatados = palavras.map(
          (palavra) =>
            palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
        );
    
        // Junta as palavras formatadas novamente em uma única string, separando-as com espaço
        const nomeCompletoFormatado = nomesFormatados.join(" ");
    
        return nomeCompletoFormatado;
    }

    function formatarCPF(cpf: string) {
        // Extrai cada bloco de números do CPF usando o método slice()
        const bloco1 = cpf.slice(0, 3);
        const bloco2 = cpf.slice(3, 6);
        const bloco3 = cpf.slice(6, 9);
        const digitoVerificador = cpf.slice(9);
    
        // Monta o CPF formatado
        const cpfFormatado = `${bloco1}.${bloco2}.${bloco3}-${digitoVerificador}`;
    
        return cpfFormatado;
    }

    function formatarCEP(cep: string) {
        // Extrai cada parte do CEP usando o método slice()
        const parte1 = cep.slice(0, 5);
        const parte2 = cep.slice(5);
    
        // Monta o CEP formatado
        const cepFormatado = `${parte1}-${parte2}`;
    
        return cepFormatado;
    }

    function formatarCelular(numero: string) {
        // Extrai cada parte do número usando o método slice()
        const ddd = numero.slice(0, 2);
        const parte1 = numero.slice(2, 7);
        const parte2 = numero.slice(7);
    
        // Monta o número formatado
        const numeroFormatado = `(${ddd}) ${parte1}-${parte2}`;
    
        return numeroFormatado;
    }

    async function Sair()
    {
        //console.log("-----------------------");
        //console.log(route);
        //console.log(route.params.route.params.controle);
        //console.log("-----------------------");
        try {
            await AsyncStorage.removeItem('userToken');
            //console.log(navigation);
            console.log('Token removido com sucesso!');
            route.params.route.params.controle("Login");
            } catch (error) {
            console.error('Erro ao remover o token:', error);
            }
    }

    function formatString(inputString: string) {
        if (inputString.length > 10) {
          return inputString.slice(0, 10) + "...";
        } else {
          return inputString;
        }
    }
    return(
        <View style={{
            backgroundColor: "#FFF",
            flex: 1
        }}>
            <View
                style={{
                    backgroundColor: "#0019A4",
                    height: "30%",
                    width: "100%",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    paddingHorizontal: 20,
                    zIndex: 1,
                }}
            >
                <Image
                        style={{
                            position: "absolute",
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            width: "112.5%",
                            height: "100%"
                        }}
                        source={require('../assets/imagens/fundo1.png')}
                    />
                <Image
                    source={require('../imagens/1.png')}
                    style={{
                        height:10,
                        width:20,
                        marginTop:50
                    }}
               />
    
               <View style={{
                   flexDirection:"row",
                   alignItems:"center",
                   marginTop:15,
                   width:"100%"
               }}>
                   <View style={{width:"50%"}}>
                        <Text style={{
                            fontSize:25,
                            color:"#FFF",
                            fontWeight:"bold"
                        }}>Olá, {formatString(formatarNomes(dadosUser.PrimeiroNome))}</Text>
                   </View>
                   <View style={{width:"50%",alignItems:"flex-end"}}>
                        <Image
                            source={require('../imagens/g.png')}
                            style={{height:60,width:60, marginTop: -35}}
                        />
                   </View>
               </View>
            </View>

            <LinearGradient
            colors={["rgba(0, 46, 163, 0.4)", "transparent"]}
            style={{
                left:0,
                right:0,
                height:90,
                marginTop:-45,
                zIndex: -1
            }}
           >
            </LinearGradient>

            <LinearGradient
            colors={["transparent", "transparent"]}
            style={{
                left:0,
                right:0,
                height:90,
                marginTop:-92,
                zIndex: 1
            }}
           >
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
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:18,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Perfil</Text>
                    
                   <Image
                    source={require('../assets/imagens/user.png')}
                    style={{height:20,width:20}}
                   />
               </View>
            </LinearGradient>
            {carregando == false ?
            <ScrollView 
                horizontal={false}
                showsVerticalScrollIndicator={false}
            >
            {/* SEÇÃO RECOMENDADOS*/}
            <View style={{
                flexDirection:"row",
                paddingHorizontal:20,
                width:"100%",
                alignItems:"center"
            }}>
                <View style={{width:"50%"}}>
                    <Text style={{
                        fontWeight:"bold",
                        fontSize:17,
                        color:"#585a61"
                    }}>Seus Dados:</Text>

                </View>
            </View>


            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
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
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Nome: {formatarNomes(meusDadosTotvs.NOMEFANTASIA)}</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>CPF: {formatarCPF(meusDadosTotvs.CGCCFO)}</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Endereço: {meusDadosTotvs.RUAPGTO}</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Número: {meusDadosTotvs.NUMEROPGTO}</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Estado: {
                            ApiConstantes.comboEstados.estados.find(
                              (element) => {
                                return (
                                  element.sigla == meusDadosTotvs.CODETDPGTO
                                );
                              }
                            )?.nome
                          }</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Cidade: {meusDadosTotvs.CIDADE}</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>CEP: {formatarCEP(meusDadosTotvs.CEP)}</Text>
            </View>
            <View style={{
                   backgroundColor:"#FFF",
                   borderColor: "#1d4ed8",
                   borderWidth: 2,
                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,
                   borderRadius:15,
                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   zIndex: 5
               }}>
                   <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#9C9C9C"
                        }}>Celular: {formatarCelular(meusDadosTotvs.TELEFONE)}</Text>
            </View>
            <View style={{


                   paddingVertical:8,
                   paddingHorizontal:20,
                   marginHorizontal:20,

                   marginTop:10,
                   flexDirection:"row",
                   alignItems:"center",
                   justifyContent: "center",
                   zIndex: 5
               }}>
            <Text style={{
                            fontWeight:"bold",
                            fontSize:15,
                            width:"95%",
                            color: "#A02D2D",
                            alignItems:"center",
                            textAlign: "center",
            }}>*Para realização de alteração cadastral favor ligar para (00)0000-0000.</Text>
            </View>
            <View style={{


            paddingVertical:8,
            paddingHorizontal:20,
            marginHorizontal:20,
            marginBottom: 20,

            marginTop:10,
            flexDirection:"row",
            alignItems:"center",
            justifyContent: "center",
            zIndex: 5
            }}>
            <View style={{
                                backgroundColor:"#0062A4",
                                paddingHorizontal:20,
                                paddingVertical:5,
                                borderRadius:15
                                
                            }}
                            >
                                <Text style={{
                                    fontWeight:"bold",
                                    fontSize:13,
                                    color:"#FFF"
                                }} onPress={()=>{Sair()}}>Sair da Conta</Text>
                            </View>
            </View>
     

            </ScrollView>
            : <><View style={{
                flexDirection:"row",
                paddingHorizontal:20,
                width:"100%",
                alignItems:"center"
            }}>
                <View style={{width:"100%"}}>
                    <Text style={{
                        fontWeight:"bold",
                        fontSize:17,
                        color:"#585a61"
                    }}>Buscando seus dados aguarde...</Text>
                </View>
            </View></>}
            
        </View>
    )
}
export default Home;