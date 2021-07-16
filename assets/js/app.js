/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// les imports importants
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import "../styles/app.css";

// start the Stimulus application
import "../bootstrap";
import CustomersPage from "./components/pages/CustomersPage";
// import CustomersPageWithPagination from "./components/pages/CustomersPage"; // CustomersPageWithPagination si on veut utiliser la pagination d'ApiPlatform
import InvoicesPage from "./components/pages/InvoicesPage";

console.log("hello world !");

const App = () => {
    return ( // component = CustomersPageWithPagination si on veut utiliser la pagination d'ApiPlatform
        <HashRouter>
            <Navbar />

            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage} />  
                    <Route path="/customers" component={CustomersPage} />  
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
