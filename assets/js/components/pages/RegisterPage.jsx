import React, { useState } from "react";
import Field from "../forms/Field";
import { Link } from "react-router-dom";
import usersAPI from "../services/UsersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password: "",
        passwordConfirm: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });

    // Gestion du changement des input dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    // Gestion de la soumission
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm =
                "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !")
            return;
        }

        try {
            await usersAPI.register(user);
            setErrors({});
            
            toast.success("Vous êtes désormais inscrits, vous pouvez vous connecter");
            history.replace("/login");
        } catch (error) {
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach((violation) => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreurs dans votre formulaire !")
        }
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre joli prénom"
                    errors={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    errors={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    type="email"
                    placeholder="Votre adresse email"
                    errors={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de Passe"
                    type="password"
                    placeholder="Votre mot de passe ultra sécurisé"
                    errors={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation de mot de passe"
                    type="password"
                    placeholder="Confirmez votre super mot de passe"
                    errors={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Confirmation
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
