package com.justonetech.lamp.manager;

import com.justonetech.lamp.daoservice.MendFormService;
import com.justonetech.lamp.domain.MendForm;
import com.justonetech.system.manager.SequenceManager;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Date: 12-10-28
 * Time: 下午3:45
 * To change this template use File | Settings | File Templates.
 */
@Service
public class MendFormManager {
    @Autowired
    private MendFormService mendFormService;

    @Autowired
    private SequenceManager sequenceManager;

    public void saveMendForm(MendForm mendForm){
        if(StringUtils.isEmpty(mendForm.getMendNo())){
            mendForm.setMendNo(sequenceManager.getNextNo("W"));
        }
        mendFormService.save(mendForm);
    }
}
