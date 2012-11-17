package com.justonetech.system.daoservice;

import com.justonetech.core.orm.hibernate.EntityService;
import com.justonetech.system.domain.SysPersonDept;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * author:system
 *注：此文件内容不需要修改
 */
@Service
public class SysPersonDeptService extends EntityService<SysPersonDept,Long> {
    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        initDao(sessionFactory, SysPersonDept.class);
    }
}