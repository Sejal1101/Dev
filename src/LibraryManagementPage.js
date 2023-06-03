
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const LibraryManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [publishDateFilter, setPublishDateFilter] = useState('');

  const resultsPerPage = 10; // Define the number of results per page

// Rest of the code

  useEffect(() => {
    // Fetch the book data from the Google Books API
    axios.get('https://www.googleapis.com/books/v1/volumes?q=react')
      .then((response) => {
        const bookData = response.data.items.map((item) => ({
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown',
          subject: item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : 'Unknown',
          publishDate: item.volumeInfo.publishedDate || 'Unknown',
        }));
        setBooks(bookData);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleTitleChange = (e) => {
    setTitleFilter(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setAuthorFilter(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubjectFilter(e.target.value);
  };

  const handlePublishDateChange = (e) => {
    setPublishDateFilter(e.target.value);
  };

  const applyFilters = () => {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      book.author.toLowerCase().includes(authorFilter.toLowerCase()) &&
      book.subject.toLowerCase().includes(subjectFilter.toLowerCase()) &&
      book.publishDate.toLowerCase().includes(publishDateFilter.toLowerCase())
    );

    return filteredBooks;
  };

  const handlePagination = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (direction === 'next' && currentPage < Math.ceil(applyFilters().length / resultsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const renderBooks = () => {
    const filteredBooks = applyFilters();
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);

    if (currentBooks.length === 0) {
      return <p>No books found.</p>;
    }

    return currentBooks.map((book, index) => (
      <div className="bookItem" key={index}>
        <h3>{book.title}</h3>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Subject:</strong> {book.subject}</p>
        <p><strong>Publish Date:</strong> {book.publishDate}</p>
      </div>
    ));
  };

  const filteredBooks = applyFilters();
  const totalPages = Math.ceil(filteredBooks.length / resultsPerPage);
  const filteredBooksCount = filteredBooks.length;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="libraryManagementPage">
      <h1>Library Management Page</h1>

      <div className="filters">
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={titleFilter} onChange={handleTitleChange} placeholder="Filter by title" />

        <label htmlFor="author">Author:</label>
        <input type="text" id="author" value={authorFilter} onChange={handleAuthorChange} placeholder="Filter by author" />

        <label htmlFor="subject">Subject:</label>
        <input type="text" id="subject" value={subjectFilter} onChange={handleSubjectChange} placeholder="Filter by subject" />

        <label htmlFor="publishDate">Publish Date:</label>
        <input type="text" id="publishDate" value={publishDateFilter} onChange={handlePublishDateChange} placeholder="Filter by publish date" />
      </div>

      <div className="bookCount">
        <strong>Total Books:</strong> {filteredBooksCount}
      </div>

      <div className="bookList">
        {renderBooks()}
      </div>

      <div className="pagination">
        <button disabled={isFirstPage} onClick={() => handlePagination('prev')}>Previous</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={isLastPage} onClick={() => handlePagination('next')}>Next</button>
      </div>
    </div>
  );
};

export default LibraryManagementPage;
