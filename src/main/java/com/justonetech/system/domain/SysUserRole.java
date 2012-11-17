package com.justonetech.system.domain;

import com.justonetech.system.domain.base.BaseSysUserRole;



public class SysUserRole extends BaseSysUserRole {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public SysUserRole () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public SysUserRole (java.lang.Long id) {
		super(id);
	}

	/**
	 * Constructor for required fields
	 */
	public SysUserRole (
		java.lang.Long id,
		com.justonetech.system.domain.SysRole role,
		com.justonetech.system.domain.SysUser user) {

		super (
			id,
			role,
			user);
	}

/*[CONSTRUCTOR MARKER END]*/


}