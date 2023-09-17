const { nanoid } = require('nanoid');
const { Op } = require('sequelize');
const Book = require('../models/book.model.js');

module.exports = {
    async getAllBooks(_, res) {
        try {
            const books = await Book.findAll({
                attributes: ['id', 'name', 'publisher']
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: 'success',
                data: { books }
            }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async getBookById(req, res) {
        try {
            const { id } = req.params;
            const book = await Book.findByPk(id);
        
            if (!book) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'fail', message: 'Buku tidak ditemukan' }));
                return;
            }
        
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: 'success',
                data: { book }
            }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async createBook (req, res) {
        try {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                const { 
                    name, 
                    year, 
                    author, 
                    summary, 
                    publisher, 
                    pageCount, 
                    readPage, 
                    reading 
                } = JSON.parse(body);

                if (!name) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }));
                    return;
                }
    
                if (readPage > pageCount) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }));
                    return;
                }
            
                const id = nanoid();
                const finished = pageCount === readPage;
                const insertedAt = new Date().toISOString();
                const updatedAt = insertedAt;
            
                const newBook = await Book.create({
                    id,
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    finished,
                    reading,
                    insertedAt,
                    updatedAt
                });
            
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: newBook.id
                    }
                }));
            })
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async updateBookById(req, res) {
        try {
            const { id } = req.params;

            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                const { 
                    name,
                    year, 
                    author, 
                    summary, 
                    publisher, 
                    pageCount, 
                    readPage, 
                    reading 
                } = JSON.parse(body);
    
                const book = await Book.findByPk(id);
    
                if (!book) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }));
                    return;
                }

                if(!name) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }));
                    return;
                }
    
                if (readPage > pageCount) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }));
                    return;
                }
    
                const finished = pageCount === readPage;
                const updatedAt = new Date().toISOString();
    
                await book.update({
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    finished,
                    reading,
                    updatedAt
                });
    
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'success',
                    data: { book }
                }));
            })
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async deleteBookById (req, res) {
        try {
            const { id } = req.params;
            const book = await Book.findByPk(id);
        
            if (!book) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }));
                return;
            }
        
            await book.destroy();
        
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: 'success',
                message: 'Buku berhasil dihapus',
            }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async getReadingBook (req, res) {
        try {
            const { reading } = req.query;

            if (!reading) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Buku tidak ditemukan, query anda salah'
                }));
                return;
            }
        
            const books = await Book.findAll({
                where: {
                    reading: parseInt(reading)
                }
            });

            if (!books) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Data buku tidak ditemukan'
                }));
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: 'success',
                data: { books }
            }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async getFinishedBook (req, res) {
        try {
            const { finished } = req.query;

            if (!finished) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Buku tidak ditemukan, query anda salah'
                }));
                return;
            }
        
            const books = await Book.findAll({
                where: {
                    finished: parseInt(finished)
                }
            });

            if (!books) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Data buku tidak ditemukan'
                }));
                return;
            }
        
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: 'success',
                data: { books }
            }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    },
    async getNameBook (req, res) {
        try {
            const { name } = req.query;
    
            if (!name) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Buku tidak ditemukan, query anda kosong'
                }));
                return;
            }
    
            const book = await Book.findOne({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
                attributes: ['id', 'name', 'publisher']
            });
    
            if (!book) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    status: 'fail',
                    message: 'Data buku tidak ditemukan'
                }));
                return;
            }
    
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: 'success',
                data: { book }
            }));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message }));
        }
    }
}
