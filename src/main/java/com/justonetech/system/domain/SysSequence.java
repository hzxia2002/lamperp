package com.justonetech.system.domain;

import com.justonetech.system.domain.base.BaseSysSequence;



public class SysSequence extends BaseSysSequence {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public SysSequence () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public SysSequence (java.lang.String id) {
		super(id);
	}

	/**
	 * Constructor for required fields
	 */
	public SysSequence (
		java.lang.String id,
		java.lang.Long lastid) {

		super (
			id,
			lastid);
	}

/*[CONSTRUCTOR MARKER END]*/


}