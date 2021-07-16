// Pagination en utilisant ApiPlatform

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Pagination from '../Pagination';
import CustomersAPI from '../services/CustomersAPI';

const CustomersPageWithPagination = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member']);
                setTotalItems(response.data['hydra:totalItems']);
            })
            .catch(error => console.log(error.response))
    }, [currentPage]);

    const handleDelete = async id => {

        const originalCustomers = [...customers];

        // 1. l'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id))

        // 2. l'approche pessimiste
        try {
            await CustomersAPI.delete(id)           
        } catch (error) {
            setCustomers(originalCustomers); 
        }

        // approche sans async await (avec then et catch error) pour faire une requête (traitement de la promesse)
        /* 
        CustomersAPI.delete(id)
            .then(response => console.log("ok"))
            .catch(error) = {
                setCustomers(originalCustomers);
                console.log(error.response);
            }
        */

    };

    const handlePageChange = (page) => {
        setCustomers([]);
        setCurrentPage(page);    
    }



    const paginatedCustomers = Pagination.getData(
        customers, 
        currentPage, 
        itemsPerPage
    );

    return (
    <>
        <h1>Liste des clients</h1>

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
                {customers.length === 0 && (
                    <tr>
                        <td>Chargement....</td>
                    </tr>
                )}
                {customers.map(customer =>  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">{customer.invoices.length}</td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button 
                            onClick={() => handleDelete(customer.id)}
                            disabled={customer.invoices.length > 0} 
                            className="btn btn-sm btn-danger">
                                Supprimer
                        </button>
                    </td>
                </tr>)}

            </tbody>
        </table>

        <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            length={totalItems} 
            onPageChanged={handlePageChange} 
        />
        
    </>
    )
};


 
export default CustomersPageWithPagination;