import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, Image, Clipboard } from "react-native";
import {TextInput,ScrollView,TouchableOpacity} from 'react-native-gesture-handler';
import jsonBase from "../constantes/constantesBase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {ApiConstantes}  from "../constantes/apiconstantes";
import { DataTable } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const Favoritos = ({navigation} : any) =>{

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

    const [minhasFaturasOrg, setMinhasFaturasOrg] = useState([] as any);

    // Função para limpar o token
    const clearToken = async () => {
        try {
        await AsyncStorage.removeItem('userToken');
        console.log('Token removido com sucesso!');
        } catch (error) {
        console.error('Erro ao remover o token:', error);
        }
    };

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
            BuscarDadosFaturas(token);

        }).catch((er)=>{
            console.log(er);
        });
    }


    function GerarBoleto(dadosBoleto: any) {
        console.log(dadosBoleto);
    }
    
    function obterMesPorExtenso(data: string) {
    const mesesPorExtenso = [
        "JAN",
        "FEV",
        "MAR",
        "ABR",
        "MAI",
        "JUN",
        "JUL",
        "AGO",
        "SET",
        "OUT",
        "NOV",
        "DEZ",
    ];

    const dataObj = new Date(data);
    const mes = dataObj.getMonth();

    return mesesPorExtenso[mes];
    }

    function formatarData(data: any) {
    const dataObj = new Date(data);

    // Obtém o dia, mês e ano da data
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0"); // Os meses são indexados de 0 a 11
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
    }

    function formatarMoeda(valor: string) {
    const valorNumerico = parseFloat(valor);
    return valorNumerico.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    }

    const isDatePassed = (dateString: string) => {
        const parts = dateString.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
    
        const currentDate = new Date();
        const inputDate = new Date(year, month - 1, day); // Mês começa em 0 no JavaScript
    
        return inputDate < currentDate;
    };
    
    async function BuscarDadosFaturas(token: any) {

        await axios({
            method: "get",
            url: "https://ecommerce-backend-novo.caprover.santacasacopacabana.com.br/Carterinha/buscar-minhas-faturas",
            headers: {
                "Authorization": "Bearer "+token,
            }
            }).then((resp)=>{
                console.log(resp.data);

                let orgFat = [] as any;
        
                for (let i = 0; i < resp.data.dados.length; i++) {
                    orgFat.push({ id: i, mesRef: obterMesPorExtenso(resp.data.dados[i].dadosTotvs.DATAVENCIMENTO), vencimento: formatarData(resp.data.dados[i].dadosTotvs.DATAVENCIMENTO), valor: formatarMoeda(resp.data.dados[i].dadosTotvs.VALORORIGINAL), status: (
                        resp.data.dados[i].dadosTotvs.DATABAIXA
                          ? "Pago"
                          : isDatePassed(
                              formatarData(resp.data.dados[i].dadosTotvs.DATAVENCIMENTO)
                            )
                          ? "Vencida"
                          : "Em Aberto"
                      ), acao: 'copiar', codigo: resp.data.dados[i].dadosBoleto.length != 0 ? resp.data.dados[i].dadosBoleto[0][
                        "Código de Barrasdo Lançamento" 
                      ] : "SEM CODIGO"});
                }
                setMinhasFaturasOrg(orgFat);

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

    const [page, setPage] = useState(0);
    const itemsPerPage = 5;

    const onPageChange = (newPage: number) => {
        setPage(newPage);
    };
    
    const startIndex = page * itemsPerPage;

    function CopiarTransferencia(texto: string)
    {
        Clipboard.setString(texto);
        Toast.show({
            type: 'success',
            text1: 'Sucesso!',
            text2: 'O Código de Barras foi copiado.',
            visibilityTime: 1000
        });
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
                        }}>Faturas</Text>
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
                    }}>Suas Faturas:</Text>

                </View>
            </View>

            <View style={{
                flex: 1,
                padding: 16,
            }}>
                <ScrollView horizontal >
                <DataTable style={{width:600}}>
                    <DataTable.Header>
                    <DataTable.Title>Mês</DataTable.Title>
                    <DataTable.Title>Venc.</DataTable.Title>
                    <DataTable.Title>Valor</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                    <DataTable.Title>Ação</DataTable.Title>
                    </DataTable.Header>

                    {minhasFaturasOrg.map((item: any) => (
                    <DataTable.Row key={item.id}>
                        <DataTable.Cell>{item.mesRef}</DataTable.Cell>
                        <DataTable.Cell>{item.vencimento}</DataTable.Cell>
                        <DataTable.Cell><Text>R${item.valor}</Text></DataTable.Cell>
                        <DataTable.Cell><Text style={{color:`${item.status == 'Vencida' ? '#FF1F1F': item.status == "Em Aberto" ? '#E5FF00' : '#1FFF2A'}`}}>{item.status}</Text></DataTable.Cell>
                        <DataTable.Cell>
                           {item.codigo != "SEM CODIGO" ? <View style={{
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
                                }} onPress={()=>{CopiarTransferencia(item.codigo)}}>C. Código</Text>
                            </View>:<View style={{
                                backgroundColor:"#9A9C02",
                                paddingHorizontal:20,
                                paddingVertical:5,
                                borderRadius:15
                            }}
                            >
                                <Text style={{
                                    fontWeight:"bold",
                                    fontSize:13,
                                    color:"#FFF"
                                }}>Não Disp.</Text>
                            </View>}
                    </DataTable.Cell>
                    </DataTable.Row>
                    ))}
                </DataTable>
                </ScrollView>

                {/* <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(minhasFaturasOrg.length / itemsPerPage)}
                    onPageChange={onPageChange}
                    label={`${startIndex + 1}-${startIndex + minhasFaturasOrg.slice(startIndex, startIndex + itemsPerPage).length} de ${minhasFaturasOrg.length}`}
                /> */}

            </View>
     

            </ScrollView>
            : <>
                <View style={{
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
                </View>
                </>
            }
            
        </View>
    )
}
export default Favoritos;