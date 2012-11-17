package com.justonetech.system.manager;

import com.justonetech.core.test.SpringTransactionalTestCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.transaction.TransactionConfiguration;

/**
 * Created by IntelliJ IDEA.
 * User: dell
 * Date: 12-3-1
 * Time: 下午3:29
 * To change this template use File | Settings | File Templates.
 */
@ContextConfiguration(locations = {"/applicationContext.xml"})
@TransactionConfiguration(defaultRollback = true)
public class TestDataGenerater extends SpringTransactionalTestCase {

    @Autowired
//    private SysCodeDetailService sysCodeDetailService;

    public void testInsert() throws Exception {
//        for(int i=0; i<1000; i++) {
//            SysCodeDetail bean = new SysCodeDetail();
//            bean.setCode("test" + i);
//            bean.setName("测试代码" + i);
//            bean.setSysCode(new SysCode(3L));
//
//            sysCodeDetailService.save(bean);
//        }
    }
}
