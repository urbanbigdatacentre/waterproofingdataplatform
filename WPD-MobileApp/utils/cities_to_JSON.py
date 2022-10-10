import pandas as pd

SEP = " "
NEW_LINE = "\n"
O_OBJ = "{"
C_OBJ = "}"

def main():
    df = pd.read_csv("./cities.csv")

    uf_to_city = df.groupby(["state_code", "state"])
    JSON = "const states = [\n"
    for name, _ in uf_to_city:
        UF, state_name = name
        JSON += "\t\t"+O_OBJ+ " value: \"" +UF+"\", " + "label: \"" + f"{state_name}" + "\" " + C_OBJ + ",\n"

    JSON += "];"

    JSON += """\n\n\nconst statesToCities = {\n"""


    for name, group in uf_to_city:
        UF, state_name = name
        JSON += "\t" + f"{UF} : " + O_OBJ + "\n\t\t" + "state_name: " + "\""+state_name+"\"," + NEW_LINE + "\t\tcities: [\n"

        for city in group.name:
            JSON += "\t\t\t"+O_OBJ+ " value: \"" +city+"\", " + "label: \"" + city + "\" " + C_OBJ + ",\n"

        JSON += "\t\t]\n\t},\n"
    JSON += "\n};"
    JSON += "export {states, statesToCities}"

    print(JSON)

main()
