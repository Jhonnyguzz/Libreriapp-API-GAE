package co.edu.unal.libreriapp.model;


import java.io.Serializable;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Book implements Serializable 
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id private Long id;
	@Index private String name;
	@Index private String isbn;
	@Index private String author;
	@Index private String topic;
	@Index private String editorial;
	private String description;
	private int pages;
	@Index private double price;
	@Index private double reputation;
	@Index private boolean exchange;
	@Index private boolean forSale;
	private int condition; // 1- 10
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	private @Load Ref<Person> person;
	private byte[] picture1;
	private byte[] picture2;
	private byte[] picture3;
	
	//For exchanges
	private boolean confirmVendor;
	private boolean confirmPurchaser;
	@Index private boolean isAvailable = true;
	
	//si buy es true lo quieren comprar, sino es intercambio es false
	private String emailPurchaser;
	private boolean buy; //identifica si lo compraron o lo intercambiaron
	
	//Solo para intercambios
	private Long offeredBook;
	
	public Book(){};
	
	public Book(String name, String author, String topic, double price) {
		this.name = name;
		this.author = author;
		this.topic = topic;
		this.price = price;
	}
	
	public Book(String name, String author, String topic, int pages, double price) {
		this.name = name;
		this.author = author;
		this.topic = topic;
		this.pages = pages;
		this.price = price;
	}
	
	public Book(String name, String isbn, String author, String topic, String editorial, int pages,
			double price, boolean exchange, boolean forSale, int condition) {
		this.name = name;
		this.isbn = isbn;
		this.author = author;
		this.topic = topic;
		this.editorial = editorial;
		this.pages = pages;
		this.price = price;
		this.exchange = exchange;
		this.forSale = forSale;
		this.condition = condition;
	}
	
	public Book(Long id, String name, String isbn, String author, String topic, String editorial, int pages,
			double price, double reputation, boolean exchange, boolean forSale, int condition) {
		this.id = id;
		this.name = name;
		this.isbn = isbn;
		this.author = author;
		this.topic = topic;
		this.editorial = editorial;
		this.pages = pages;
		this.price = price;
		this.reputation = reputation;
		this.exchange = exchange;
		this.forSale = forSale;
		this.condition = condition;
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getIsbn() {
		return isbn;
	}
	
	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}
	
	public String getAuthor() {
		return author;
	}
	
	public void setAuthor(String author) {
		this.author = author;
	}
	
	public String getTopic() {
		return topic;
	}
	
	public void setTopic(String topic) {
		this.topic = topic;
	}
	
	public String getEditorial() {
		return editorial;
	}
	
	public void setEditorial(String editorial) {
		this.editorial = editorial;
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getPages() {
		return pages;
	}
	
	public void setPages(int pages) {
		this.pages = pages;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public double getReputation() {
		return reputation;
	}
	
	public void setReputation(double reputation) {
		this.reputation = reputation;
	}
	
	public boolean isExchange() {
		return exchange;
	}
	
	public void setExchange(boolean exchange) {
		this.exchange = exchange;
	}
	
	public boolean isForSale() {
		return forSale;
	}
	
	public void setForSale(boolean forSale) {
		this.forSale = forSale;
	}
	
	public int getCondition() {
		return condition;
	}
	
	public void setCondition(int condition) {
		this.condition = condition;
	}

	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public Ref<Person> getPerson() {
		return person;
	}

	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public void setPerson(Ref<Person> person) {
		this.person = person;
	}

	public byte[] getPicture1() {
		return picture1;
	}

	public void setPicture1(byte[] picture1) {
		this.picture1 = picture1;
	}

	public byte[] getPicture2() {
		return picture2;
	}

	public void setPicture2(byte[] picture2) {
		this.picture2 = picture2;
	}

	public byte[] getPicture3() {
		return picture3;
	}

	public void setPicture3(byte[] picture3) {
		this.picture3 = picture3;
	}

	public boolean isConfirmVendor() {
		return confirmVendor;
	}

	public void setConfirmVendor(boolean confirmVendor) {
		this.confirmVendor = confirmVendor;
	}

	public boolean isConfirmPurchaser() {
		return confirmPurchaser;
	}

	public void setConfirmPurchaser(boolean confirmPurchaser) {
		this.confirmPurchaser = confirmPurchaser;
	}

	public boolean isAvailable() {
		return isAvailable;
	}

	public void setAvailable(boolean isAvailable) {
		this.isAvailable = isAvailable;
	}

	public String getEmailPurchaser() {
		return emailPurchaser;
	}

	public void setEmailPurchaser(String emailPurchaser) {
		this.emailPurchaser = emailPurchaser;
	}

	public boolean isBuy() {
		return buy;
	}

	public void setBuy(boolean buy) {
		this.buy = buy;
	}

	public Long getOfferedBook() {
		return offeredBook;
	}

	public void setOfferedBook(Long offeredBook) {
		this.offeredBook = offeredBook;
	}

	@Override
	public String toString() {
		return "Book [name=" + name + ", author=" + author + ", topic=" + topic + ", pages=" + pages + ", price="
				+ price + "]";
	}
	
}
