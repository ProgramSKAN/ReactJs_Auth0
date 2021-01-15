//to avoid prop drilling of auth props on every route, use context
//steps to configure context
//1.Declare context
//2.Declare provider (provides data/funcs)
//3.Declare consumer (consumes data/funcs)

import React from "react";
const AuthContext = new React.createContext();
export default AuthContext;
