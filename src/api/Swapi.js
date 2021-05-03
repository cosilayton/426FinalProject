const axios = require('axios');

const API_BASE = 'https://swapi.dev/api';

const Swapi = {
    planets(page) {
        page = page || 1;
        return axios.get(API_BASE + '/planets/?page=' + page);
    }
};

export default Swapi;
