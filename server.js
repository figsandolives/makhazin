const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const FOODICS_BASE_URL = 'https://api-sandbox.foodics.com/v5';
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4ZjllYjNmNi02ZWZhLTRmZWYtODk1ZS1kMWJjNDRiYTQ4MWQiLCJqdGkiOiJhZjUwZmU3OWYzYTNhNzM0MTg2ZDYyZWYxMmRlYzQyYjY1YmIzNzdlNzk5MWVjN2VjZjhhMThkNTRhMWM0NTYwNThmODNiYjdhZWM1YTNhZSIsImlhdCI6MTc1NzM0Mjg4Mi42MjY3MywibmJmIjoxNzU3MzQyODgyLjYyNjczLCJleHAiOjE5MTUxMDkyODIuNTk1NTg3LCJzdWIiOiI5ZjkyODA1NC1mZTlkLTRmNzMtYjVhOC1iMjNmZjZjN2FlMmYiLCJzY29wZXMiOlsiZ2VuZXJhbC5yZWFkIiwiaW52ZW50b3J5LnRyYW5zYWN0aW9ucy5yZWFkIiwiaW52ZW50b3J5LnNldHRpbmdzLnJlYWQiLCJpbnZlbnRvcnkuc2V0dGluZ3Mud3JpdGUiLCJpbnZlbnRvcnkudHJhbnNhY3Rpb25zLndyaXRlIl0sImJ1c2luZXNzIjoiOWY5MjgwNTUtMGQ5MC00NTYzLTgyMjItNzNlMWJhMmU4NGE4IiwicmVmZXJlbmNlIjoiMjQ2MDI4In0.baJpKGjlCaa2fmegEA1NVAVYpMvO5-zwmHN_7neRnkJ0cr9534sSBH3ZS42rzkdVEi8L-CH16AN9APmcUROrQiMH7RfCnDWldVCo7cM5DiDc8nuh2xqp4UjIWzzfkeBf8vMf9AAuDIBGFgbExaHuJaX8iixvA5V2LWrKtc0hc5NA2gxJNk6vJcdF08z_Xx3iNVvgje3heidklWF-Im2nsdaTF9iopjyCs3SuAFIWwjYqVs_otCKbhGW_8NHcUYXkFIzsvnCgNuGOATofgPV4Y48w57oc6o1uTGwYjqwxT6JtxrhT0EnNFBeeR2ueAXrG4FlFZAYMyCqGTk7DPwDCFWa2J59P9uzqYcbSaf59E3AOkP4Yp3vipDAnE-rP1kmEBPsp9jYtbMUIrQI0wP6Yh-Ni-UCTXKOwnMNRxXutS2DIxpWmFRZw_FefXEOKRVmNxY7T5s4nPRGxnIkCRYJYJQmrH2hfXLXhf1xJ9LG_38S_i0tYaGDR356F2XRnhl0d7ecBVOxaUkit1LAddYLpa6PQKUOt38OFeBLHayOtCgTlxc5TVFFGbysVVgqUVq7GgM-58Z9yrzvSk2zR55oX2Mha-vm8_ydm-JxnhseDF6iHaRW7Hrg_2FbTWyMUiBkuX40EL47vQ2nfY2yZ-tGMxJRt4iNjhd6ccATZQ7VUORM';

// Proxy route for fetching inventory products
app.get('/api/inventory/products', async (req, res) => {
    try {
        const response = await fetch(`${FOODICS_BASE_URL}/inventory/products`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error from Foodics API:', response.status, errorText);
            return res.status(response.status).json({ error: 'Failed to fetch products from Foodics', details: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Server Error:', error);
        res.status(500).json({ error: 'Proxy server failed to handle the request.' });
    }
});

// Proxy route for creating inventory transactions (e.g., finishing an order)
app.post('/api/inventory/transactions', async (req, res) => {
    try {
        const response = await fetch(`${FOODICS_BASE_URL}/inventory/transactions`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error from Foodics API:', response.status, errorText);
            return res.status(response.status).json({ error: 'Failed to create transaction on Foodics', details: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Server Error:', error);
        res.status(500).json({ error: 'Proxy server failed to handle the request.' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
