package com.justonetech.lamp.daoservice;

import com.justonetech.core.orm.hibernate.EntityService;
import com.justonetech.lamp.domain.InStorage;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by tcg
 * User: tcg
 *
 */
@Service
public class InStorageService extends EntityService<InStorage,Long> {
     @Autowired
    public void setSessionFactory(SessionFactory sessionFactory) {
        initDao(sessionFactory, InStorage.class);
    }
}