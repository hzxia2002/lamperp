package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.system.daoservice.SysSequenceService;
import com.justonetech.system.domain.SysSequence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * @version 1.0
 * @author: System
 * @since: 2009-11-20
 */

@Controller
public class SysSequenceController extends
		BaseCRUDActionController<SysSequence> {
	SysSequenceService sysSequenceService;

	/**
	 * 设置Service
	 *
	 * @param sysSequenceService
	 *            SysSequenceService
	 */
	@Autowired
	public void setEntityService(SysSequenceService sysSequenceService) {
		super.setEntityService(sysSequenceService);
		this.sysSequenceService = sysSequenceService;
	}

}