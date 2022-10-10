import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import SelfClosingModal from "../components/SelfClosingModal";
import colors from "../config/colors";
import { showMessage } from "react-native-flash-message";
import {
  dimensions,
  scaleDimsFromWidth,
  screen_height,
} from "../config/dimensions";
import { Svg, Image as ImageSvg } from "react-native-svg";
import PluviometerGraphics from "./PluviometerGraphics";
import getFieldsAnswers from "../api/RequestFieldsAnswers/getFieldsAnswers";
import AssembleModalObject from "./AssembleModalObject";
import moment from "moment";
import SvgLabeledButton from "./SvgLabeledButton";
import getPluviometerData from "../hooks/usePluviometerData";

const chartHeight = screen_height * 0.3;

/* NOTE: `Edit` and `Delete` icons behavior not implemented yet.
 *
 *   Waiting for API handler to implement this functionality and avoid overwork
 */
function notImplemented() {
  showMessage({
    message: "Comportamento ainda não implementado",
    duration: 1950,
    icon: "warning",
    type: "warning",
  });
}

function onCloseModal(setShowModal, setCurrentMarker) {
  setShowModal(null);
  setCurrentMarker(undefined);
}

function topBar(props, setShowModal, setCurrentMarker) {
  return (
    <View style={styles.topBar}>
      <View style={{ alignContent: "center", flex: 1, marginHorizontal: 10 }}>
        <Text style={[styles.bodyTitle, { color: "white" }]}>
          {props ? props.title : "Aguarde..."}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
        {/* <TouchableOpacity */}
        {/*   style={styles.topBarIcon} */}
        {/*   onPress={() => notImplemented()} */}
        {/* > */}
        {/*   <MaterialCommunityIcons */}
        {/*     name="pencil" */}
        {/*     size={20} */}
        {/*     color={colors.white} */}
        {/*     alignItems="center" */}
        {/*   /> */}
        {/* </TouchableOpacity> */}

        {/* <TouchableOpacity */}
        {/*   style={styles.topBarIcon} */}
        {/*   onPress={() => notImplemented()} */}
        {/* > */}
        {/*   <MaterialCommunityIcons */}
        {/*     name="trash-can" */}
        {/*     size={20} */}
        {/*     color={colors.white} */}
        {/*     alignItems="center" */}
        {/*   /> */}
        {/* </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.topBarIcon}
          onPress={() => onCloseModal(setShowModal, setCurrentMarker)}
        >
          <MaterialCommunityIcons
            name="close"
            size={20}
            color={colors.white}
            alignItems="center"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function iconTextRow(props) {
  const description = props?.description?.replace(/\n/g, ", ")
  return (
    <View flexDirection="row" alignSelf="flex-start" marginVertical={3}>
      <View alignSelf="flex-start" marginRight={10}>
        <MaterialCommunityIcons
          name={props.name}
          size={25}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.text, {width: "80%"}]}>{description}</Text>
    </View>
  );
}

function iconInstitutionTextRow(props) {
  return (
    <View flexDirection="row" alignSelf="flex-start" marginVertical={3}>
      <View alignSelf="flex-start" marginRight={10}>
        <MaterialCommunityIcons
          name={props.name}
          size={25}
          color={colors.primary}
        />
      </View>
      <View style={{ flexDirection: "row", flexGrow: 1, flex: 1 }}>
        <Text style={{ ...styles.text, flexShrink: 1 }}>
          {props.description}
        </Text>
      </View>
    </View>
  );
}

function iconImageRow(props) {
  return (
    <View flexDirection="row" alignSelf="flex-start" marginVertical={3}>
      <View alignSelf="flex-start" marginRight={10}>
        <MaterialCommunityIcons
          name={props.name}
          size={25}
          color={colors.primary}
        />
      </View>

      <View alignSelf="flex-start">
        {props.pictures > 0 ? (
          <Svg width={100} height={100}>
            <ImageSvg
              width="100%"
              height="100%"
              preserveAspectRatio="xMinYMin stretch"
              href={{ uri: props.pic[0] }}
            />
          </Svg>
        ) : (
          <Text style={styles.text}>Não há foto</Text>
        )}
      </View>
    </View>
  );
}

function reviews(props) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const updateLikes = () => {
    setLikes(likes + 1);
    notImplemented();
  };
  const updatedislikes = () => {
    setDislikes(dislikes + 1);
    notImplemented();
  };

  return (
    <View style={styles.reviewsContainer}>
      <TouchableOpacity onPress={() => updatedislikes()}>
        <View style={styles.review}>
          <View marginRight={5}>
            <MaterialCommunityIcons
              name={"thumb-down"}
              size={18}
              color={colors.dark}
            />
          </View>
          <Text style={styles.text}>{dislikes}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          updateLikes();
        }}
      >
        <View style={styles.review}>
          <View marginRight={5}>
            <MaterialCommunityIcons
              name={"thumb-up"}
              size={18}
              color={colors.dark}
            />
          </View>
          <Text style={styles.text}>{likes}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function moreInfo(props) {
  const hasData = props.data.length > 0;
  // console.log(props.data);

  return (
    <View
      style={{
        height: hasData ? chartHeight * 1.4 : 70,
        paddingVertical: hasData ? 20 : 10,
        alignContent: "center",
      }}
    >
      {!hasData ? (
          <Text
            style={{
              ...styles.text_pluv,
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            Não há dados para este pluviômetro{"\n"}
            nos últimos 5 dias
          </Text>
      ) : (
        <PluviometerGraphics chartHeight={chartHeight} data={props.data} />
      )}
    </View>
  );
}

function componentBody(props) {
  const dims = scaleDimsFromWidth(95, 95, 16);
  // NOTE: This code is refered to our local SQLite solution. Revise this when implement rest API.
  const pictures = JSON.parse(props.pictures);
  const date = props.date ? props.date : "Não foi possível obter a data";
  const address = props.address
    ? props.address
    : "Não foi possível carregar o endereço ";
  const user = props.user ? props.user : "Usuário ativo";
  const institution = props.institution
    ? props.institution
    : "Não foi possível obter o nome da instituição";

  return (
    <View style={styles.bodyRow}>
      <props.logo {...dims} />

      <View style={styles.bodyInfo}>
        {!isOfficialPluviometer(props.name) &&
          iconTextRow({ name: "account", description: user })}
        {iconInstitutionTextRow({
          name: "bank",
          description: institution,
        })}
        {iconTextRow({ name: "map-marker", description: address })}
        {!isPluviometer(props.name) &&
          iconTextRow({ name: "calendar", description: date })}
      </View>
    </View>
  );
}

function userMessage(marker) {
  if (marker.description && marker.description != "") {
    return (
      <View>
        <Text
          style={[styles.text, { color: colors.primary, fontWeight: "bold" }]}
        >
          Comentário:
        </Text>
        <Text style={styles.text}>{marker.description}</Text>
      </View>
    );
  } else {
    return <></>;
  }
}

function isPluviometer(name) {
  return name === "pluviometer" || name === "automaticPluviometer";
}

function isOfficialPluviometer(name) {
  return name === "automaticPluviometer";
}

function MapModal({ showModal, setShowModal, markers }) {
  const [currentMarker, setCurrentMarker] = useState(undefined);
  const [pluviometerData, setPluviometerData] = useState(undefined);
  var timeFilter = null;

  const getAnswers = async (id, name, coordinates, user) => {
    if (isOfficialPluviometer(name)) {
      const initialDate = moment().format("YYYY-MM-DD");
      const finalDate = moment().subtract(5, "days").format("YYYY-MM-DD");

      timeFilter = finalDate + "/" + initialDate;
      // console.log(timeFilter);
    }
    if (currentMarker == undefined) {
      if (name == "pluviometer") {
        getPluviometerData(coordinates, setPluviometerData);
        const result = pluviometerData;
        // console.log(result);
        if (result && showModal && currentMarker == undefined) {
          AssembleModalObject(
            JSON.stringify(result.responseData),
            name,
            user,
            id
          ).then((marker) => {
            setCurrentMarker(marker);
          });
          // console.log(id);
        }
      } else {
        const result = await getFieldsAnswers.fieldsAnswers(
          timeFilter,
          id,
          user
        );
      //  console.log(result)
        if (result.data && showModal && currentMarker == undefined) {
          AssembleModalObject(
            JSON.stringify(result.data.responseData),
            name,
            user,
            id
          ).then((marker) => {
            setCurrentMarker(marker);
          });
        }
      }
    }
  };
  
  if (markers && showModal != null && markers.has(showModal)) {
    //currentMarker = markers.get(showModal);
    getAnswers(
      showModal,
      markers.get(showModal).name,
      markers.get(showModal).coordinate,
      markers.get(showModal).user
    );
  }

  if (showModal != null) {
    return (
      <SelfClosingModal
        style={{ position: "absolute" }}
        animationType="slide"
        transparent={true}
        showModal={showModal}
        setShowModal={() => onCloseModal(setShowModal, setCurrentMarker)}
      >
        {topBar(currentMarker, setShowModal, setCurrentMarker)}

        {currentMarker != undefined && (
          <View style={{ padding: 16 }}>
            {componentBody(currentMarker)}
            {isPluviometer(currentMarker.name) ? moreInfo(currentMarker) : null}
            {/* {!isPluviometer(currentMarker.name) ? reviews(currentMarker) : null} */}
            {userMessage(currentMarker)}
          </View>
        )}
        {currentMarker == undefined && (
          <View style={styles.bodyInfo}>
            <View style={{ padding: dimensions.spacing.big_padding }}>
              <MaterialCommunityIcons
                name="sync"
                size={48}
                color={colors.primary}
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              />
              <Text style={styles.textWait}>
                Aguarde um momento enquanto os dados são carregados
              </Text>
            </View>
          </View>
        )}
      </SelfClosingModal>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  bodyRow: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignContent: "space-between",
  },
  bodyTitle: {
    fontWeight: "700",
    fontSize: dimensions.text.secondary,
  },
  bodyInfo: {
    marginRight: 16,
    flexDirection: "column",
    alignContent: "flex-start",
  },
  bodyIcon: {
    alignSelf: "flex-start",
    marginRight: 20,
    height: 53,
    width: 53,
  },
  reviewsContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    margin: 10,
  },
  review: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "space-around",
    marginHorizontal: 10,
  },
  topBar: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  topBarIcon: {
    margin: 10,
  },
  text: {
    fontWeight: "500",
    fontSize: dimensions.text.default,
  },
  text_pluv: {
    fontWeight: "bold",
    fontSize: dimensions.text.default,
    color: colors.primary,
  },
  link: {
    alignSelf: "center",
    color: colors.lightBlue,
    fontWeight: "500",
    fontSize: dimensions.text.default,
  },
  textWait: {
    fontSize: dimensions.text.secondary,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "bold",
    paddingBottom: dimensions.spacing.big_padding,
  },
});

export default MapModal;
