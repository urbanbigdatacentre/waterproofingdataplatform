import React from "react";
import Screen from "../components/Screen";
import InDevelopment from "../components/InDevelopment";
import HeaderBarMenu from "../components/HeaderBarMenu";

function MessageScreen(props) {
  HeaderBarMenu(props.navigation);
  return (
    <Screen>
      <InDevelopment />
    </Screen>
  );
}

export default MessageScreen;
