import React from "react";

export default  React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {}
}); // prend en paramètres la forme des informations qu'on veut lui passer
