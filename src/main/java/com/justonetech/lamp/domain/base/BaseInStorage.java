package com.justonetech.lamp.domain.base;

import com.justonetech.core.entity.Auditable;

import java.io.Serializable;
import java.sql.Timestamp;


/**
 * This is an object that contains data related to the in_storage table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * TableComment : 入库
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 入库
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * Projectable : false
 *
 * @hibernate.class
 *  table="in_storage"
 */

public abstract class BaseInStorage implements Serializable, Auditable {

    public static String REF = "InStorage";
    public static String PROP_PRICE = "price";
    public static String PROP_PRODUCT = "product";
    public static String PROP_ID = "id";
    public static String PROP_COUNT = "count";
    public static String PROP_CREATE_TIME = "createTime";
    public static String PROP_CREATE_USER = "createUser";
    public static String PROP_UPDATE_USER = "updateUser";
    public static String PROP_UPDATE_TIME = "updateTime";

    // constructors
    public BaseInStorage () {
        initialize();
    }

    /**
     * Constructor for primary key
     */
    public BaseInStorage (Long id) {
        this.setId(id);
        initialize();
    }

    /**
     * Constructor for required fields
     */
    public BaseInStorage (
            Long id,
            com.justonetech.lamp.domain.Product product) {

        this.setId(id);
        this.setProduct(product);
        initialize();
    }

    protected void initialize () {}



    private int hashCode = Integer.MIN_VALUE;

    // primary key
    private Long id;

    // fields
    /*数量*/
    /*数量*/
    private java.math.BigDecimal count;

    /*单价*/
    /*单价*/
    private Double price;


    // many to one
    private com.justonetech.lamp.domain.Product product;


    private String description;

    private String code;

    private Timestamp createTime;

    private String createUser;

    private Timestamp updateTime;

    private String updateUser;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    /**
     * Return the unique identifier of this class
     * @hibernate.id
     *  generator-class="com.justonetech.core.orm.hibernate.LongIdGenerator"
     *  column="ID"
     */
    public Long getId () {
        return id;
    }

    /**
     * Set the unique identifier of this class
     * @param id the new ID
     * @deprecated
     */
    public void setId (Long id) {
        this.id = id;
        this.hashCode = Integer.MIN_VALUE;
    }




    /**
     * Return the value associated with the column: COUNT
     */
    public java.math.BigDecimal getCount () {
        return count;
    }

    /**
     * Set the value related to the column: COUNT
     * @param count the COUNT value
     */
    public void setCount (java.math.BigDecimal count) {
        this.count = count;
    }


    /**
     * Return the value associated with the column: PRICE
     */
    public Double getPrice () {
        return price;
    }

    /**
     * Set the value related to the column: PRICE
     * @param price the PRICE value
     */
    public void setPrice (Double price) {
        this.price = price;
    }


    /**
     * Return the value associated with the column: PRODUCT_ID
     */
    public com.justonetech.lamp.domain.Product getProduct () {
        return product;
    }

    /**
     * Set the value related to the column: PRODUCT_ID
     * @param product the PRODUCT_ID value
     */
    public void setProduct (com.justonetech.lamp.domain.Product product) {
        this.product = product;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }

    public boolean equals (Object obj) {
        if (null == obj) return false;
        if (!(obj instanceof com.justonetech.lamp.domain.InStorage)) return false;
        else {
            com.justonetech.lamp.domain.InStorage inStorage = (com.justonetech.lamp.domain.InStorage) obj;
            if (null == this.getId() || null == inStorage.getId()) return false;
            else return (this.getId().equals(inStorage.getId()));
        }
    }

    public int hashCode () {
        if (Integer.MIN_VALUE == this.hashCode) {
            if (null == this.getId()) return super.hashCode();
            else {
                String hashStr = this.getClass().getName() + ":" + this.getId().hashCode();
                this.hashCode = hashStr.hashCode();
            }
        }
        return this.hashCode;
    }


    public String toString () {
        org.apache.commons.lang.builder.ToStringBuilder builder = new org.apache.commons.lang.builder.ToStringBuilder(this);
        builder.append(id);
        builder.append(count);
        builder.append(price);
        builder.append(createTime);
        builder.append(createUser);
        builder.append(updateTime);
        builder.append(updateUser);
        return builder.toString();
    }


}