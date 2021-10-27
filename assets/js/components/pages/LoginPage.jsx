import React, { useState, useContext } from "react";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../../contexts/AuthContext";
import Field from "../forms/Field";
import { toast } from "react-toastify";

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
            toast.success("Vous êtes désormais connecté")
            // une fois qu'on s'est authentifié, utiliser mon history avec sa méthode replace pour se rendre sur /customers
            history.replace("/customers");
        } catch (error) {
            setError(
                "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas !"
            );
            toast.error("Une erreur est survenue");
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    error={error}
                />

                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    error=""
                />
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
