package co.edu.unal.libreriapp.form;

public class PersonForm 
{
	private String name;
	private String email;
	
	public PersonForm() {}
	
	public PersonForm(String name, String email) {
		this.setName(name);
		this.setEmail(email);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
		
}