import React, { useState, useContext, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Form, SubmitButton } from "../components/forms";
import { dimensions } from "../config/dimensions";
import FormDatePicker from "../components/forms/FormDatePicker";
import colors from "../config/colors/";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../auth/context";
import { Shadow } from "react-native-shadow-2";
import { AssembleIngestionPluvRegistration } from "../components/forms/AssembleIngestionObject";
import OnSubmitAwaitModal from "../components/forms/OnSubmitAwaitModal";
import OnSubmitMessageModal from "../components/forms/OnSubmitMessageModal";

function Institution({ user }) {
  const institutionMap = {
    E: "Escola",
    D: "Defesa Civil",
    N: "Não governamental",
    O: "Outra",
    X: "Nenhuma",
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.labelTipoInst}>Tipo de instituição: </Text>
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <FontAwesome5 name="university" size={30} color={colors.primary} />
        <Text style={styles.subText}>
          {user.institutiontype
            ? institutionMap[user.institutiontype]
            : "Tipo de instituição não informado"}
        </Text>
      </View>

      <Text style={[styles.label, { marginTop: 24, marginBottom:16, }]}>
        Nome da instituição:
      </Text>
      <View style={{ flexDirection: "row" }}>
        <FontAwesome5 name="university" size={30} color={colors.primary} />
        <Text style={styles.subText}>
          {user.institution
            ? user.institution
            : "Nome da instituição não informado"}
        </Text>
      </View>
    </View>
  );
}

function LocationPicker({
  navigation,
  location,
  setLocationAddr,
  setGeoLocation,
  pluviometer,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1,
      }}
    >
      <MaterialIcons name="location-on" size={30} color={colors.primary} />

      {pluviometer && (
        <View style={{ flexDirection: "row"}}>
          <Text style={styles.subText}>
            {pluviometer.address
              ? pluviometer.address
              : "Não foi possível carregar endereço"}
          </Text>
        </View>
      )}

      {!pluviometer && (
        <View
          style={{
            marginLeft: 16,
            flex: 1,
          }}
        >
          <Shadow
            viewStyle={{ width: "100%", height: 48 }}
            offset={[0, 3]}
            distance={3}
            radius={4}
            startColor="rgba(0, 0, 0, 0.15)"
            paintInside={true}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("FormMap", {
                  setLocationAddr: setLocationAddr,
                  setGeoLocation: setGeoLocation,
                })
              }
            >
              <View
                style={{
                  paddingLeft: 16,
                  backgroundColor: colors.white,
                  height: 48,
                  borderRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text styles={styles.subText}>{location}</Text>
              </View>
            </TouchableOpacity>
          </Shadow>
        </View>
      )}
    </View>
  );
}

function PluvDateTimePicker({
  onDateChange,
  onTimeChange,
  date,
  time,
  formTypeFace,
  pluviometer,
}) {
  return (
    <View style={{ height: 48 }}>
      {!pluviometer && (
        <FormDatePicker
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          date={date}
          time={time}
          formTypeFace={formTypeFace}
        />
      )}

      {pluviometer && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="calendar-today"
            size={30}
            color={colors.primary}
          />
            <Text style={styles.subTextDate}>
              {pluviometer.regiterDate
                ? pluviometer.regiterDate
                : "Erro ao carregar a data"}
            </Text>
        </View>
      )}
    </View>
  );
}

function PluviometerRegisterScreen(props) {
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());
  const [location, setLocationAddr] = useState("Defina o endereço no mapa");
  const [coordinates, setCoordinates] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  const [showAwaitModal, setShowAwaitModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  const sendForm = async (date, time, user, address, coordinates) => {
    const isSent = AssembleIngestionPluvRegistration(
      date,
      time,
      user,
      address,
      coordinates
    ).then((isSent) => {
      if (isSent) {
        setApiMessage(isSent.ok);

        setShowAwaitModal(false);
        setShowMessageModal(true);
      }
      return isSent;
    });
  };

  useEffect(() => {
    if (apiMessage) {
      setUser({
        ...user,
        pluviometer: {
          regiterDate: date + " | " + time,
          address: location,
          institutionType: user.institutionType,
          institutionName: user.institutionName,
          coordinates: {
            lat: coordinates["latitude"],
            long: coordinates["longitude"],
          },
        },
      });
    }
  }, [apiMessage]);

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <OnSubmitAwaitModal show={showAwaitModal} />
      <OnSubmitMessageModal
        show={showMessageModal}
        setShow={setShowMessageModal}
        sucess={apiMessage}
        navigation={props.navigation}
      />
      <Form
        initialValues={{}}
        onSubmit={async () => {
          setShowAwaitModal(true);
          sendForm(date, time, user, location, coordinates);
        }}
      >
        <View
          style={{
            padding: 6,
          }}
        >
          <Text style={styles.title}>
            {user.pluviometer
              ? "Dados do Pluviômetro"
              : "Cadastro do Pluviômetro"}
          </Text>

          <Text
            style={{
              marginTop: 24,
              marginBottom: 16,
              fontSize: dimensions.text.secondary,
              fontWeight: "bold",
              textAlign: "left",
              color: colors.secondary,
            }}
          >
            Data do cadastro:
          </Text>

          <PluvDateTimePicker
            onDateChange={(value) => setDate(value)}
            onTimeChange={(value) => setTime(value)}
            date={date}
            time={time}
            formTypeFace={"pluviometerRegister"}
            pluviometer={user.pluviometer}
          />

          <Text style={styles.label}>Endereço do pluviômetro*: </Text>

          <View marginBottom={24} marginTop={16}>
            <LocationPicker
              navigation={props.navigation}
              location={location}
              setLocationAddr={setLocationAddr}
              setGeoLocation={setCoordinates}
              pluviometer={user.pluviometer}
            />
          </View>

          <Institution user={user} />

          {!user.pluviometer && (
            <SubmitButton title="Cadastrar" paddingHorizontal={0} />
          )}
        </View>
      </Form>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: dimensions.text.secondary,
    // marginBottom: 12,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
  },
  labelTipoInst: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.secondary,
  },
  subText: {
    color: colors.subText,
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "500",
    paddingLeft: 16,
  },
  subTextDate: {
    color: colors.subText,
    paddingLeft: 16,
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
});

export default PluviometerRegisterScreen;
