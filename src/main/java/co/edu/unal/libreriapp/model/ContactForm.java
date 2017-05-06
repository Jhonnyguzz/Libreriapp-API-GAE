package co.edu.unal.libreriapp.model;

public class ContactForm {
	
	private String emailPurchaser;
	private String emailVendor;
	
	public ContactForm() {}
	
	public ContactForm(String emailPurchaser, String emailVendor) {
		this.setEmailPurchaser(emailPurchaser);
		this.setEmailVendor(emailVendor);
	}

	public String getEmailPurchaser() {
		return emailPurchaser;
	}

	public void setEmailPurchaser(String emailPurchaser) {
		this.emailPurchaser = emailPurchaser;
	}

	public String getEmailVendor() {
		return emailVendor;
	}

	public void setEmailVendor(String emailVendor) {
		this.emailVendor = emailVendor;
	}
	
}
