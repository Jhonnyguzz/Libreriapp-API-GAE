package co.edu.unal.libreriapp.dao;

import java.util.List;

import co.edu.unal.libreriapp.model.Person;

public interface IPersonDAO {

	void save(Person p);

	Person load(String email);

	void remove(Person p);

	void remove(String email);

	List<Person> getAll();

}