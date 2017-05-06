package co.edu.unal.libreriapp.spi;

import java.util.ArrayList;
import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;
import com.googlecode.objectify.Ref;

import co.edu.unal.libreriapp.dao.BookDAO;
import co.edu.unal.libreriapp.dao.PersonDAO;
import co.edu.unal.libreriapp.form.BookForm;
import co.edu.unal.libreriapp.form.PersonForm;
import co.edu.unal.libreriapp.model.Book;
import co.edu.unal.libreriapp.model.Person;
//import com.google.api.client.googleapis.auth.oauth2.;
import co.edu.unal.libreriapp.util.Constants;

@Api(name = "libreriapp", version = "v1", scopes = { Constants.EMAIL_SCOPE }, clientIds = {
        Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID }, description = "API for Libreriapp Backend application.")
public class LibreriappApi 
{
	
	@ApiMethod(name = "savePerson", path = "savePerson", httpMethod = HttpMethod.POST)
	public Person savePerson(PersonForm person) throws Exception {

        String mainEmail = person.getEmail();
        
        PersonDAO personDao = new PersonDAO();
        Person p = personDao.load(mainEmail);
        if(p==null) {
        	p = new Person();
        	p.setEmail(mainEmail);
        	p.setName(person.getName());
        	personDao.save(p);
        }else {
        	System.err.println("El usuario ya existe");
        	throw new Exception("El usuario ya existe");
        }
        return p;
    }
	
	@ApiMethod(name = "editPerson", path = "editPerson", httpMethod = HttpMethod.POST)
	public Person editPerson(PersonForm person) throws Exception {

        String mainEmail = person.getEmail();
        
        PersonDAO personDao = new PersonDAO();
        Person p = personDao.load(mainEmail);
        
        if(p!=null) {
        	p.setName(person.getName());
        	
        	//TODO Recuperar los otros datos
        	//y salvarlos para "editar perfil"
        	
        	
        	personDao.save(p);
        }else {
        	System.err.println("El usuario no existe en la base de datos");
        	throw new Exception("El usuario no existe en la base de datos");
        }
        return p;
    }
	
	
	@ApiMethod(name = "listPeople", path = "listPeople", httpMethod = HttpMethod.POST)
	public List<Person> listPeople() {
        PersonDAO personDao = new PersonDAO();
        List<Person> people = new ArrayList<>(personDao.getAll());
        
        //TODO This is just a test
    	for (int i = 0; i < people.size(); i++) 
    	{
    		System.out.println(people.get(i).toString());
    	}
        
        return people;
    }
	
	@ApiMethod(name = "listBooks", path = "listBooks", httpMethod = HttpMethod.POST)
	public List<Book> listBooks() {
        BookDAO bookDao = new BookDAO();
        List<Book> books = new ArrayList<>(bookDao.getAll());
        
        //This is just a test
    	for (int i = 0; i < books.size(); i++) 
    	{
    		System.out.println(books.get(i).toString()+" and is from "+ books.get(i).getPerson().get());
    	}
    	
        return books;
    }
	
	@ApiMethod(name = "saveBook", path = "saveBook", httpMethod = HttpMethod.POST)
	public void saveBook(@Named("email") String email, BookForm bookForm) {		
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			try {
				throw new Exception("User does not exist in database");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		//TODO Settear los otros valores
		
		String name = bookForm.getName();
		System.out.println(name);
		String author = bookForm.getAuthor();
		System.out.println(author);
		String topic = bookForm.getTopic();
		System.out.println(topic);
		double price = bookForm.getPrice();
		System.out.println(price);
		
		//TODO if is not null
		String isbn = bookForm.getIsbn();
		String editorial = bookForm.getEditorial();
		int pages = bookForm.getPages();
		boolean exchange = bookForm.isExchange();
		boolean forSale = bookForm.isForSale();
		int copies = bookForm.getCopies();
		int state = bookForm.getState();
		
		String description = bookForm.getDescription();
		
		//Book boo = new Book(name, author, topic, price);
		Book boo = new Book(name,isbn, author, topic, editorial, pages, price, exchange, forSale, copies, state);
		boo.setDescription(description);
		boo.setPerson(Ref.create(person));
		BookDAO bookDao = new BookDAO();
		bookDao.save(boo);
		person.addBook(boo);
		dao.save(person);
    }
	
	/**
	 * Delete de book with id
	 */
	@ApiMethod(name = "deleteBook", path = "deleteBook", httpMethod = HttpMethod.POST)
	public void deleteBook(@Named("email") String email, @Named("bookid") Long bookId) {		
		
		BookDAO daob = new BookDAO();
		PersonDAO daop = new PersonDAO();
		
		Person person = daop.load(email);
		Book book = daob.load(bookId);
		
		if(person == null || book == null) {
			System.err.println("El usuario o el libro no existe en base de datos");
			try {
				throw new Exception("User does not exist in database or book does not exist");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		if(person.deleteBook(book))
			daob.remove(book);
		else
			System.err.println("El libro no pertenece a ese usuario");
		daop.save(person);
		
		System.err.println("Operacion borrar libro realizada");
    }
	
	@ApiMethod(name = "myBooks", path = "myBooks", httpMethod = HttpMethod.POST)
	public List<Book> myBooks(@Named("email") String email) {		
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			try {
				throw new Exception("User does not exist in database");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myOwnBooks = new ArrayList<>();
		
		for (Ref<Book> obj : myRefBooks) {
			myOwnBooks.add(obj.get());
		}
		
		return myOwnBooks;
	}
	
	@ApiMethod(name = "purchase", path = "purchase", httpMethod = HttpMethod.POST)
	public void purchase(@Named("email") String email) {		
		//TODO Retorna una clase diferente que no persista con los datos de usuario
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			try {
				throw new Exception("User does not exist in database");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myOwnBooks = new ArrayList<>();
		
		for (Ref<Book> obj : myRefBooks) {
			myOwnBooks.add(obj.get());
		}
		
	}

}
