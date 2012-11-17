package com.justonetech.lamp.domain.base;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;


/**
 * This is an object that contains data related to the product table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * TableComment : 产品
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 产品
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * Projectable : false
 *
 * @hibernate.class
 *  table="product"
 */
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public abstract class BaseProduct  implements Serializable{

	public static String REF = "Product";
	public static String PROP_ATTR2 = "attr2";
	public static String PROP_ATTR1 = "attr1";
	public static String PROP_ATTR4 = "attr4";
	public static String PROP_CODE = "code";
	public static String PROP_ATTR3 = "attr3";
	public static String PROP_NAME = "name";
	public static String PROP_ID = "id";


	// constructors
	public BaseProduct () {
		initialize();
	}

	/**
	 * Constructor for primary key
	 */
	public BaseProduct (Long id) {
		this.setId(id);
		initialize();
	}

	protected void initialize () {}



	private int hashCode = Integer.MIN_VALUE;

	// primary key
	private Long id;

	// fields
    /*名称*/
    /*灯具名称*/
	private String name;
	
    /*编号*/
    /*编号*/
	private String code;
	
    /*属性1*/
    /*属性1*/
	private String attr1;
	
    /*属性2*/
    /*属性2*/
	private String attr2;
	
    /*属性3*/
    /*属性3*/
	private String attr3;
	
    /*属性4*/
    /*属性4*/
	private String attr4;
	



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
	 * Return the value associated with the column: NAME
	 */
	public String getName () {
		return name;
	}

	/**
	 * Set the value related to the column: NAME
	 * @param name the NAME value
	 */
	public void setName (String name) {
		this.name = name;
	}


	/**
	 * Return the value associated with the column: CODE
	 */
	public String getCode () {
		return code;
	}

	/**
	 * Set the value related to the column: CODE
	 * @param code the CODE value
	 */
	public void setCode (String code) {
		this.code = code;
	}


	/**
	 * Return the value associated with the column: ATTR1
	 */
	public String getAttr1 () {
		return attr1;
	}

	/**
	 * Set the value related to the column: ATTR1
	 * @param attr1 the ATTR1 value
	 */
	public void setAttr1 (String attr1) {
		this.attr1 = attr1;
	}


	/**
	 * Return the value associated with the column: ATTR2
	 */
	public String getAttr2 () {
		return attr2;
	}

	/**
	 * Set the value related to the column: ATTR2
	 * @param attr2 the ATTR2 value
	 */
	public void setAttr2 (String attr2) {
		this.attr2 = attr2;
	}


	/**
	 * Return the value associated with the column: ATTR3
	 */
	public String getAttr3 () {
		return attr3;
	}

	/**
	 * Set the value related to the column: ATTR3
	 * @param attr3 the ATTR3 value
	 */
	public void setAttr3 (String attr3) {
		this.attr3 = attr3;
	}


	/**
	 * Return the value associated with the column: ATTR4
	 */
	public String getAttr4 () {
		return attr4;
	}

	/**
	 * Set the value related to the column: ATTR4
	 * @param attr4 the ATTR4 value
	 */
	public void setAttr4 (String attr4) {
		this.attr4 = attr4;
	}



	public boolean equals (Object obj) {
		if (null == obj) return false;
		if (!(obj instanceof com.justonetech.lamp.domain.Product)) return false;
		else {
			com.justonetech.lamp.domain.Product product = (com.justonetech.lamp.domain.Product) obj;
			if (null == this.getId() || null == product.getId()) return false;
			else return (this.getId().equals(product.getId()));
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
		builder.append(name);
		builder.append(code);
		builder.append(attr1);
		builder.append(attr2);
		builder.append(attr3);
		builder.append(attr4);
		return builder.toString();
	}


}