package com.justonetech.lamp.domain;

import com.justonetech.lamp.domain.base.BaseProduct;



public class Product extends BaseProduct {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public Product () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public Product (Long id) {
		super(id);
	}

/*[CONSTRUCTOR MARKER END]*/


}