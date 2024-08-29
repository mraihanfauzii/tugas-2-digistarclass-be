const http = require('http');
const url = require('url');
const axios = require('axios');

const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    if (method === 'GET' && path === '/pokemon') {
        try {
            const response = await axios.get(`${POKE_API_URL}?limit=100`);
            res.statusCode = 200;
            res.end(JSON.stringify({
                code: 200,
                data: response.data.results
            }));
        } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ code: 500, error: 'Failed to fetch Pokémon data' }));
        }
    } else if (method === 'GET' && path.startsWith('/pokemon/')) {
        const pokemonName = path.split('/')[2];
        if (pokemonName) {
            try {
                const response = await axios.get(`${POKE_API_URL}/${pokemonName}`);
                res.statusCode = 200;
                res.end(JSON.stringify({
                    code: 200,
                    data: response.data
                }));
            } catch (error) {
                res.statusCode = 404;
                res.end(JSON.stringify({ code: 404, error: 'Pokémon not found' }));
            }
        } else {
            res.statusCode = 400;
            res.end(JSON.stringify({ code: 400, error: 'Pokemon name is required' }));
        }
    } else if (method === 'POST' && path === '/pokemon') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newPokemon = JSON.parse(body);
            res.statusCode = 201;
            res.end(JSON.stringify({
                code: 201,
                message: 'New Pokémon added',
                pokemon: newPokemon
            }));
        });
    } else if (method === 'PUT' && path.startsWith('/pokemon')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (body) {
                const updatedData = JSON.parse(body);
                res.statusCode = 200;
                res.end(JSON.stringify({
                    code: 200,
                    message: 'Pokémon data updated',
                    updatedData: updatedData
                }));
            } else {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    code: 400,
                    error: 'No data provided for update'
                }));
            }
        });
    } else if (method === 'PATCH' && path.startsWith('/pokemon')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (body) {
                const patchData = JSON.parse(body);
                res.statusCode = 200;
                res.end(JSON.stringify({
                    code: 200,
                    message: 'Pokémon data partially updated',
                    patchData: patchData
                }));
            } else {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    code: 400,
                    error: 'No data provided for partial update'
                }));
            }
        });
    } else if (method === 'DELETE' && path.startsWith('/pokemon')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (body) {
                const deletedData = JSON.parse(body);
                res.statusCode = 200;
                res.end(JSON.stringify({
                    code: 200,
                    message: 'Pokémon data deleted',
                    deletedData: deletedData
                }));
            } else {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    code: 400,
                    error: 'No data provided for deletion'
                }));
            }
        });
    } else if (method === 'HEAD' && path === '/pokemon') {
        res.statusCode = 200;
        res.setHeader('Content-Length', '0');
        res.end();
    } else if (method === 'OPTIONS' && path === '/pokemon') {
        res.writeHead(200, {
            'Allow': 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS'
        });
        res.end(JSON.stringify({
            code: 200,
            message: 'OPTIONS request received, showing allowed methods'
        }));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ code: 404, message: 'Route not found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
