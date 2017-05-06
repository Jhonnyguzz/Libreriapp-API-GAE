package co.edu.unal.libreriapp.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;

@Entity
public class Person implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id private String email;
	private String password;
	private String name;
	private String lastName;
	private String gender;
	private Date birthday;
	private byte[] picture;
	private String urlPricture;
	private double reputation;
	private int points;
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	private @Load List<Ref<Book>> myBooks;
	
	public Person() {
		myBooks = new ArrayList<Ref<Book>>();
	}
	
	public Person(String email, String password, String name, String lastName) {
		super();
		this.email = email;
		this.password = password;
		this.name = name;
		this.lastName = lastName;
		myBooks = new ArrayList<Ref<Book>>();
	}
	
	public Person(String email, String password, String name, String lastName, String gender, Date birthday,
			byte[] picture, String urlPricture, double reputation, int points, List<Ref<Book>> myBooks) {
		super();
		this.email = email;
		this.password = password;
		this.name = name;
		this.lastName = lastName;
		this.gender = gender;
		this.birthday = birthday;
		this.picture = picture;
		this.urlPricture = urlPricture;
		this.reputation = reputation;
		this.points = points;
		this.myBooks = myBooks;
	}

	/**
	 * Util methods for POJO
	 */
	public void showMyBooks()
	{
		for (int i = 0; i < myBooks.size(); i++) {
			System.out.println(myBooks.get(i).get());
		}
	}
	
	public void showMyReferenceBooks()
	{
		for (int i = 0; i < myBooks.size(); i++) {
			System.out.println(myBooks.get(i));
		}
	}
	
	public void addBook(Book b)
	{
		myBooks.add(Ref.create(b));
	}
	
	public boolean deleteBook(Book b)
	{
		return myBooks.remove((Ref.create(b)));
	}
	
	public void setProfilePicture() {
		//TODO which of both is not null
	}
	/**
	 * Getters and setters
	 */
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Date getBirthday() {
		return birthday;
	}
	
	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}
	
	public byte[] getPicture() {
		return picture;
	}
	
	public void setPicture(byte[] picture) {
		this.picture = picture;
	}
	
	public String getUrlPricture() {
		return urlPricture;
	}

	public void setUrlPricture(String urlPricture) {
		this.urlPricture = urlPricture;
	}

	public double getReputation() {
		return reputation;
	}
	
	public void setReputation(double reputation) {
		this.reputation = reputation;
	}
	
	public int getPoints() {
		return points;
	}
	
	public void setPoints(int points) {
		this.points = points;
	}

	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public List<Ref<Book>> getMyBooks() {
		return myBooks;
	}
	
	@ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
	public void setMyBooks(List<Ref<Book>> myBooks) {
		this.myBooks = myBooks;
	}

	@Override
	public String toString() {
		return "Person [email=" + email + ", password=" + password + ", name=" + name + ", lastName=" + lastName + "]";
	}
	
}
