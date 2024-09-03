const express = require('express');
const axios = require('axios');
const app = express();

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

// Middleware untuk parsing JSON body
app.use(express.json());

// GET semua Pokémon
app.get('/pokemon', async (req, res) => {
    try {
        const response = await axios.get(`${POKE_API_URL}?limit=100`);
        res.status(200).json({
            code: 200,
            data: response.data.results
        });
    } catch (error) {
        res.status(500).json({ code: 500, error: 'Failed to fetch Pokémon data' });
    }
});

// GET detail Pokémon tertentu
app.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;
    try {
        const response = await axios.get(`${POKE_API_URL}/${pokemonName}`);
        res.status(200).json({
            code: 200,
            data: response.data
        });
    } catch (error) {
        res.status(404).json({ code: 404, error: 'Pokémon not found' });
    }
});

// POST untuk menambahkan Pokémon baru
app.post('/pokemon', (req, res) => {
    const newPokemon = req.body;
    res.status(201).json({
        code: 201,
        message: 'New Pokémon added',
        pokemon: newPokemon
    });
});

// PUT untuk memperbarui seluruh data Pokémon
app.put('/pokemon', (req, res) => {
    const updatedData = req.body;
    if (Object.keys(updatedData).length === 0) {
        res.status(400).json({
            code: 400,
            error: 'No data provided for update'
        });
    } else {
        res.status(200).json({
            code: 200,
            message: 'Pokémon data updated',
            updatedData: updatedData
        });
    }
});

// PATCH untuk memperbarui sebagian data Pokémon
app.patch('/pokemon', (req, res) => {
    const patchData = req.body;
    if (Object.keys(patchData).length === 0) {
        res.status(400).json({
            code: 400,
            error: 'No data provided for partial update'
        });
    } else {
        res.status(200).json({
            code: 200,
            message: 'Pokémon data partially updated',
            patchData: patchData
        });
    }
});

// DELETE untuk menghapus Pokémon
app.delete('/pokemon', (req, res) => {
    const deletedData = req.body;
    if (Object.keys(deletedData).length === 0) {
        res.status(400).json({
            code: 400,
            error: 'No data provided for deletion'
        });
    } else {
        res.status(200).json({
            code: 200,
            message: 'Pokémon data deleted',
            deletedData: deletedData
        });
    }
});

// HEAD untuk mengecek endpoint Pokémon
app.head('/pokemon', (req, res) => {
    res.status(200).send();
});

// OPTIONS untuk menunjukkan metode yang diperbolehkan
app.options('/pokemon', (req, res) => {
    res.set('Allow', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS');
    res.status(200).json({
        code: 200,
        message: 'OPTIONS request received, showing allowed methods'
    });
});

// Middleware untuk rute tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ code: 404, message: 'Route not found' });
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
