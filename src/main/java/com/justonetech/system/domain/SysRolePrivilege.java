package com.justonetech.system.domain;

import com.justonetech.system.domain.base.BaseSysRolePrivilege;



public class SysRolePrivilege extends BaseSysRolePrivilege {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public SysRolePrivilege () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public SysRolePrivilege (java.lang.Long id) {
		super(id);
	}

	/**
	 * Constructor for required fields
	 */
	public SysRolePrivilege (
		java.lang.Long id,
		com.justonetech.system.domain.SysRole role,
		com.justonetech.system.domain.SysPrivilege privilege) {

		super (
			id,
			role,
			privilege);
	}

/*[CONSTRUCTOR MARKER END]*/


}