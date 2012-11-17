package com.justonetech.lamp.domain;

import com.justonetech.lamp.domain.base.BaseMendForm;
import com.justonetech.system.domain.SysCode;


public class MendForm extends BaseMendForm {
	private static final long serialVersionUID = 1L;  
    
    private String statusName;



    /*[CONSTRUCTOR MARKER BEGIN]*/
	public MendForm () {
		super();
	}

	/**
	 * Constructor for primary key
	 */
	public MendForm (Long id) {
		super(id);
	}

    public String getStatusName() {
        return statusName;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    /*[CONSTRUCTOR MARKER END]*/


}