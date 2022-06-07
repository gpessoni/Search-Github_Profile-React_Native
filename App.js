import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
  Pressable,
  Linking,
  TextInput,
  Share
  
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
    })

  }

  return (
    <SafeAreaView style={style.container}>
      <StatusBar backgroundColor="#010409" barStyle="light-content" />

      <View style={style.content}>
        <Image source={require("./assets/logo.png")} style={style.logo} />
        <TextInput
          ref={inputRef}
          style={style.input}
          onChangeText={(text) => setUser(text)}
          onSubmitEditing={handleRequestUserData}
        />
        <Pressable onPress={handleRequestUserData}>
          <View style={style.button}>
            <Text style={[style.defaultText, style.textButton]}>Buscar</Text>
          </View>
        </Pressable>
      </View>

      {profile && (
        <View style={style.content}>
          <Image style={style.avatar} source={{ uri: profile?.avatar_url }} />
          <Text style={[style.textInfo, style.name]}>{profile?.name} </Text>
          <Text style={[style.textInfo, style.description]}>
            USUÁRIO: {profile?.login}
          </Text>
          <Text style={[style.textInfo, style.description]}>
            LOCALIZAÇÃO: {profile?.location !== null ? profile?.location.toUpperCase() : "Não informado"}
          </Text>
          <Text style={[style.textInfo, style.description]}>
            REPOSITÓRIOS: {profile?.public_repos}
          </Text>
          <Text style={[style.textInfo, style.description]}>
            SEGUIDORES: {profile?.followers}
          </Text>
          <Text style={[style.textInfo, style.description]}>
            SEGUINDO: {profile?.following}
          </Text>
          <Pressable onPress={handlePressGoToGithub}>
            <View style={style.button}>
              <Text style={[style.defaultText, style.textButton]}>
                ACESSAR GITHUB
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={onShare}>
            <View style={style.button}>
              <Text style={[style.defaultText, style.textButton]}>
                COMPARTILHAR PERFIL
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;

const style = StyleSheet.create({
  container: {
    // Column
    backgroundColor: "#010409",
    flex: 1, // Expandir para a tela inteira
    alignItems: "center",
    // flexDirection: 'row',
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
    color: "#8a1a49",
  },
  textInfo: {
    color: "#ffffff",
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
  }
});
