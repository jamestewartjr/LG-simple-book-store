process.env.NODE_ENV = 'test'
var expect = require('expect.js')
var database = require('../database')

describe('database', () => {
  beforeEach(() => {
    return database.truncateAllTable()
  })
})

describe('getAllBooks', () => {
  it('shuld return all the books', () => {
    return database.getAllBooks().then(books => {
      expect(books).to.be.a(Array)
      expect(books.length).to.eql(0)
    })
  })
});

describe('createbook', () => {
  it('should insert one book into the books table', () => {
    const attributes = {
      title: '',
      authors:  [ {name: '',
    }
        ],
      genre: [],
    }
    return database.createBook(attributes).then(bookId => {
      return database.getBookById(bookId).then(book => {
        expect(book).to.be.a(Object)
        expect(book.id).to.be.a('number')
        expect(book.title).to.eql('')
      })
    })
  })
});

describe('updateBook', () => {
  it('should update book info into the books table', () => {

  })
})
