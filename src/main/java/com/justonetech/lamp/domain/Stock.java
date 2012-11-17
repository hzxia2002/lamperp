package com.justonetech.lamp.domain;

import com.justonetech.lamp.domain.base.BaseStock;



public class Stock extends BaseStock {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public Stock () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public Stock (Long id) {
		super(id);
	}

/*[CONSTRUCTOR MARKER END]*/


}