package co.edu.unal.libreriapp.model;

public class Transaction {
	
	private boolean confirm;
	
	public Transaction(){}
	
	public Transaction(boolean confirm) {
		this.setConfirm(confirm);
	}

	public boolean isConfirm() {
		return confirm;
	}

	public void setConfirm(boolean confirm) {
		this.confirm = confirm;
	}

}
