import React, { useEffect, useState } from "react";
import { Shadow } from "react-native-shadow-2";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import colors from "../config/colors";

const requestPermissionCamera = async () => {
  const { granted } = await Permissions.askAsync(Permissions.CAMERA);
  if (!granted)
    alert("Você precisa habilitar permissão para acessar a câmera.");

  return granted;
};

const requestPermissionGallery = async () => {
  const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
  if (!granted)
    alert("Você precisa habilitar permissão para acessar a biblioteca.");

  return granted;
};

const removeImgage = (imageUri, onChangeImage) => {
  if (imageUri) {
    Alert.alert("Deletar", "Deseja deletar esta imagem?", [
      { text: "Sim", onPress: () => onChangeImage(null) },
      { text: "Não" },
    ]);
  }
};

const launchCamera = async (onChangeImage, callBack) => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    if (!result.cancelled) {
      onChangeImage(result.uri);
    }
    callBack();
  } catch (error) {
    console.log("Erro ao ler imagem", error);
  }
};

const launchImageLibrary = async (onChangeImage, callBack) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.cancelled) {
      onChangeImage(result.uri);
    }
    callBack();
  } catch (error) {
    console.log("Erro ao ler imagem", error);
  }
};

function addNewImageBtn() {
  return (
    <View style={styles.addBtnContainer}>
    <Shadow
      viewStyle={{width: "100%"}}
      offset={[0, 3]}
      distance={3}
      radius={4}
      startColor="rgba(0, 0, 0, 0.15)"
      paintInside={true}
    >
      <View style={styles.addBtn}>

        <MaterialCommunityIcons color={colors.white} name="camera" size={20} />
        <Text style={{ color: colors.white, marginLeft: 10, fontSize: 14 }}>
          CÂMERA
        </Text>
      </View>
      </Shadow>
      </View>
  );
}

function ImageInput({ imageUri, onChangeImage }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {imageUri && (
        <TouchableWithoutFeedback
          onPress={() => {
            removeImgage(imageUri, onChangeImage);
          }}
        >
          <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        </TouchableWithoutFeedback>
      )}

      {!imageUri && (
        <TouchableOpacity
          disabled={true}
          activeOpacity={0.5}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          {addNewImageBtn()}
        </TouchableOpacity>
      )}

      <View>
        <Modal
          style={styles.centeredView}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View>
                  <Text style={styles.modalLabel}>Selecione uma imagem</Text>

                  <TouchableOpacity
                    style={{ width: 300 }}
                    onPress={() => {
                      requestPermissionCamera() &&
                        launchCamera(onChangeImage, () =>
                          setModalVisible(false)
                        );
                    }}
                  >
                    <Text style={styles.modalText}>Câmera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ width: 300 }}
                    onPress={() => {
                      requestPermissionGallery() &&
                        launchImageLibrary(onChangeImage, () =>
                          setModalVisible(false)
                        );
                    }}
                  >
                    <Text style={styles.modalText}>Galeria</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{ width: 300 }}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginTop: 20,
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 15,
    height: 100,
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden",
    width: 100,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "grey",
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 25,
    width: 300,
  },
  modalText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    color: colors.primary,
  },
  modalLabel: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    width: 300,
    color: colors.primary,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    height: 35,
  },
  addBtnContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    width: "100%",
  },

  addBtn: {
    justifyContent: "center",
    flexDirection: "row",
    height: 42,
    width: "100%",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: colors.primary,
    opacity: 0.4, //while button is disabled
  },
});

export default ImageInput;
