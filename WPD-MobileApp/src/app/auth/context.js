import React, { useState } from "react";

const AuthContext = React.createContext();

// function AuthContextProvider() {
//   const [user, setUser] = useState();

//   const provider = ({ children }) => (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );

//   return [user, setUser, provider];
// }

export { AuthContext };
