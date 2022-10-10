import React, { useContext } from "react";
import { EventLocationContext } from "../context/EventLocationContext";

import { Text } from "react-native";
import { dimensions } from "../config/dimensions";
import colors from "../config/colors";

const EventLocationInput = () => {
    const context = useContext(EventLocationContext);

    return (
        <Text style={{
            fontSize: dimensions.text.default,
            textAlign: "justify",
            flex: 1,
            backgroundColor: colors.secondary,
        }}>
            {context.eventLocation}
        </Text>
    );

}

export default EventLocationInput;