import axios from "axios";
import { CUSTOMERS_API } from "../../config";

function findAll() {
    return axios
        .get(CUSTOMERS_API)
        .then((response) => response.data["hydra:member"]);
}

function deleteCustomer(id) {
    return axios.delete(CUSTOMERS_API + "/" + id);
}

function find(id) {
    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then((response) => response.data);
}

function update(id, customer) {
    return axios.put(CUSTOMERS_API + "/" + id, customer);
}

function create(customer) {
    axios.post(CUSTOMERS_API, customer);
}

export default {
    findAll, // on a ici un objet findAll dont la valeur est findAll
    find,
    create,
    update,
    delete: deleteCustomer,
};
