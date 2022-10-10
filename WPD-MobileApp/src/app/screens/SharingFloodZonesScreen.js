import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";

import { Form, SubmitButton, FormField } from "../components/forms";
import colors from "../config/colors";
import { dimensions } from "../config/dimensions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Screen from "../components/Screen";
import assets from "../config/assets";
import moment from "moment";
import { EventLocationContext } from "../context/EventLocationContext";
import PickEventDateLocation from "../components/PickEventDateLocation";
import SvgLabeledButton from "../components/SvgLabeledButton";
import { formcode } from "../components/forms/FormsCode";
import { AssembleIngestionObject } from "../components/forms/AssembleIngestionObject";
import OnSubmitAwaitModal from "../components/forms/OnSubmitAwaitModal";
import OnSubmitMessageModal from "../components/forms/OnSubmitMessageModal";
import { useNetInfo } from "@react-native-community/netinfo";

const validationSchema = Yup.object().shape({
  images: Yup.array(),
  description: Yup.string().label("Description"),
});

function SharingFloodZonesScreen(props) {
  const user = props.route.params.user;
  const [passable, setPassable] = useState(-1);
  const [floodSituation, setFloodSituation] = useState(null);

  const code = formcode.floodzones;

  const [error, setError] = useState(false);
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());

  const context = useContext(EventLocationContext);
  const address = context.eventLocation;

  const connection = useNetInfo().isInternetReachable;
  const formName = "floodZones";

  useEffect(() => {
    context.defaultLocation();
  }, []);
  const location = context.eventCoordinates;

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
            if (passable == -1) {
              setError(true);
              return;
            }
            setShowAwaitModal(true);
            sendForm(
              {
                ...values,
              },
              user,
              floodSituation,
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
          <View style={styles.imgs_container}>
            <SvgLabeledButton
              style={{ marginRight: 17 }}
              label={"TRANSITÁVEL"}
              isToggle={passable == 1}
              SvgImage={assets.floodZones.passableIcon}
              onPress={() => {
                setPassable(1);
                setFloodSituation("TRANSITÁVEL");
              }}
            />

            <SvgLabeledButton
              onPress={() => {
                setPassable(0);
                setFloodSituation("INTRANSITÁVEL");
              }}
              label={"INTRANSITÁVEL"}
              isToggle={passable == 0}
              SvgImage={assets.floodZones.notPassableIcon}
            />
          </View>

          {error && passable == -1 && (
            <Text style={styles.error_txt}>Selecione uma opção</Text>
          )}

          {/* <FormImagePicker name="images" height={10} /> */}

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
            numberOfLines={2}
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
  imgs_container: {
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  error_txt: {
    marginTop: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.danger,
  },
  labelStyle: {
    fontSize: dimensions.text.secondary,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingBottom: 12,
    textAlign: "left",
    color: colors.lightBlue,
  },
});

export default SharingFloodZonesScreen;
