package com.justonetech.system.domain;

import com.justonetech.system.domain.base.BaseSysPersonDept;



public class SysPersonDept extends BaseSysPersonDept {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public SysPersonDept () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public SysPersonDept (java.lang.Long id) {
		super(id);
	}

	/**
	 * Constructor for required fields
	 */
	public SysPersonDept (
		java.lang.Long id,
		com.justonetech.system.domain.SysPerson person,
		com.justonetech.system.domain.SysDept dept) {

		super (
			id,
			person,
			dept);
	}

/*[CONSTRUCTOR MARKER END]*/


}