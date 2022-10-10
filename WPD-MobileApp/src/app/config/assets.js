import Pluviometer from "../assets/pluviometer/pluviometer-logo.svg";
import PluviometerSharingData from "../assets/pluviometer/pluviometricDataIcon.svg";

import OfficialPluviometer from "../assets/pluviometer/PluviometroOficial.svg";
import SusceptibilityAreas from "../assets/dataMenu/suceptibilitiesAreas.svg";
import RainIcon from "../assets/rain/rain-icon.svg";
import RiverIcon from "../assets/river/river-logo.svg";
import FloodZones from "../assets/floodZonesAssets/floodZones-logo.svg";
import AppLogoTitle from "../assets/icons/LogoDados1.svg";

import RiverFlood from "../assets/river/river_extravasado.svg";
import RiverLow from "../assets/river/river_low.svg";
import RiverHigh from "../assets/river/river_high.svg";
import RiverNormal from "../assets/river/river_normal.svg";
import RainNot from "../assets/rain/sem_chuva.svg";
import RainLow from "../assets/rain/chuva_fraca.svg";
import RainMedium from "../assets/rain/chuva_moderada.svg";
import RainHigh from "../assets/rain/chuva_forte.svg";

import Weather_0_sunny from "../assets/weather/weather_0_sunny.svg";
import Weather_1_cloudy_sun from "../assets/weather/weather_1_cloudy_sun.svg";
import Weather_2_rain from "../assets/weather/weather_2_rain.svg";
import Weather_3_heavy_rain from "../assets/weather/weather_3_heavy_rain.svg";
import Weather_4_cloudy from "../assets/weather/weather_4_cloudy.svg";
import Weather_5_clean from "../assets/weather/weather_5_clean.svg";

import PinNublado from "../assets/rain/PinNublado";
import PinChuvaFraca from "../assets/rain/PinChuvaFraca";
import PinChuvaModerada from "../assets/rain/PinChuvaModerada";
import PinChuvaForte from "../assets/rain/PinChuvaForte";
import SVGPinSemChuva from "../assets/rain/SVG_semChuva.svg";
import SVGPinChuvaFraca from "../assets/rain/SVG_chuvaFraca.svg";
import SVGPinChuvaModerada from "../assets/rain/SVG_chuvaModerada.svg";
import SVGPinChuvaForte from "../assets/rain/SVG_chuvaForte.svg";

import PinRioBaixo from "../assets/river/PinRioBaixo";
import PinRioNormal from "../assets/river/PinRioNormal";
import PinRioExtravasado from "../assets/river/PinRioExtravasado";
import PinRioCheio from "../assets/river/PinRioCheio";
import PinPluviometroArt from "../assets/pluviometer/PinPluviometroArt";
import SVGPinRioBaixo from "../assets/river/SVG_RioBaixo.svg";
import SVGPinRioAlto from "../assets/river/SVG_RioAlto.svg";
import SVGPinRioNormal from "../assets/river/SVG_RioNormal.svg";
import SVGPinRioExtravasado from "../assets/river/SVG_RioExtravasado.svg";

import FloodPassable from "../assets/floodZonesAssets/passable.svg";
import FloodNotPassable from "../assets/floodZonesAssets/not_passable.svg";
import FloodPassableIcon from "../assets/floodZonesAssets/passableIcon.svg";
import FloodNotPassableIcon from "../assets/floodZonesAssets/notpassableIcon.svg";
import PinPluviometerOfficial from "../assets/pluviometer/PinPluviometerOfficial";
import AboutScreenLogos from "../assets/logos/AboutScreenLogos";

import Avatar0 from "../assets/avatar/Avatar_1.svg";
import Avatar1 from "../assets/avatar/Avatar_2.svg";
import Avatar2 from "../assets/avatar/Avatar_3.svg";
import Avatar3 from "../assets/avatar/Avatar_4.svg";
import Avatar4 from "../assets/avatar/Avatar_5.svg";

export default {
  floodZones: {
    FloodZonesIcon: FloodZones,
    passable: FloodPassable,
    notPassable: FloodNotPassable,
    passableIcon: FloodPassableIcon,
    notPassableIcon: FloodNotPassableIcon,
    
  },

  riverLevel: {
    RiverIcon: RiverIcon,

    low_pin: PinRioBaixo,
    low: SVGPinRioBaixo,
    Low: RiverLow,

    normal_pin: PinRioNormal,
    normal: SVGPinRioNormal,
    Normal: RiverNormal,

    high_pin: PinRioCheio,
    high: SVGPinRioAlto,
    High: RiverHigh,

    flooding_pin: PinRioExtravasado,
    flooding: SVGPinRioExtravasado,
    Flooding: RiverFlood,
  },
  rainLevel: {
    RainIcon: RainIcon,
    rain_0_5_pin: PinNublado,
    rain_0_5: SVGPinSemChuva,
    Rain_0_5: RainNot,

    rain_1_5: SVGPinChuvaFraca,
    rain_1_5_pin: PinChuvaFraca,
    Rain_1_5: RainLow,

    rain_2_5: SVGPinChuvaModerada,
    rain_2_5_pin: PinChuvaModerada,
    Rain_2_5: RainMedium,

    rain_3_5: SVGPinChuvaForte,
    rain_3_5_pin: PinChuvaForte,
    Rain_3_5: RainHigh,
  },
  logos: {
    logo_aboutScreen: AboutScreenLogos,
    belmont: require("./../assets/logos/Belmont.png"),
  },
  weather_icons: [
    Weather_0_sunny,
    Weather_1_cloudy_sun,
    Weather_2_rain,
    Weather_3_heavy_rain,
    Weather_4_cloudy,
    Weather_5_clean,
  ],
  avatar: [Avatar0, Avatar1, Avatar2, Avatar3, Avatar4],
  pluviometer: require("../assets/pluviometer/diario_pluviometrico.png"),
  pluviometer_pin: PinPluviometroArt,
  officialPluviometer: require("../assets/pluviometer/pluviometroOficial.png"),
  officialPluviometer_pin: PinPluviometerOfficial,
  PluviometerIcon: Pluviometer,
  PluviometricDataIcon: PluviometerSharingData,
  OfficialPluviometer: OfficialPluviometer,
  AppLogoTitle: AppLogoTitle,
  SusceptibilityAreas: SusceptibilityAreas,
};
