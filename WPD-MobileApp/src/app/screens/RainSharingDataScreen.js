import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import * as Yup from "yup";

import { Form, SubmitButton, FormField } from "../components/forms";
import Screen from "../components/Screen";
import { Text } from "react-native";
import colors from "../config/colors";
import { scaleDimsFromWidth, dimensions, screen_height } from "../config/dimensions";
import assets from "../config/assets";
import moment from "moment";
import { EventLocationContext } from "../context/EventLocationContext";
import PickEventDateLocation from "../components/PickEventDateLocation";
import SvgLabeledButton from "../components/SvgLabeledButton";
import { AssembleIngestionObject } from "../components/forms/AssembleIngestionObject";
import { formcode } from "../components/forms/FormsCode";
import OnSubmitAwaitModal from "../components/forms/OnSubmitAwaitModal";
import OnSubmitMessageModal from "../components/forms/OnSubmitMessageModal";

import { useNetInfo } from "@react-native-community/netinfo";

const validationSchema = Yup.object().shape({
  images: Yup.array(),
  description: Yup.string().label("Description"),
});

function RainSharingDataScreen(props) {
  const user = props.route.params.user;
  const code = formcode.rain;
  const [rain, setRain] = useState(-1);
  const [rainSituation, setRainSituation] = useState(null);
  const [error, setError] = useState(false);

  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());
  const context = useContext(EventLocationContext);

  useEffect(() => {
    context.defaultLocation();
  }, []);

  const location = context.eventCoordinates;
  const address = context.eventLocation;

  const [showAwaitModal, setShowAwaitModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);
   
  const connection = useNetInfo().isInternetReachable;
  const formName = "rain";

  console.log(connection);
  
  const sendForm = async (
    { images, description },
    user,
    situation,
    code,
    location,
    date,
    time,
    address,
    connection,
    formName
  ) => {
    const isSent = await AssembleIngestionObject(
      { images, description, connection, formName },
      user,
      situation,
      code,
      location,
      date,
      time,
      address,
      connection,
      formName
    );
    setApiMessage(isSent.ok);

    return apiMessage;
  };

  return (
    <Screen>
    <OnSubmitAwaitModal
      show={showAwaitModal}
    />
    <OnSubmitMessageModal
      show={showMessageModal}
      setShow={setShowMessageModal}
      sucess={apiMessage}
      navigation={props.navigation}
    />
          <ScrollView>
        <Form
          initialValues={{
            images: [],
          }}
          onSubmit={(values) => {
            if (rain == -1) {
              setError(true);
              return;
            }

            setShowAwaitModal(true);
            sendForm(
              {
                ...values,
              },
              user,
              rainSituation,
              code,
              location,
              date,
              time,
              address,
              connection,
              formName
            ).then((isSent) => {
              setShowAwaitModal(false);
              setShowMessageModal(true);
            });
          }}
          validationSchema={validationSchema}
        >
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            <View
              flexDirection="row"
              justifyContent="center"
              paddingBottom={16}
            >
              <SvgLabeledButton
                style={{ marginRight: 17 }}
                onPress={() => {
                  setRain(0);
                  setRainSituation("SEM CHUVA");
                }}
                SvgImage={assets.rainLevel.Rain_0_5}
                label={"SEM CHUVA"}
                isToggle={rain == 0}
              />
              <SvgLabeledButton
                onPress={() => {
                  setRain(1);
                  setRainSituation("CHUVA FRACA");
                }}
                SvgImage={assets.rainLevel.Rain_1_5}
                label={"CHUVA FRACA"}
                isToggle={rain == 1}
              />
            </View>

            <View flexDirection="row" justifyContent="center">
              <SvgLabeledButton
                style={{ marginRight: 17 }}
                onPress={() => {
                  setRain(2);
                  setRainSituation("CHUVA MODERADA");
                }}
                SvgImage={assets.rainLevel.Rain_2_5}
                label={"CHUVA MODERADA"}
                isToggle={rain == 2}
              />

              <SvgLabeledButton
                onPress={() => {
                  setRain(3), setRainSituation("CHUVA FORTE");
                }}
                SvgImage={assets.rainLevel.Rain_3_5}
                label={"CHUVA FORTE"}
                isToggle={rain == 3}
              />
            </View>
          </View>

          {error && rain == -1 && (
            <Text style={styles.error_txt}>Selecione o nível da chuva </Text>
          )}

          {/* <FormImagePicker backgroundColor={colors.primary} name="images" /> */}

          <PickEventDateLocation
            date={date}
            time={time}
            setDate={setDate}
            setTime={setTime}
            navigation={props.navigation}
          />

          <Text style={styles.labelStyle}>Comentário:</Text>

          <FormField
            maxLength={255}
            multiline
            name="description"
            numberOfLines={3}
            placeholder="Escreva um comentário (Opcional)..."
          />

          <View paddingVertical={24}>
            <SubmitButton title="Enviar" backgroundColor={colors.primary} />
          </View>
        </Form>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  error_txt: {
    paddingHorizontal: 16,
    marginTop: 12,
    fontSize: 18,
    color: colors.danger,
  },
  labelStyle: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.lightBlue,
  },
});

export default RainSharingDataScreen;
