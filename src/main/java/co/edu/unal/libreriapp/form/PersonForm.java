package co.edu.unal.libreriapp.form;

public class PersonForm 
{
	private String name;
	private String email;
	private String urlPicture;
	
	public PersonForm() {}
	
	public PersonForm(String name, String email, String urlPicture) {
		this.setName(name);
		this.setEmail(email);
		this.setUrlPicture(urlPicture);
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
	
	public String getUrlPicture() {
		return urlPicture;
	}

	public void setUrlPicture(String urlPicture) {
		this.urlPicture = urlPicture;
	}
		
}