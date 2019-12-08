import axios from 'axios';

let baseURL = 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
    baseURL = 'https://habit.soutendijk.com';
}

const client = axios.create({
    baseURL,
});

export default client;
