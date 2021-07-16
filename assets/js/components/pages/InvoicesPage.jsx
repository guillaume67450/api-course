import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";

import InvoicesAPI from "../services/InvoicesAPI";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger",
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    // récupération des invoices auprès de l'API
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    };

    // charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    }, []); // on dit au composant qu'il aura besoin de faire quelque chose après avoir rendu la vue grâce à useEffect

    // gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    // gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // gestion de la suppression
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    };

    // gestion du format de date
    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    // Gestion de la recherche
    // filtrage des customers en fonction de la recherche
    const filteredInvoices = invoices.filter(
        (i) =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) || // on cherche les factures qui commencent par le nombre
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <h1>Liste des factures</h1>

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
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">
                                    {invoice.customer.firstName}
                                    {invoice.customer.lastName}
                                </a>
                            </td>
                            <td>{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span
                                    className={
                                        "badge bg-" +
                                        STATUS_CLASSES[invoice.status]
                                    }
                                >
                                    {STATUS_LABELS[invoice.status]}
                                </span>
                            </td>
                            <td className="text-center">
                                {invoice.amount.toLocaleString()} €
                            </td>
                            <td>
                                <button className="btn btn-sm btn-primary">
                                    Editer
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(invoice.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handlePageChange}
                length={filteredInvoices.length}
            />
        </>
    );
};

export default InvoicesPage;