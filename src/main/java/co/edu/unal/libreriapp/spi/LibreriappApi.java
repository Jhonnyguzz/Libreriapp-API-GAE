package co.edu.unal.libreriapp.spi;

import java.util.ArrayList;
import java.util.List;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Ref;

import co.edu.unal.libreriapp.dao.BookDAO;
import co.edu.unal.libreriapp.dao.PersonDAO;
import co.edu.unal.libreriapp.form.BookForm;
import co.edu.unal.libreriapp.form.PersonForm;
import co.edu.unal.libreriapp.model.Book;
import co.edu.unal.libreriapp.model.ContactForm;
import co.edu.unal.libreriapp.model.ExchangeTransaction;
import co.edu.unal.libreriapp.model.Person;
import co.edu.unal.libreriapp.model.Transaction;
//import com.google.api.client.googleapis.auth.oauth2.;
import co.edu.unal.libreriapp.util.Constants;

@Api(name = "libreriapp", version = "v1", scopes = { Constants.EMAIL_SCOPE }, clientIds = {
        Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID }, description = "API for Libreriapp Backend application.")
public class LibreriappApi 
{
	
	@ApiMethod(name = "savePerson", path = "savePerson", httpMethod = HttpMethod.POST)
	public Person savePerson(final User user, PersonForm person) throws Exception {

        //String mainEmail = person.getEmail();
		String mainEmail = user.getEmail();
		
        PersonDAO personDao = new PersonDAO();
        Person p = personDao.load(mainEmail);
        if(p==null) {
        	p = new Person();
        	p.setEmail(mainEmail);
        	p.setName(person.getName());
        	p.setUrlPicture(person.getUrlPicture());
        	personDao.save(p);
        }else {
        	System.err.println("El usuario ya existe, no se sobreescribe");
        }
        return p;
    }
	
	@ApiMethod(name = "getPerson", path = "getPerson", httpMethod = HttpMethod.POST)
	public Person getPerson(final User user) throws Exception {

        //String mainEmail = person.getEmail();
		String mainEmail = user.getEmail();
		
        PersonDAO personDao = new PersonDAO();
        Person p = personDao.load(mainEmail);
        
        if(p!=null) {
        	return p;
        }else {
        	System.err.println("El usuario no existe en la base de datos");
        	throw new Exception("El usuario no existe en la base de datos");
        }
    }
	
	@ApiMethod(name = "editPerson", path = "editPerson", httpMethod = HttpMethod.POST)
	public Person editPerson(final User user, PersonForm person) throws Exception {

        //String mainEmail = person.getEmail();
		String mainEmail = user.getEmail();
		
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
        
        ArrayList<Book> filterBooks = new ArrayList<>();
        
    	for (int i = 0; i < books.size(); i++) 
    	{
    		//Filtrado, porque con objectify no quiso servir
    		if(books.get(i).isAvailable())
    			filterBooks.add(books.get(i));
    		//System.out.println(books.get(i).toString()+" and is from "+ books.get(i).getPerson().get());
    	}
    	
        return filterBooks;
    }
	
	@ApiMethod(name = "listOneBook", path = "listOneBook", httpMethod = HttpMethod.POST)
	public Book listOneBook(@Named("bookId") String bookId) throws Exception {
		
		System.out.println("This is the BookId: " + bookId);
		
        BookDAO bookDao = new BookDAO();
        Book boo = bookDao.load(Long.parseLong(bookId));
        
        if(boo==null) {
			System.err.println("El libro no existe en el base de datos");
			throw new Exception("Book does not exist in database");
		}
        System.out.println(boo.toString());
        return boo;
    }
	
	@ApiMethod(name = "saveBook", path = "saveBook", httpMethod = HttpMethod.POST)
	public void saveBook(final User user, BookForm bookForm) throws Exception {		
		
		String email = user.getEmail();
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			throw new Exception("User does not exist in database");
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
		int condition = bookForm.getCondition();
		
		String description = bookForm.getDescription();
		
		//Book boo = new Book(name, author, topic, price);
		Book boo = new Book(name, isbn, author, topic, editorial, pages, price, exchange, forSale, condition);
		boo.setDescription(description);
		boo.setPerson(Ref.create(person));
		BookDAO bookDao = new BookDAO();
		bookDao.save(boo);
		person.addBook(boo);
		dao.save(person);
    }
	
	@ApiMethod(name = "editBook", path = "editBook", httpMethod = HttpMethod.POST)
	public void editBook(@Named("email") String email, @Named("bookId") String bookId, BookForm bookForm) throws Exception {		
		//TODO Arreglar los parametros de este api
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		BookDAO bookDao = new BookDAO();
		Book boo = bookDao.load(Long.parseLong(bookId));
		
		if(person==null || boo == null) {
			System.err.println("El usuario o el libro no existe en el base de datos");
			throw new Exception("User or book does not exist in database");
		}
		
		System.err.println(email);
		System.err.println(boo.getPerson().get().getEmail());
		
		if(!email.equals(boo.getPerson().get().getEmail())) {
			System.err.println("El libro no pertenece a este usuario");
			throw new Exception("El libro no pertenece a este usuario");
		}
		
		//TODO Settear los otros valores
		double price = bookForm.getPrice();
		boolean exchange = bookForm.isExchange();
		boolean forSale = bookForm.isForSale();
		String description = bookForm.getDescription();
		
		boo.setPrice(price);
		boo.setExchange(exchange);
		boo.setForSale(forSale);
		boo.setDescription(description);
		
		bookDao.save(boo);
    }
	
	/**
	 * Delete de book with id
	 * @throws Exception 
	 */
	@ApiMethod(name = "deleteBook", path = "deleteBook", httpMethod = HttpMethod.POST)
	public void deleteBook(final User user, @Named("bookId") String bookId) throws Exception {		
		String email = user.getEmail();
		//@Named("email") String email
		
		BookDAO daob = new BookDAO();
		PersonDAO daop = new PersonDAO();
		
		Person person = daop.load(email);
		Book book = daob.load(Long.parseLong(bookId));
		
		if(person == null || book == null) {
			System.err.println("El usuario o el libro no existe en base de datos");
			throw new Exception("User does not exist in database or book does not exist");
		}
		
		if(person.deleteBook(book))
			daob.remove(book);
		else {
			System.err.println("El libro no pertenece a ese usuario");
			throw new Exception("El libro no pertenece a ese usuario");
		}
		daop.save(person);
		
		System.err.println("Operacion borrar libro realizada");
    }
	
	@ApiMethod(name = "myBooks", path = "myBooks", httpMethod = HttpMethod.POST)
	public List<Book> myBooks(final User user) throws Exception {		
		
		String email = user.getEmail();
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			throw new Exception("User does not exist in database");
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myOwnBooks = new ArrayList<>();
		
		for (Ref<Book> obj : myRefBooks) {
			if(obj.get().isAvailable()) {
				myOwnBooks.add(obj.get());
				System.out.println(obj.get().toString());
			}
		}
		
		return myOwnBooks;
	}
	
	@ApiMethod(name = "listMyPurchases", path = "listMyPurchases", httpMethod = HttpMethod.POST)
	public List<Book> listMyPurchases(final User user) throws Exception {		
		
		String email = user.getEmail();
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			throw new Exception("User does not exist in database");
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myPurchaseBooks = new ArrayList<>();
		
		for (Ref<Book> obj : myRefBooks) {
			if(!obj.get().isAvailable() && obj.get().isBuy() && obj.get().isConfirmPurchaser() && obj.get().isConfirmVendor()) {
				myPurchaseBooks.add(obj.get());
				System.out.println(obj.get().toString());
			}
		}
		
		return myPurchaseBooks;
	}
	
	@ApiMethod(name = "listMyExchanges", path = "listMyExchanges", httpMethod = HttpMethod.POST)
	public List<Book> listMyExchanges(final User user) throws Exception {		
		
		String email = user.getEmail();
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			throw new Exception("User does not exist in database");
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myExchangeBooks = new ArrayList<>();
		
		for (Ref<Book> obj : myRefBooks) {
			if(!obj.get().isAvailable() && !obj.get().isBuy() && obj.get().isConfirmPurchaser() && obj.get().isConfirmVendor()) {
				myExchangeBooks.add(obj.get());
				System.out.println(obj.get().toString());
			}
		}
		
		return myExchangeBooks;
	}
	
	@ApiMethod(name = "showUserRequestPurchase", path = "showUserRequestPurchase", httpMethod = HttpMethod.POST)
	public List<Book> showUserRequestPurchase(final User user) throws Exception {		
		
		String email = user.getEmail();
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			throw new Exception("User does not exist in database");
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myRequestPurchaseBooks = new ArrayList<>();
		
		//confirmVendor deberia ser falso
		for (Ref<Book> obj : myRefBooks) {
			if(obj.get().isConfirmPurchaser() && obj.get().isForSale() && !obj.get().isAvailable() && obj.get().isBuy()) {
				myRequestPurchaseBooks.add(obj.get());
				System.out.println(obj.get().toString());
			}
		}
		
		return myRequestPurchaseBooks;
	}
	
	@ApiMethod(name = "showUserRequestExchange", path = "showUserRequestExchange", httpMethod = HttpMethod.POST)
	public List<Book> showUserRequestExchange(final User user) throws Exception {		
		
		String email = user.getEmail();
		
		PersonDAO dao = new PersonDAO();
		Person person = dao.load(email);
		
		if(person==null) {
			System.err.println("El usuario no existe en el base de datos");
			throw new Exception("User does not exist in database");
		}
		
		List<Ref<Book>> myRefBooks = person.getMyBooks();
		List<Book> myRequestExchangeBooks = new ArrayList<>();
		
		//confirmVendor deberia ser falso
		for (Ref<Book> obj : myRefBooks) {
			if(obj.get().isConfirmPurchaser() && obj.get().isExchange() && !obj.get().isAvailable() && !obj.get().isBuy()) {
				myRequestExchangeBooks.add(obj.get());
				System.out.println(obj.get().toString());
			}
		}
		
		return myRequestExchangeBooks;
	}
	
	@ApiMethod(name = "purchase", path = "purchase", httpMethod = HttpMethod.POST)
	public ContactForm purchase(final User user, @Named("bookId") String bookId) throws Exception {		
		
		String emailPurchaser = user.getEmail();
		
		//TODO Retorna una clase diferente que no persista con los datos de usuario
		BookDAO daob = new BookDAO();
		PersonDAO daop = new PersonDAO();
		
		Person person = daop.load(emailPurchaser);
		Book book = daob.load(Long.parseLong(bookId));
		
		if(person == null || book == null) {
			System.err.println("El usuario o el libro no existe en base de datos");
			throw new Exception("User does not exist in database or book does not exist");
		}
		
		if(!book.isForSale())
			throw new Exception("El libro no está disponible para compra");
		
		//Confirmo que el comprador compra en el libro
		book.setConfirmPurchaser(true);	
		book.setAvailable(false);
		book.setBuy(true);
		book.setEmailPurchaser(emailPurchaser);
		
		daob.save(book);
		
		ContactForm contactForm = new ContactForm(person.getEmail(),book.getPerson().get().getEmail());
		return contactForm;
		
	}
	
	@ApiMethod(name = "confirmPurchase", path = "confirmPurchase", httpMethod = HttpMethod.POST)
	public void confirmPurchase(final User user, Transaction transaction) throws Exception {		
		
		String emailVendor = user.getEmail();
		//El Id del libro debe tener un confirm en true que indica que alguien lo desea
		
		PersonDAO daop = new PersonDAO();
		Person vendor = daop.load(emailVendor);
		
		BookDAO daob = new BookDAO();
		Book book = daob.load(Long.parseLong(transaction.getBookId()));
		
		if(book == null) {
			System.err.println("El libro no existe en base de datos");
			throw new Exception("User does not exist in database or book does not exist");
		}
		
		if(!book.isConfirmPurchaser()) {
			try {
				throw new Exception("El libro aun no lo compran o no lo desean intercambiar");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		if(!emailVendor.equals(book.getPerson().get().getEmail())) {
			System.err.println("El libro no pertenece a ese vendedor");
			throw new Exception("El libro no pertenece a ese vendedor");
		}
		
		if(transaction.isConfirm()) {
			//Confirmo que el vendedor vende el libro
			book.setConfirmVendor(true);
			book.setAvailable(false);
			
			//Se hace el intercambio
			String emailNewOwner = book.getEmailPurchaser();
			
			Person owner = daop.load(emailNewOwner);
			
			//Nuevo dueño
			book.setPerson(Ref.create(owner));
			book.setBuy(true);
			book.setEmailPurchaser("");
			
			daob.save(book);
			
			owner.addBook(book);
			vendor.deleteBook(book);
			
			daop.save(owner);
			daop.save(vendor);	
			
			System.err.println("El vendedor confirmo la transaccion");
			
		}else {
			book.setAvailable(true);
			book.setConfirmPurchaser(false);
			book.setConfirmVendor(false);
			book.setEmailPurchaser("");
			daob.save(book);
			System.err.println("El vendedor cancelo la transaccion, volviendo a publicar...");
		}
	}
	
	@ApiMethod(name = "exchange", path = "exchange", httpMethod = HttpMethod.POST)
	public ContactForm exchange(final User user, ExchangeTransaction exchangeTransaction) throws Exception {		
		
		String emailPurchaser = user.getEmail();
		
		//TODO Retorna una clase diferente que no persista con los datos de usuario
		BookDAO daob = new BookDAO();
		PersonDAO daop = new PersonDAO();
		
		Person person = daop.load(emailPurchaser);
		Book bookWanted = daob.load(Long.parseLong(exchangeTransaction.getBookId()));
		Book myBookOffer = daob.load(Long.parseLong(exchangeTransaction.getMyOfferBookId()));
		
		
		if(person == null || bookWanted == null || myBookOffer == null) {
			System.err.println("El usuario o los libros no existen en base de datos");
			throw new Exception("User does not exist in database or books do not exist");

		}
		
		if(!emailPurchaser.equals(myBookOffer.getPerson().get().getEmail())) {
			System.err.println("El libro no pertenece a ese vendedor");
			throw new Exception("El libro no pertenece a ese vendedor");
		}
		
		if(!myBookOffer.isExchange() || !myBookOffer.isAvailable() || !bookWanted.isExchange()) {
			System.err.println("El libro no está disponible para intercambiar");
			throw new Exception("El libro no está disponible para intercambiar");
		}
		
		//Confirmo que el comprador compra en el libro
		bookWanted.setConfirmPurchaser(true);	
		bookWanted.setAvailable(false);
		bookWanted.setBuy(false);
		bookWanted.setEmailPurchaser(emailPurchaser);
		bookWanted.setOfferedBook(Long.parseLong(exchangeTransaction.getMyOfferBookId()));
		
		daob.save(bookWanted);
		
		ContactForm contactForm = new ContactForm(person.getEmail(),bookWanted.getPerson().get().getEmail());
		return contactForm;	
	}
	
	@ApiMethod(name = "confirmExchange", path = "confirmExchange", httpMethod = HttpMethod.POST)
	public void confirmExchange(final User user, Transaction transaction) throws Exception {		
		
		String emailVendor = user.getEmail();
		
		//El Id del libro debe tener un confirm en true que indica que alguien lo desea
		
		
		PersonDAO daop = new PersonDAO();
		Person vendor = daop.load(emailVendor);
	
		BookDAO daob = new BookDAO();
		Book book = daob.load(Long.parseLong(transaction.getBookId()));
		
		if(book == null || vendor==null) {
			System.err.println("El libro o usuario no existe en base de datos");
			throw new Exception("User does not exist in database or book does not exist");
		}
		
		if(!emailVendor.equals(book.getPerson().get().getEmail())) {
			System.err.println("El libro no pertenece a ese vendedor");
			throw new Exception("El libro no pertenece a ese vendedor");
		}
		
		if(!book.isConfirmPurchaser()) {
			throw new Exception("El libro aun no lo compran o no lo desean intercambiar");
		}
		
		if(transaction.isConfirm()) {
			//Confirmo que el vendedor vende el libro
			book.setConfirmVendor(true);
			book.setAvailable(false);
			
			//Se hace el intercambio
			String emailNewOwner = book.getEmailPurchaser();
			
			Person owner = daop.load(emailNewOwner);
			
			//Obteniendo el libro que ofrece el comprador
			Book bookForVendor = daob.load(book.getOfferedBook());
			
			//Nuevo dueño
			book.setPerson(Ref.create(owner));
			book.setBuy(false);
			book.setOfferedBook(0L);
			book.setEmailPurchaser("");
			
			daob.save(book);
			
			owner.addBook(book);
			vendor.deleteBook(book);
			
			owner.deleteBook(bookForVendor);
			
			daop.save(owner);
			
			//Agregando el libro al vendedor
			bookForVendor.setConfirmPurchaser(true);
			bookForVendor.setConfirmVendor(true);
			bookForVendor.setAvailable(false);
			bookForVendor.setOfferedBook(0L);
			bookForVendor.setEmailPurchaser("");
			bookForVendor.setPerson(Ref.create(vendor));
			vendor.addBook(bookForVendor);
			
			daob.save(bookForVendor);
			daop.save(vendor);	
			
			System.err.println("El vendedor confirmo la transaccion");
			
		}else {
			book.setAvailable(true);
			book.setConfirmPurchaser(false);
			book.setConfirmVendor(false);
			book.setEmailPurchaser("");
			book.setOfferedBook(0L);
			daob.save(book);
			System.err.println("El vendedor cancelo la transaccion, vovliendo a publicar...");
		}
	}

}
