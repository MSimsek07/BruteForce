import React from "react";

const initialState = {
  isLoggedIn: false,
};

export const Context = React.createContext(initialState);

const Store = ({ children }) => {
  const [state, setState] = React.useState(initialState);

  return <Context.Provider value={[state, setState]}>{children}</Context.Provider>;
};

export default Store;
