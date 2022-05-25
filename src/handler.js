const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
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
    updatedAt,
  };

  if (name === '' || name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;
  const allBooks = [...books.values()];
  let booksByQuery = allBooks;

  if (name !== undefined) {
    booksByQuery =
    allBooks.filter((entry) => entry.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    booksByQuery = allBooks.filter((entry) => !!Number(reading) === entry.reading);
  }

  if (finished !== undefined) {
    booksByQuery = allBooks.filter((entry) => !!Number(finished) === entry.finished);
  }

  const booksResponse = booksByQuery.map((entry) => {
    return {
      id: entry.id,
      name: entry.name,
      publisher: entry.publisher,
    };
  });
  return h.response({
    status: 'success',
    data: {
      books: booksResponse,
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((book) => book.id === bookId)[0];
  if (book === undefined) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: book,
    },
  }).code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
};
