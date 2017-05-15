package co.edu.unal.libreriapp.dao;

import static co.edu.unal.libreriapp.util.OfyService.factory;
import static co.edu.unal.libreriapp.util.OfyService.ofy;

import java.util.ArrayList;
import java.util.List;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;

import co.edu.unal.libreriapp.model.Book;

public class BookDAO implements IBookDAO 
{
	public void save(Book b)
	{
		ofy().save().entity(b).now();
	}
	
	public Book load(Long id)
	{
		Key<Book> k = Key.create(Book.class, id);
		return ofy().load().key(k).now();
	}
	
	public void remove(Book b)
	{
		ofy().delete().entity(b).now();
	}
	
	public void remove(Long id)
	{
		Key<Book> k = Key.create(Book.class, id);
		ofy().delete().key(k).now();
	}
	
	public List<Book> getAll()
	{
		Query<Book> q = ofy().load().type( Book.class );
		return new ArrayList<Book>( q.list() );
	}
	
	public List<Book> getAvailableBooks()
	{
		Query<Book> q = ofy().load().type( Book.class ).filter("isAvailable", Boolean.TRUE);
		return new ArrayList<Book>( q.list() );
	} 
}
