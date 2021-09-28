import React, { useState, useContext } from "react";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../../contexts/AuthContext";

const LoginPage = ({ history }) => {
    const { setIsAuthenticated } = useContext(AuthContext);
    // history donne accès à un objet avec des fonctions tels que go forward go backward push replace (push ajoute une adresse à l'historique de navigation, replace remplace l'adresse actuelle par l'adresse donnée)
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;

        // on écrit [name] entre crochets car sinon il va rajouter une variable name: ... dans les credentials, et on veut qu'il prenne la valeur de la variable name créée un peu plus haut
        setCredentials({ ...credentials, [name]: value });
    };

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault(); // on ne veut pas que le formulaire recharge la page à chaque fois

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            // une fois qu'on s'est authentifié, utiliser mon history avec sa méthode replace pour se rendre sur /customers
            history.replace("/customers");
        } catch (error) {
            setError(
                "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
            );
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de Passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        id="password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
