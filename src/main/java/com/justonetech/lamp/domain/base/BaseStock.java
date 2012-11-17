package com.justonetech.lamp.domain.base;

import java.io.Serializable;


/**
 * This is an object that contains data related to the stock table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * TableComment : 库存
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 库存
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * Projectable : false
 *
 * @hibernate.class
 *  table="stock"
 */

public abstract class BaseStock  implements Serializable{

	public static String REF = "Stock";
	public static String PROP_PRODUCT = "product";
	public static String PROP_WAREHOUSE = "warehouse";
	public static String PROP_ID = "id";
	public static String PROP_COUNT = "count";


	// constructors
	public BaseStock () {
		initialize();
	}

	/**
	 * Constructor for primary key
	 */
	public BaseStock (Long id) {
		this.setId(id);
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
	
    /*仓库*/
    /*仓库*/
	private String warehouse;
	

	// many to one
	private com.justonetech.lamp.domain.Product product;



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
	 * Return the value associated with the column: WAREHOUSE
	 */
	public String getWarehouse () {
		return warehouse;
	}

	/**
	 * Set the value related to the column: WAREHOUSE
	 * @param warehouse the WAREHOUSE value
	 */
	public void setWarehouse (String warehouse) {
		this.warehouse = warehouse;
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



	public boolean equals (Object obj) {
		if (null == obj) return false;
		if (!(obj instanceof com.justonetech.lamp.domain.Stock)) return false;
		else {
			com.justonetech.lamp.domain.Stock stock = (com.justonetech.lamp.domain.Stock) obj;
			if (null == this.getId() || null == stock.getId()) return false;
			else return (this.getId().equals(stock.getId()));
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
		builder.append(warehouse);
		return builder.toString();
	}


}