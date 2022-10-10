import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "../config/colors/";
import { LineChart } from "react-native-chart-kit";
import requestPluviometerData from "../api/pluviometer";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width * 0.95;
const screenHeight = Dimensions.get("window").height * 0.3;

function figure_config(labels, values) {
  return {
    labels: labels,
    datasets: [
      {
        data: values,
        color: () => colors.gold,
        strokeWidth: 2,
      },
    ],

    legend: ["Registros pluviométricos"],
  };
}

const verifyNullData = (values) => {
  var indexArray = [];
  var i = 0;

  for (i; i < values.length; i++) {
    if (values[i] == null) {
      indexArray.push(i);
    }
  }

  return indexArray;
};

const chartConfig = {
  backgroundGradientFrom: 0,
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0,
  color: () => colors.primary,
  strokeWidth: 2, // optional, default 3
  useShadowColorFromDataset: true,
  propsForLabels: {
    fontSize: 12,
  },
};

function PluviometerGraphics({ chartHeight, data }) {
  var labels = [];
  var values = [];
  data.forEach((day) => {
    labels.push(day.label);
    day.values.forEach((value) => {
      values.push(value.rainGauge);
    });
  });
  return (
    <View
      style={{
        paddingHorizontal: 10,
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <LineChart
        verticalLabelRotation={20}
        data={figure_config(labels, values)}
        width={screenWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        withVerticalLines={false}
        yAxisSuffix="mm"
        hidePointsAtIndex={verifyNullData(values)}
      />
      <Text style={{ textAlign: "center" }}>Data</Text>
    </View>
  );
}

export default PluviometerGraphics;
