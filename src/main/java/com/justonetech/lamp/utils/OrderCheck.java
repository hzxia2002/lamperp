package com.justonetech.lamp.utils;

/**
 * To change this template use File | Settings | File Templates.
 */
public class OrderCheck {
    private boolean isEnough = true;
    private String msg ="";

    public boolean isEnough() {
        return isEnough;
    }

    public void setEnough(boolean enough) {
        isEnough = enough;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
