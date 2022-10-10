import { create } from "apisauce";

const authClient = create({
  baseURL: "http://wpd.brazilsouth.cloudapp.azure.com:8080/users",
});

const authChangePswdClient = create({
  baseURL: "http://wpd.brazilsouth.cloudapp.azure.com:8080/forgotpasswords"
})

export { authClient, authChangePswdClient};
