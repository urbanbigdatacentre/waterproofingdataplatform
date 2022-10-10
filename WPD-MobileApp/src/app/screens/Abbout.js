import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import colors from "../config/colors";
import { dimensions, screen_width } from "../config/dimensions";
import logos from "../assets/logos/LogosAPP.svg";
import assets from "../config/assets";

export default function Abbout(props) {
  const linkWarwick =
    "https://warwick.ac.uk/fac/arts/schoolforcross-facultystudies/igsd/waterproofingdata/";

  const linkCEMADEN = "http://educacao.cemaden.gov.br/";

  const linkNorface =
    "https://www.norface.net/program/transformations--to-sustainability/";

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={{ padding: dimensions.spacing.normal_padding }}>
          <View style={styles.sectionStyle}>
            <View style={styles.titleBackground}>
              <Text style={styles.txtTitle}>Dados à Prova d'Água</Text>
            </View>
            <Text style={styles.txtDescription}>
              O projeto Dados à Prova d'Água investiga a governança de riscos
              relacionados à água com foco nos aspectos sociais e culturais das
              práticas de dados. Normalmente, os dados fluem das cidades para os
              “centros de pesquisa” e, em seguida, os alertas e as intervenções
              fluem de volta para os governos locais e as comunidades. O projeto
              é conduzido por uma equipe internacional de pesquisadores da
              Fundação Getulio Vargas e do Centro Nacional de Monitoramento e
              Alerta de Desastres Natuais (Brasil), da Universidade de Warwick e
              da Universidade de Glasgow (Reino Unido) e da Universidade de
              Heidelberg (Alemanha). O aplicativo Dados à Prova d’Água tem como
              objetivo engajar comunidades, escolas, defesas civis e outras
              agências governamentais na geração e circulação de dados
              relacionados à inundações. {"\n\n"}Mais informações:{"\n"}
              <Text
                style={styles.url}
                onPress={() => Linking.openURL(linkWarwick)}
              >
                {linkWarwick}
              </Text>
            </Text>

            <View style={styles.sectionStyle}>
              <Image
                style={{
                  resizeMode: "center",
                  width: 1080 * 0.4,
                  height: 940 * 0.4,
                }}
                source={require("../assets/logos/logoparceiros.png")}
              />
            </View>
          </View>

          <View style={styles.sectionStyle}>
            <View style={styles.titleBackground}>
              <Text style={styles.txtTitle}>Sobre o Cemaden Educação</Text>
            </View>
            <Text style={styles.txtDescription}>
              O programa Cemaden Educação, vinculado ao Centro Nacional de
              Monitoramento e Alertas de Desastres Naturais (Cemaden), visa
              promever a formação de escolas e comunidades na prevenção de
              riscos de desastres. O objetivo principal é contribuir para a
              geração de uma cultura de percepção de riscos de desastres,
              possibilitando, assim, a construção de sociedades sustentáveis e
              resilientes. (Texto adaptado do site do Cemaden Educação) {"\n\n"}
              Mais informações: {"\n"}
              <Text
                style={styles.url}
                onPress={() => Linking.openURL(linkCEMADEN)}
              >
                {linkCEMADEN}
              </Text>
            </Text>
          </View>

          <View style={styles.sectionStyle}>
            <View style={styles.titleBackground}>
              <Text style={styles.txtTitle}>Cooperação e financiamento</Text>
            </View>
            <Text style={styles.txtDescription}>
              O aplicativo Dados à Prova d'Água é parte do projeto T2S
              Waterproofing Data (em inglês) que é apoiado financeiramente pelo
              Belmont Forum e NORFACE Joint Research Programme on
              Transformations to Sustainability (
              <Text
                style={styles.url}
                onPress={() => Linking.openURL(linkNorface)}
              >
                {linkNorface}
              </Text>
              acessado em 16 de agosto de 2021), co-financiado pelo DLR/BMBF
              (Ministério Federal de Educação e Pesquisa da Alemanha),
              ESRC/Flobal Challenges Research Fund (Inglaterra), FAPESP
              (Brasil), Comissão Européia pelo Horizon 2020 e UK Research and
              Innovation por meio do GCRF Global Research Translation Award.
            </Text>
          </View>
        </View>
        <View style={[styles.sectionStyle, { marginBottom: 80 }]}>
          <Image
            style={{
              resizeMode: "center",
              width: 1080 * 0.4,
              height: 940 * 0.4,
            }}
            source={require("../assets/logos/aboutlogos.png")}
          />

          <Image
            style={{
              resizeMode: "center",
              width: 617 * 0.3,
              height: 177 * 0.3,
            }}
            source={assets.logos.belmont}
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: dimensions.spacing.normal_padding,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: "column",
  },
  txtHeader: {
    fontSize: dimensions.text.header,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "left",
    padding: dimensions.spacing.normal_padding,
  },
  HeaderBackground: {
    backgroundColor: colors.primary,
    marginBottom: dimensions.spacing.minimal_padding,
  },
  txtTitle: {
    fontSize: dimensions.text.secondary,
    color: colors.white,
    fontWeight: "bold",
    textAlign: "left",
    padding: dimensions.spacing.normal_padding,
  },
  url: {
    fontSize: dimensions.text.default,
    color: "blue",
    textDecorationLine: "underline",
    textAlign: "left",
  },
  txtDescription: {
    textAlign: "justify",
    fontSize: dimensions.text.default,
  },
  titleBackground: {
    width: "100%",
    backgroundColor: colors.secondary,
    marginBottom: dimensions.spacing.minimal_padding,
  },
  sectionStyle: {
    marginTop: dimensions.spacing.normal_padding,
    justifyContent: "center",
    alignItems: "center",
  },
});
