package com.justonetech.system.domain;

import com.justonetech.system.domain.base.BaseSysUserPrivilege;



public class SysUserPrivilege extends BaseSysUserPrivilege {
	private static final long serialVersionUID = 1L;

/*[CONSTRUCTOR MARKER BEGIN]*/
	public SysUserPrivilege () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public SysUserPrivilege (java.lang.Long id) {
		super(id);
	}

	/**
	 * Constructor for required fields
	 */
	public SysUserPrivilege (
		java.lang.Long id,
		com.justonetech.system.domain.SysUser user,
		com.justonetech.system.domain.SysPrivilege privilege) {

		super (
			id,
			user,
			privilege);
	}

/*[CONSTRUCTOR MARKER END]*/


}