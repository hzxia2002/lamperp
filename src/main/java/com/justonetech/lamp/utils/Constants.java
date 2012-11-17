package com.justonetech.lamp.utils;

import java.util.HashMap;

/**
 * Date: 12-10-28
 * Time: 下午4:45
 * To change this template use File | Settings | File Templates.
 */
public class Constants {
    
    public static String MEND_RECORD = "0";        //维修单登记
    public static String MEND_PRODUCT_OUT = "1";  //维修单灯具出库
    public static String MEND_OVER = "2";          //维修完成
    public static HashMap mendStatus =new HashMap<String,String>();;          //维修完成

    static {
        mendStatus.put(MEND_RECORD,"维修单已登记，待维修");
        mendStatus.put(MEND_PRODUCT_OUT,"维修单已登记，待维修");
        mendStatus.put(MEND_OVER,"维修完成");
    }
}
