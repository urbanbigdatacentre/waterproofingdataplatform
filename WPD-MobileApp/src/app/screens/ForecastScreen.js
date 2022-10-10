import React, { useState, useContext, useEffect } from "react";
import Screen from "../components/Screen";
import { StyleSheet, View, Text, TouchableNativeFeedback } from "react-native";
import { dimensions, screen_width } from "../config/dimensions";
import colors from "../config/colors";
import getWeatherForecast from "../api/weather_forecast";
import assets from "../config/assets";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Swipeable from "react-native-gesture-handler/Swipeable";
import HeaderBarMenu from "../components/HeaderBarMenu";

function forecastDay(day, setDay) {
  return (
    <View style={styles.forecastDays}>
      <TouchableNativeFeedback onPress={() => setDay(0)}>
        <View
          style={[
            styles.forecastDayBtn,
            { borderBottomColor: day == 0 ? colors.lightBlue : colors.white },
          ]}
        >
          <Text style={{ color: day == 0 ? colors.lightBlue : colors.black }}>
            HOJE
          </Text>
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => setDay(1)}>
        <View
          style={[
            styles.forecastDayBtn,
            { borderBottomColor: day == 1 ? colors.lightBlue : colors.white },
          ]}
        >
          <Text style={{ color: day == 1 ? colors.lightBlue : colors.black }}>
            PRÓXIMO
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

function weatherIndexToString(weather_index) {
  return [
    "Sol",
    "Sol entre nuvens",
    "Chuva",
    "Chuva forte",
    "Nuvens",
    "Céu limpo",
  ][weather_index];
}

function WeatherInput(weather_index, weather_title) {
  const SvgImage = assets.weather_icons[weather_index];
  return (
    <View style={{ width: "50%", ...styles.centered }}>
      <Text
        style={{
          fontSize: dimensions.text.default,
          fontWeight: "bold",
          paddingBottom: 8,
        }}
      >
        {weather_title}
      </Text>
      <View
        style={{
          width: 58,
          height: 59,
        }}
      >
        <SvgImage />
      </View>
      <Text
        style={{
          fontSize: dimensions.text.tertiary,
          fontWeight: "bold",
          paddingVertical: 8,
        }}
      >
        {weatherIndexToString(weather_index)}
      </Text>
    </View>
  );
}

function renderTodayForecast(forecast) {
  return (
    <View style={{ ...styles.centered, flex: 1 }}>
      {WeatherInput(forecast.today_forecast.morning_weather_index, "Manhã")}
      <Text
        style={{
          paddingTop: 30,
          flex: 1,
          fontWeight: "bold",
          fontSize: dimensions.text.default,
        }}
      >
        Probabilidade de chuva {forecast.today_forecast.rain_probability}%
      </Text>
      <View
        style={{
          paddingVertical: 60,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {WeatherInput(forecast.today_forecast.evening_weather_index, "Tarde")}
        {WeatherInput(forecast.today_forecast.night_weather_index, "Noite")}
      </View>
    </View>
  );
}

function border() {
  return (
    <View
      style={{
        width: screen_width,
        alignSelf: "center",
        height: 2,
        backgroundColor: colors.lightestGray,
      }}
    />
  );
}

function weekDayList(day_forecast) {
  const SvgImage = assets.weather_icons[day_forecast.weather_index];

  return (
    <View style={{ flex: 1, width: "100%" }} key={day_forecast.date}>
      {border()}
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: "row",
          width: "100%",
          flex: 1,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: dimensions.text.default }}
          >
            {day_forecast.week_day}
          </Text>
          <Text
            style={{
              color: colors.gray,
              fontSize: dimensions.text.tertiary,
              fontWeight: "400",
            }}
          >
            ({day_forecast.date})
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 3, alignSelf: "center" }}>
          <SvgImage style={{ width: 58, height: 98 }} />
        </View>

        <View
          style={{
            alignItems: "flex-end",
            alignSelf: "center", 
            flex: 1,
          }}
        >
          <Text
            style={{ fontSize: dimensions.text.default, fontWeight: "bold" }}
          >
            {day_forecast.rain_fall_mm} mm
          </Text>
        </View>
      </View>
    </View>
  );
}

function renderWeekForecast(forecast) {
  return (
    <View>
      {forecast.next_forecast.map(weekDayList)}
      {border()}
    </View>
  );
}

function currentLocationAndDate(forecast, day) {
  return (
    <View
      style={{
        paddingTop: 25,
        paddingBottom: 35,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: dimensions.text.default,
        }}
      >
        {forecast.city}, {forecast.state}
      </Text>

      <Text
        style={{
          fontWeight: "bold",
          fontSize: dimensions.text.tertiary,
          color: colors.gray,
        }}
      >
        {day == 0 ? forecast.today_forecast.date : "Próximos dias"}
      </Text>
    </View>
  );
}

function renderScreen(forecast) {
  const [day, setDay] = useState(0);
  const [swipePosition, setSwipePosition] = useState(null);

  useEffect(() => {
    if (swipePosition) {
      day == 0 ? swipePosition.openLeft() : swipePosition.openRight();
    }
  }, [day]);

  return (
    <View>
      <View style={styles.container}>
        {forecastDay(day, setDay)}
        {currentLocationAndDate(forecast, day)}
      </View>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <Swipeable
          ref={(ref) => setSwipePosition(ref)}
          renderRightActions={() => renderWeekForecast(forecast)}
          onSwipeableOpen={() => {
            setDay(1);
          }}
          onSwipeableClose={() => {
            setDay(0);
          }}
        >
          {renderTodayForecast(forecast)}
        </Swipeable>
      </KeyboardAwareScrollView>
    </View>
  );
}

function renderErrorScreen() {
  return (
    <View style={{
      flex: 1,
      padding: 17,
      alignItems: "center",
      justifyContent: "center"
      }}>
    <Text
      style={{
        paddingBottom: 20,
        textAlign: "center",
        fontSize: dimensions.text.header,
        fontWeight: "bold",
        color: colors.primary,
      }}
    >
      Ops, algo deu errado...
    </Text>

      <Text
        style={{
          textAlign: "center",
          fontSize: dimensions.text.secondary,
          fontWeight: "bold",
        }}
      >Não conseguimos encontrar a previsão do tempo para sua localização</Text>
      </View>

  );
}

function ForecastScreen(props) {
  HeaderBarMenu(props.navigation);
  const forecast = getWeatherForecast();

  return (
    <Screen>{forecast ? renderScreen(forecast) : renderErrorScreen()}</Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: dimensions.spacing.normal_padding,
  },
  centered: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
  },
  forecastDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },

  forecastDayBtn: {
    borderBottomWidth: 3,
    width: "48%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ForecastScreen;
