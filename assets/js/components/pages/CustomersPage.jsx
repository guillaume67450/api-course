import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import CustomersAPI from "../services/CustomersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../loaders/TableLoader";

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Permet d'aller récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            toast.error("Impossible de charger les clients");
        }
    };

    // note : on ne peut pas utiliser du async dans le use effect de react
    // au chargement du composant, on va chercher les customers
    useEffect(() => {
        fetchCustomers();
    }, []);

    // gestion de la suppression d'un client (customer)
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];

        // 1. l'approche optimiste
        setCustomers(customers.filter((customer) => customer.id !== id));

        try {
            await CustomersAPI.delete(id);
            toast.success("Le client a bien été supprimé");
        } catch (error) {
            setCustomers(originalCustomers);
            toast.error("La suppression du client n'a pas pu fonctionner");
        }

        // // 2. l'approche pessimiste
        // CustomersAPI.delete(id)
        //     .then((response) => console.log("ok"))
        //     .catch((error) => {
        //         setCustomers(originalCustomers);
        //     });
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
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">
                    Créer un client
                </Link>
            </div>
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

                {!loading && (
                    <tbody>
                        {paginatedCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <Link to={"/customers/" + customer.id}>
                                        {customer.firstName} {customer.lastName}
                                    </Link>
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
                                        onClick={() =>
                                            handleDelete(customer.id)
                                        }
                                        disabled={customer.invoices.length > 0}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            {loading && <TableLoader />}

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
