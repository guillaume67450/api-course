import axios from "axios";

function findAll() {
    return axios
    .get("http://127.0.0.1:8000/api/customers")
    .then(response => response.data['hydra:member'])
} 

function deleteCustomer(id) {
    return axios
    .delete("http://127.0.0.1:8000/api/customers/" + id)
}

function find(id) {
    return axios
    .get("http://localhost:8000/api/customers/" + id)
    .then((response) => response.data);
}

function update(id, customer) {
    return axios.put(
        "http://localhost:8000/api/customers/" + id,
        customer
    );
}

function create(customer) {
    axios.post(
        "http://localhost:8000/api/customers",
        customer
    );
}

export default {
    findAll, // on a ici un objet findAll dont la valeur est findAll
    find,
    create,
    update,
    delete: deleteCustomer
}