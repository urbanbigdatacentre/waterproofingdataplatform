import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import colors from "../config/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { useFormikContext } from "formik";
import { ErrorMessage } from "./forms";
import defaultStyles from "../config/styles";

function DropDown({
  value,
  setValue,
  items,
  setItems,
  formPlaceholder,
  searchPlaceholder,
  nothingToShow,
  doubleItemLine,
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      listMode="MODAL"
      value={value}
      items={items}
      setValue={setValue}
      setItems={setItems}
      setOpen={setOpen}
      searchable={true}
      translation={{
        PLACEHOLDER: formPlaceholder,
        SEARCH_PLACEHOLDER: searchPlaceholder,
        SELECTED_ITEMS_COUNT_TEXT: "Item selecionado",
        NOTHING_TO_SHOW: nothingToShow,
      }}
      style={{
        backgroundColor: colors.white,
        borderRadius: 6,
        borderColor: colors.grayBG,
        borderWidth: 1,
        ...defaultStyles.shadow,
        height: 58,
      }}
      textStyle={{
        color: colors.medium,
        fontSize: 18,
      }}
      labelStyle={{
        color: colors.medium,
        fontSize: 18,
      }}
      modalProps={{
        animationType: "fade",
      }}
      selectedItemLabelStyle={{
        fontWeight: "bold",
      }}
      listItemContainerStyle={
        doubleItemLine && {
          marginVertical: 5,
          numberOfLines: 3,
          height: 50,
        }
      }
    />
  );
}

function SearchablePicker({
  items,
  setItems,
  formPlaceholder,
  searchPlaceholder,
  name,
  setSelected,
  nothingToShow = "Não encontramos nada com esse termo",
  marginRight = 2,
  marginLeft = 16,
  doubleItemLine = false,
  flex = 1,
}) {
  const { values, setFieldValue, errors, touched } = name
    ? useFormikContext()
    : [1, 1, 1, 1];

  const [value, setValue] = useState(name ? values[name] : "");

  useEffect(() => {
    if (name) setFieldValue(name, value, true);
    else setSelected(value);
  }, [value]);

  return (
    <View
      style={{
        marginLeft: marginLeft,
        marginRight: marginRight,
        flex: flex,
        alignSelf: "flex-start",
      }}
    >
      <DropDown
        value={value}
        setValue={setValue}
        items={items}
        setItems={setItems}
        formPlaceholder={formPlaceholder}
        searchPlaceholder={searchPlaceholder}
        nothingToShow={nothingToShow}
        doubleItemLine={doubleItemLine}
      />

      {name && <ErrorMessage error={errors[name]} visible={touched[name]} />}
    </View>
  );
}

export default SearchablePicker;
