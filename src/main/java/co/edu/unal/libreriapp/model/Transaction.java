package co.edu.unal.libreriapp.model;

public class Transaction {
	
	private String bookId;
	private boolean confirm;
	
	public Transaction(){}
	
	public Transaction(String bookId, boolean confirm) {
		this.setConfirm(confirm);
		this.setBookId(bookId);
	}

	public String getBookId() {
		return bookId;
	}

	public void setBookId(String bookId) {
		this.bookId = bookId;
	}
	
	public boolean isConfirm() {
		return confirm;
	}

	public void setConfirm(boolean confirm) {
		this.confirm = confirm;
	}

}
