package co.edu.unal.libreriapp.model;

public class ExchangeTransaction {
	
	private String bookId;
	private String myOfferBookId;
	
	public ExchangeTransaction(String bookId, String myOfferBookId) {
		this.bookId = bookId;
		this.myOfferBookId = myOfferBookId;
	}

	public String getBookId() {
		return bookId;
	}

	public void setBookId(String bookId) {
		this.bookId = bookId;
	}

	public String getMyOfferBookId() {
		return myOfferBookId;
	}

	public void setMyOfferBookId(String myOfferBookId) {
		this.myOfferBookId = myOfferBookId;
	}

}
