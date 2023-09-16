const http = require('http');
const db = require('./config/database.js');
const { getAllBooks, createBook, deleteBookById, updateBookById, getBookById, getReadingBook, getFinishedBook, getNameBook } = require('./controllers/book.controller.js');

const PORT = 9000;

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET' && req.url === '/books') {
        await getAllBooks(req, res);
    } else if (req.method === 'POST' && req.url === '/books') {
        await createBook(req, res);
    } else if (req.method === 'GET' && req.url.match(/\/books\/\w+/)) {
        const id = req.url.split('/')[2];
        req.params = { id };
        await getBookById(req, res);
    } else if (req.method === 'PUT' && req.url.match(/\/books\/\w+/)) {
        const id = req.url.split('/')[2];
        req.params = { id };
        await updateBookById(req, res);
    } else if (req.method === 'DELETE' && req.url.match(/\/books\/\w+/)) {
        const id = req.url.split('/')[2];
        req.params = { id };
        await deleteBookById(req, res);
    } else if(req.method === 'GET' && req.url.startsWith('/books?reading=')) {
        const reading = req.url.split('=')[1];
        req.query = { reading };
        await getReadingBook(req, res);
    } else if(req.method === 'GET' && req.url.startsWith('/books?finished=')) {
        const finished = req.url.split('=')[1];
        req.query = { finished };
        await getFinishedBook(req, res);
    } else if(req.method === 'GET' && req.url.startsWith('/books?name=')) {
        const name = req.url.split('=')[1];
        req.query = { name };
        await getNameBook(req, res);
    }else {
        res.statusCode = 404;
        res.end(JSON.stringify({ status: 'error', message: 'Not Found' }));
    }
});

db
  .sync()
  .then(() => {
    console.log('Database connected and synchronized.');
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('Error connecting to database:', error));
