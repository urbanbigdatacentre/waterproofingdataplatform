import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";

import { Form, SubmitButton, FormField } from "../components/forms";
import Screen from "../components/Screen";
import { Text } from "react-native";
import colors from "../config/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import assets from "../config/assets";
import { dimensions } from "../config/dimensions";
import moment from "moment";
import { EventLocationContext } from "../context/EventLocationContext";
import PickEventDateLocation from "../components/PickEventDateLocation";
import SvgLabeledButton from "../components/SvgLabeledButton";
import { formcode } from "../components/forms/FormsCode";
import { AssembleIngestionObject } from "../components/forms/AssembleIngestionObject";
import OnSubmitMessageModal from "../components/forms/OnSubmitMessageModal";
import OnSubmitAwaitModal from "../components/forms/OnSubmitAwaitModal";
import { useNetInfo } from "@react-native-community/netinfo";

const validationSchema = Yup.object().shape({
  images: Yup.array(),
  description: Yup.string().label("Description"),
});

function RiverFloodSharingDataScreen(props) {
  const user = props.route.params.user;
  const [riverScale, setRiverScale] = useState(-1);
  const [riverSituation, setRiverSituation] = useState(null);

  const code = formcode.river;

  const context = useContext(EventLocationContext);

  const connection = useNetInfo().isInternetReachable;
  const formName = "riverFlood";

  useEffect(() => {
    context.defaultLocation();
  }, []);
  const location = context.eventCoordinates;
  const address = context.eventLocation;

  const [error, setError] = useState(false);

  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());

  const [showAwaitModal, setShowAwaitModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

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
    );
    setApiMessage(isSent.ok);

    return apiMessage;
  };

  return (
    <Screen>
      <OnSubmitAwaitModal show={showAwaitModal} />
      <OnSubmitMessageModal
        show={showMessageModal}
        setShow={setShowMessageModal}
        sucess={apiMessage}
        navigation={props.navigation}
      />
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <Form
          initialValues={{
            images: [],
            description: "",
          }}
          onSubmit={(values) => {
            if (riverScale == -1) {
              setError(true);
              return;
            }
            setShowAwaitModal(true);
            sendForm(
              {
                ...values,
              },
              user,
              riverSituation,
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
              flexDirection: "column",
            }}
          >
            <View
              flexDirection="row"
              justifyContent="center"
              paddingBottom={16}
            >
              <View style={styles.imgs_row}>
                <SvgLabeledButton
                  style={{ marginRight: 17 }}
                  onPress={() => {
                    setRiverScale(0);
                    setRiverSituation("BAIXO");
                  }}
                  SvgImage={assets.riverLevel.Low}
                  label={"BAIXO"}
                  isToggle={riverScale == 0}
                />

                <SvgLabeledButton
                  onPress={() => {
                    setRiverScale(1);
                    setRiverSituation("NORMAL");
                  }}
                  SvgImage={assets.riverLevel.Normal}
                  label={"NORMAL"}
                  isToggle={riverScale == 1}
                />
              </View>
            </View>

            <View flexDirection="row" justifyContent="center">
              <SvgLabeledButton
                style={{ marginRight: 17 }}
                onPress={() => {
                  setRiverScale(2);
                  setRiverSituation("ALTO");
                }}
                SvgImage={assets.riverLevel.High}
                label={"ALTO"}
                isToggle={riverScale == 2}
              />

              <SvgLabeledButton
                onPress={() => {
                  setRiverScale(3);
                  setRiverSituation("TRANSBORDADO");
                }}
                SvgImage={assets.riverLevel.Flooding}
                label={"TRANSBORDADO"}
                isToggle={riverScale == 3}
              />
            </View>
          </View>

          {error && riverScale == -1 && (
            <Text style={styles.error_txt}>Selecione o nível do rio</Text>
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
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imgs_row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
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

export default RiverFloodSharingDataScreen;
