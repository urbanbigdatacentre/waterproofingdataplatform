import { useEffect, useState, useContext } from "react";
import { useIsFocused } from "@react-navigation/native";
import { CurrentLocationContext } from "../context/CurrentLocationContext";
/*
  
    NOTE: This hook is used this way because react-navigation/native
    IsFocused change its state when screen focus changes, so it would
    trigger an event to query the database when screen loose focus.
    But, what we want is to change its focus only when it is being
    focused.

  */

export default function attachFocusToQuery() {
  const isFocused = useIsFocused();
  const context = useContext(CurrentLocationContext);

  const [hasToQuery, setHasToQuery] = useState(null);

  useEffect(() => {
    if (isFocused == true) {
      setHasToQuery(!hasToQuery);
    }
  }, [isFocused, context.getCurrentLocation]);

  return hasToQuery;
}
