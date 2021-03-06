package com.justonetech.system.daoservice;

import com.justonetech.core.orm.hibernate.EntityService;
import com.justonetech.system.domain.SysUserRole;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * author:system
 *注：此文件内容不需要修改
 */
@Service
public class SysUserRoleService extends EntityService<SysUserRole,Long> {
    @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        initDao(sessionFactory, SysUserRole.class);
    }
}