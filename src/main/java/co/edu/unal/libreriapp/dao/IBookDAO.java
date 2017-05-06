package co.edu.unal.libreriapp.dao;

import java.util.List;

import co.edu.unal.libreriapp.model.Book;

public interface IBookDAO {

	void save(Book b);

	Book load(Long id);

	void remove(Book b);

	void remove(Long id);

	List<Book> getAll();

}