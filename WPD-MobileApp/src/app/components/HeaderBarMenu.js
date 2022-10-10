import React from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from "react-navigation-header-buttons";

const IoniconsHeaderButton = (props) => (
  <HeaderButton IconComponent={MaterialCommunityIcons} iconSize={23} {...props} />
);

function HeaderBarMenu(navigation) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Sobre"
            iconName="information-outline"
            onPress={() => navigation.navigate("Abbout")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);
}

export default HeaderBarMenu;
