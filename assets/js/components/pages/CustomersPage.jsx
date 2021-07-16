import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";

import CustomersAPI from "../services/CustomersAPI";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Permet d'aller récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    // note : on ne peut pas utiliser du async dans le use effect de react
    // au chargement du composant, on va chercher les customers
    useEffect(() => {
        fetchCustomers();
    }, []);

    // gestion de la suppression d'un client (customer)
    const handleDelete = (id) => {
        const originalCustomers = [...customers];

        // 1. l'approche optimiste
        setCustomers(customers.filter((customer) => customer.id !== id));

        // 2. l'approche pessimiste
        CustomersAPI.delete(id)
            .then((response) => console.log("ok"))
            .catch((error) => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
    };

    // gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    // gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        (c) =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company &&
                c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <h1>Liste des clients</h1>

            <div className="form-group">
                <input
                    type="text"
                    onChange={handleSearch}
                    value={search}
                    className="form-control"
                    placeholder="Rechercher ..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th>Factures</th>
                        <th>Montant total</th>
                        <th />
                    </tr>
                </thead>

                <tbody>
                    {paginatedCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">
                                    {customer.firstName} {customer.lastName}
                                </a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                {customer.invoices.length}
                            </td>
                            <td className="text-center">
                                {customer.totalAmount.toLocaleString()} €
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
    );
};

export default CustomersPage;
