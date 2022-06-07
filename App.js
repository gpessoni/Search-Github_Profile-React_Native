import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  Linking,
  TextInput,
  Share,
} from "react-native";

const App = () => {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const inputRef = useRef(null);

  const handleRequestUserData = async () => {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.clear();
    }

    setProfile(null);

    if (!user) return;

    try {
      const response = await fetch(`https://api.github.com/users/${user}`);
      const data = await response.json();
      if (!response.ok) {
        setUser(null);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.log(err);
    }

    setUser(null);
  };

  const handlePressGoToGithub = async () => {
    console.log("Verificando link");
    if (!profile) return;
    const res = await Linking.canOpenURL(profile.html_url);
    if (res) {
      await Linking.openURL(profile.html_url);
    }
  };

  const onShare = async () => {
    const result = await Share.share({
      message: `Veja o perfil de ${profile.name}  no link abaixo: ${profile.html_url}`,
    });
  };

  const newSearch = async () => {
    setProfile(null);
  };

  return (
    <SafeAreaView style={style.container}>
      <StatusBar backgroundColor="#010409" barStyle="light-content" />

      {profile === null && (
        <View style={style.contentInput}>
          <Image source={require("./assets/logo.png")} style={style.logo} />
          <TextInput
            ref={inputRef}
            style={style.input}
            onChangeText={(text) => setUser(text)}
            onSubmitEditing={handleRequestUserData}
          />
          <TouchableOpacity onPress={handleRequestUserData}>
            <View style={style.button}>
              <Text style={[style.defaultText, style.textButton]}>Buscar</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {profile !== null && (
        <View style={style.content}>
          <Image style={style.avatar} source={{ uri: profile?.avatar_url }} />
          <Text style={[style.textInfo, style.name]}>{profile?.name} </Text>
          <Text style={[style.textInfo, style.description]}>
           <Text style={style.mainText}> USUÁRIO: </Text> {profile?.login}
          </Text>
          <Text style={[style.textInfo, style.bio]}>
          <Text style={style.mainText}> BIO:{" "} </Text>
            {profile?.bio !== null
              ? profile?.bio.toUpperCase()
              : "NÃO INFORMADO"}
          </Text>
          <Text style={[style.textInfo, style.description]}>
          <Text style={style.mainText}> LOCALIZAÇÃO:{" "} </Text>
            {profile?.location !== null
              ? profile?.location.toUpperCase()
              : "NÃO INFORMADO"}
          </Text>
          <Text style={[style.textInfo, style.description]}>
          <Text style={style.mainText}>  REPOSITÓRIOS:</Text> {profile?.public_repos} 
          </Text>
          <Text style={[style.textInfo, style.description]}>
          <Text style={style.mainText}>  SEGUIDORES: </Text> {profile?.followers}
          </Text>
          <Text style={[style.textInfo, style.description]}>
          <Text style={style.mainText}> SEGUINDO: </Text>{profile?.following}
          </Text>
          <TouchableOpacity onPress={handlePressGoToGithub}>
            <View style={style.button}>
              <Text style={[style.defaultText, style.textButton]}>
                ACESSAR GITHUB
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
            <View style={style.button}>
              <Text style={[style.defaultText, style.textButton]}>
                COMPARTILHAR PERFIL
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={newSearch}>
            <View style={style.button}>
              <Text style={[style.defaultText, style.textButton]}>
                BUSCAR NOVAMENTE
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

const style = StyleSheet.create({
  container: {
    backgroundColor: "#010409",
    flex: 1, 
    alignItems: "center",
  },
  contentInput: {
    alignItems: "center",
    padding: 20,
    marginTop:'60%',
  },
    content: {
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 2,
  },
  defaultText: {
    color: "#66455f",
  },
  textInfo: {
    color: "#ffffff",
  },
  mainText:{
    color: "#b596ae",
  },
  name: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 24,
  },
  nickname: {
    fontSize: 18,
    color: "#4F565E",
  },
  description: {
    fontWeight: "bold",
    fontSize: 14,
    margin:8,
  },
  bio: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    margin:8,
  },
  buttonMain: {
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  textButton: {
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#C9D1D9",
    paddingLeft: 10,
    minWidth: "90%",
    fontSize: 18,
    borderRadius: 10,
  },
  title: {
    color: "white",
    marginBottom: 20,
  },
  logo: {
    marginBottom: 20,
  },
});
