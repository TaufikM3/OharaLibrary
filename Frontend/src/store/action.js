import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:9090';

export default {
  async getNewBooks({ commit }) {
    try {
      console.log('Sending request to /books/newBooks');
      const response = await axios.get('/books/newBooks');
      if (response) {
        commit('setNewBook', response.data);
      } else {
        commit('setStatus', 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error in getNewBooks:', err);
      commit('setStatus', 'Oops, something went wrong.\n' + err);
    }
  },
  async getAllBooks({ commit }) {
    try {
      console.log('Sending request to /books/searchedBooks with empty searchQuery');
      const response = await axios.get('/books/searchedBooks', { params: { searchQuery: '' } });
      if (response) {
        commit('setAllBooks', response.data);
      } else {
        commit('setStatus', 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error in getAllBooks:', err);
      commit('setStatus', 'Oops, something went wrong.\n' + err);
    }
  },
  async getSearchedBooks({ commit }, searchQuery) {
    try {
      console.log(`Sending request to /books/searchedBooks with searchQuery: ${searchQuery}`);
      const response = await axios.get('/books/searchedBooks', { params: { searchQuery } });
      if (response) {
        commit('setSearchedBooks', response.data);
        return response.data;
      } else {
        commit('setStatus', 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error in getSearchedBooks:', err);
      commit('setStatus', 'Oops, something went wrong.\n' + err);
    }
  },
  async getIssuedBooks({ commit, dispatch, state }) {
    try {
      console.log('Sending request to /books/issuedBooks with user id:', state.userInfo.u_id);
      const response = await axios.get('/books/issuedBooks', { params: { u_id: state.userInfo.u_id } });
      if (response) {
        for (let i = 0; i < response.data.length; i++) {
          const book = await dispatch('getSearchedBooks', response.data[i].issuedBook);
          response.data[i].name = book[0].name;
          response.data[i].author = book[0].author;
          response.data[i].genre = book[0].genre;
        }
        commit('setIssuedBooks', response.data);
      } else {
        commit('setStatus', 'Something went wrong.');
      }
    } catch (err) {
      console.error('Error in getIssuedBooks:', err);
      commit('setStatus', 'Oops, something went wrong.\n' + err);
    }
  },
  async returnBook({ commit }, returnInfo) {
    try {
      console.log('Sending request to /return-book with returnInfo:', returnInfo);
      const response = await axios.post('/return-book', returnInfo);
      const isFined = response.data.penaltyInfo ? true : false;

      if (isFined) {
        if (returnInfo.penaltyPaidStatus) {
          const finalResponse = await axios.post('/return-book', returnInfo);
          commit('setStatus', finalResponse.data.status);
        } else {
          return response.data.penaltyInfo;
        }
      } else {
        commit('setStatus', response.data.status);
      }
    } catch (err) {
      console.error('Error in returnBook:', err);
      commit('setStatus', err.response.data.status);
    }
  },
  async issueBook({ commit }, issueInfo) {
    try {
      console.log('Sending request to /issue-book with issueInfo:', issueInfo);
      const response = await axios.post('/issue-book', issueInfo);
      commit('setStatus', response.data.status);
    } catch (err) {
      console.error('Error in issueBook:', err);
      commit('setStatus', err.response.data.status);
    }
  },
  async reissueBook({ commit }, t_id) {
    try {
      console.log('Sending request to /reissue-book with t_id:', t_id);
      const response = await axios.post('/reissue-book', { t_id });
      commit('setStatus', response.data.status);
      commit('setIssuedBooks', response.data.dueDate);
    } catch (err) {
      console.error('Error in reissueBook:', err);
      commit('setStatus', err.response.data.status);
    }
  },
  async deleteBook({ commit }, b_id) {
    try {
      console.log('Sending request to /book with b_id:', b_id);
      const response = await axios.delete('/book', { params: { b_id } });
      commit('setStatus', response.data.status);
      commit('deleteBook', b_id);
    } catch (err) {
      console.error('Error in deleteBook:', err);
      commit('setStatus', 'Oops, something went wrong.\n' + err);
    }
  },
  async addBook({ commit }, book) {
    book.coverPage = 'http://books.google.com/books/content?id=Hd5-722GEgAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api';
    try {
      console.log('Sending request to /book with book:', book);
      const response = await axios.post('/book', book);
      if (response.status === 200) {
        commit('setStatus', response.data.status);
        book.b_id = response.data.b_id;
        commit('addBook', book);
      }
    } catch (err) {
      console.error('Error in addBook:', err);
      commit('setStatus', { value: err.response.data.status });
    }
  },
  async editBook({ commit }, book) {
    try {
      console.log('Sending request to /book with book:', book);
      const response = await axios.put('/book', book);
      if (response.status === 200) {
        commit('setStatus', response.data.status);
        commit('editBook', book);
      }
    } catch (err) {
      console.error('Error in editBook:', err);
      commit('setStatus', err.response.data.status);
    }
  },
  async login({ commit }, data) {
    try {
      console.log('Sending request to /login with data:', data);
      const response = await axios.post('/login', data);
      if (response.status === 200) {
        commit('setUserInfo', response.data);
        return response.status;
      } else {
        commit('setStatus', response.data);
        return response.status;
      }
    } catch (err) {
      console.error('Error in login:', err);
      commit('setStatus', err.response.data.status);
      return err.response.status;
    }
  },
  async register({ commit }, userInfo) {
    try {
      console.log('Sending request to /register with userInfo:', userInfo);
      const response = await axios.post('/register', userInfo);
      commit('setStatus', response.data.status);
    } catch (err) {
      console.error('Error in register:', err);
      commit('setStatus', err);
    }
  },
  async logout({ commit, state }) {
    try {
      console.log('Sending request to /logout with userInfo:', state.userInfo);
      const response = await axios.post('/logout', state.userInfo);
      commit('setUserInfo', {});
      commit('setStatus', response.data.status);
    } catch (err) {
      console.error('Error in logout:', err);
      commit('setStatus', err);
    }
  },
};
