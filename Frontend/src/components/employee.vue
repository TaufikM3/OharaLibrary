<template>
    <div class="atm-container">
      <!-- Daftar buku -->
      <div class="book-list">
        <v-list light style="overflow-y:scroll; height:400px" class="elevation-1">
          <v-list-item v-if="filteredBooks.length === 0">
            Tidak ada buku yang ditemukan.
          </v-list-item>
          <v-list-item v-for="book in filteredBooks" :key="book.id">
            <v-list-item-content class="text-left">
              <v-list-item-title>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ book.name }}</span>
                  </template>
                  <span>{{ book.name }}</span>
                </v-tooltip>
              </v-list-item-title>
              <v-list-item-subtitle>{{ book.author }} • {{ book.genre }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="error" outlined @click="openDeleteDialog(book.b_id)">
                <v-icon>mdi-delete</v-icon> Hapus
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
  
      <!-- Dialog Hapus Buku -->
      <v-dialog v-model="isDeleteDialogOpen" persistent max-width="30rem">
        <v-card light>
          <v-card-title class="mb-1">Hapus buku ini?</v-card-title>
          <v-card-subtitle class="font-weight-bold">{{ selectedBook.name }}</v-card-subtitle>
          <v-card-subtitle>Buku ini akan dihapus dari sistem.</v-card-subtitle>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="darken-1" text @click="isDeleteDialogOpen = false">Batal</v-btn>
            <v-btn color="error darken-1" outlined @click="deleteBook(selectedBook.b_id)">Hapus</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import addOrEditBook from "./addOrEditBook";
  export default {
    name: "ATMInterface",
    components: {
      addOrEditBook,
    },
    data: () => ({
      isDeleteDialogOpen: false,
      selectedBook: {},
      searchedBook: "",
      b_id: "",
      s_id: "",
      penalityPaidStatus: false,
    }),
    methods: {
      deleteBook(b_id) {
        // Fungsi untuk menghapus buku dari sistem
        console.log("Menghapus buku dengan ID:", b_id);
        // Implementasi untuk menghapus buku dari sistem
        this.isDeleteDialogOpen = false;
      },
      openDeleteDialog(b_id) {
        // Menetapkan buku yang dipilih sebelum menghapus
        this.setSelectedBook(b_id);
        this.isDeleteDialogOpen = true;
      },
      setSelectedBook(b_id) {
        // Fungsi untuk menetapkan buku yang dipilih untuk dihapus
        this.selectedBook = this.books.find(book => book.b_id === b_id) || {};
      },
    },
    computed: {
      filteredBooks() {
        // Fungsi untuk menyaring buku berdasarkan pencarian
        return this.books.filter((book) => {
          return book.name.toLowerCase().includes(this.searchedBook.toLowerCase());
        });
      },
      books() {
        // Mengambil data buku dari store atau sumber lainnya
        return [
          { b_id: 1, name: "Book 1", author: "Author 1", genre: "Genre 1" },
          { b_id: 2, name: "Book 2", author: "Author 2", genre: "Genre 2" },
          // Data buku lainnya
        ];
      },
    },
  };
  </script>
  
  <style scoped>
  .atm-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .book-list {
    width: 60%; /* Lebar sesuai dengan kebutuhan */
  }
  </style>
  