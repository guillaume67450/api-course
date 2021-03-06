import React, { useState, useEffect } from "react";
import Field from "../forms/Field";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
    const { id } = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
    });

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    // récupération du customer en fonction de l'identification
    const fetchCustomer = async (id) => {
        try {
            const { firstName, lastName, email, company } =
                await CustomersAPI.find(id);

            setCustomer({ firstName, lastName, email, company });
            setLoading(false);

            console.log(data);
        } catch (error) {
            toast.error("Le client n'a pas pu être chargé");
            history.replace("/customers");
        }
    };

    // chargement du customer si besoin au chargement du composant ou au changement de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    };

    // gestion des changements des inputs dans le formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setErrors({});

            if (editing) {
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifié");
            } else {
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été créé");
                history.replace("/customers");
            }
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);

                toast.error("Des erreurs dans votre formulaire");
            }
        }
    };

    return (
        <>
            {(!editing && <h1>Création d'un client</h1>) || (
                <h1>Modification du client</h1>
            )}

            {loading && <FormContentLoader />}
            {!loading && (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="lastName"
                        label="Nom de famille"
                        placeholder="Nom de famille du client"
                        value={customer.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                    ></Field>
                    <Field
                        name="firstName"
                        label="Prénom"
                        placeholder="Prénom du client"
                        value={customer.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                    ></Field>
                    <Field
                        name="email"
                        label="email"
                        placeholder="Adresse email du client"
                        type="email"
                        value={customer.email}
                        onChange={handleChange}
                        error={errors.email}
                    ></Field>
                    <Field
                        name="company"
                        label="Entreprise"
                        placeholder="Entreprise du client"
                        value={customer.company}
                        onChange={handleChange}
                        error={errors.company}
                    ></Field>

                    <div className="form-group">
                        <button type="sumbmit" className="btn btn-success">
                            Enregistrer
                        </button>
                        <Link to="/customers" className="btn btn-link">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            )}
        </>
    );
};

export default CustomerPage;
