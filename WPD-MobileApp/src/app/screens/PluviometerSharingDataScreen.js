import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import * as Yup from "yup";
import { Form, FormField, SubmitButton } from "../components/forms";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import { insertPluviometerData } from "../database/databaseLoader";
import { showMessage } from "react-native-flash-message";
import { dimensions, scaleDimsFromWidth } from "../config/dimensions";
import colors from "../config/colors/";
import moment from "moment";
import PickEventDateLocation from "../components/PickEventDateLocation";
import { EventLocationContext } from "../context/EventLocationContext";
import { formcode } from "../components/forms/FormsCode";
import { AssembleIngestionPluviometer } from "../components/forms/AssembleIngestionObject";
import OnSubmitAwaitModal from "../components/forms/OnSubmitAwaitModal";
import OnSubmitMessageModal from "../components/forms/OnSubmitMessageModal";
import { useNetInfo } from "@react-native-community/netinfo";

const dims = scaleDimsFromWidth(85, 85, 25);

const validationSchema = Yup.object().shape({
  pluviometer: Yup.number()
    .required("Campo obrigatório")
    .min(0, "O valor deve ser maior ou igual a 0.")
    .max(999)
    .label("pluviometer"),
  //data: Yup.string().required("Campo obrigatório. Por favor, selecione a data"),
  images: Yup.array(),
  description: Yup.string().label("Description"),
});

function PluviometerSharingDataScreen(props) {
  const user = props.route.params.user;
  const context = useContext(EventLocationContext);
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(moment());

  const code = formcode.pluviometer;

  useEffect(() => {
    context.defaultLocation();
  }, []);

  const [showAwaitModal, setShowAwaitModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  const connection = useNetInfo().isInternetReachable;
  const formName = "pluviometer";

  const sendForm = async ({
    pluviometer,
    description,
    images,
    user,
    date,
    time,
    connection,
    formName,
  }) => {
    const isSent = await AssembleIngestionPluviometer({
      pluviometer,
      description,
      images,
      user,
      date,
      time,
      connection,
      formName,
    });
    if (isSent) {
      setApiMessage(isSent.ok);
    }

    return apiMessage;
  };

  return (
    <Screen style={styles.container}>
      <OnSubmitAwaitModal show={showAwaitModal} />
      <OnSubmitMessageModal
        show={showMessageModal}
        setShow={setShowMessageModal}
        sucess={apiMessage}
        navigation={props.navigation}
      />
      <ScrollView>
        <Form
          initialValues={{
            pluviometer: 0,
            description: "",
            images: [],
          }}
          onSubmit={(values) => {
            setShowAwaitModal(true);
            sendForm({ ...values, user, date, time, connection, formName }).then((isSent) => {
              setShowAwaitModal(false);
              setShowMessageModal(true);
            });
          }}
          validationSchema={validationSchema}
        >
          <Text style={{ ...styles.labelStyle, paddingTop: 24 }}>
            Quantidade de chuva (mm):
          </Text>

          <FormField
            keyboardType="number-pad"
            maxLength={200}
            numberOfLines={1}
            name="pluviometer"
            placeholder="Quantidade de chuva"
            increaseDecreaseButtons={true}
          />

          {/* <FormImagePicker backgroundColor={colors.primary} name="images" /> */}

          <PickEventDateLocation
            date={date}
            time={time}
            setDate={setDate}
            setTime={setTime}
            navigation={props.navigation}
            location={false}
            subtitle={"Defina a data da coleta"}
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
  container: {
    flex: 1,
  },
  image: {
    width: dims.width * 0.8,
    height: dims.height * 0.8,
    justifyContent: "center",
    alignItems: "center",
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

export default PluviometerSharingDataScreen;
