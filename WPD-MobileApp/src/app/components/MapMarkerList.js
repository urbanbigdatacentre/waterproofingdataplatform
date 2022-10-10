import {useState} from "react";

function isRequestedValue(item, renderOptions) {
  return (
    (item.name == "pluviometer" && renderOptions.citzen.pluviometer) ||
    (item.name == "automaticPluviometer" &&
      renderOptions.oficial.automaticPluviometer) ||
    (item.name == "rain" && renderOptions.citzen.rain) ||
    (item.name == "riverFlood" && renderOptions.citzen.riverFlood) ||
    (item.name == "floodZones" && renderOptions.citzen.floodZones) ||
    (item.name == "susceptibilityAreas" && renderOptions.oficial.susceptibilityAreas)
  );
}

function MapMarkerList({ markers, renderOptions }) {
  if (!markers) return null;

  return [...markers.markers]
    .filter(([_, item]) => isRequestedValue(item, renderOptions))
    .map(a => a[1]);
}

export { MapMarkerList };
