/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// les imports importants
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
// start the Stimulus application
import "../bootstrap";
// any CSS you import will output into a single css file (app.css in this case)
import "../styles/app.css";
import Navbar from "./components/Navbar";
import CustomersPage from "./components/pages/CustomersPage";
import HomePage from "./components/pages/HomePage";
// import CustomersPageWithPagination from "./components/pages/CustomersPage"; // CustomersPageWithPagination si on veut utiliser la pagination d'ApiPlatform
import InvoicesPage from "./components/pages/InvoicesPage";
import InvoicePage from "./components/pages/InvoicePage";
import LoginPage from "./components/pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import AuthAPI from "./components/services/AuthAPI";
import AuthContext from "./contexts/AuthContext";
import CustomerPage from "./components/pages/CustomerPage";
import RegisterPage from "./components/pages/RegisterPage";

AuthAPI.setup();

const App = () => {
    // TODO : il faudrait qu'on demande à notre AuthAPI si on est connecté ou pas
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    console.log(isAuthenticated);

    const NavbarWithRouter = withRouter(Navbar);

    // component = CustomersPageWithPagination si on veut utiliser lapagination d'ApiPlatform
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated, // revient à dire setIsAuthenticated: setIsAuthenticated, pas besoin de répéter deux fois la même chosse en js
            }}
        >
            <HashRouter>
                <NavbarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <PrivateRoute
                            path="/invoices/:id"
                            component={InvoicePage}
                        />
                        <PrivateRoute
                            path="/invoices"
                            component={InvoicesPage}
                        />
                        <PrivateRoute
                            path="/customers/:id"
                            component={CustomerPage}
                        />
                        <PrivateRoute
                            path="/customers"
                            component={CustomersPage}
                        />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
