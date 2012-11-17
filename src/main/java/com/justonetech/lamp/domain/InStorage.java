package com.justonetech.lamp.domain;

import com.justonetech.lamp.domain.base.BaseInStorage;



public class InStorage extends BaseInStorage {
	private static final long serialVersionUID = 1L;

    /*[CONSTRUCTOR MARKER BEGIN]*/
	public InStorage () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public InStorage (Long id) {
		super(id);
	}

	/**
	 * Constructor for required fields
	 */
	public InStorage (
		Long id,
		Product product) {

		super (
			id,
			product);
	}

/*[CONSTRUCTOR MARKER END]*/


}