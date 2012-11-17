package com.justonetech.lamp.domain.base;

import com.justonetech.lamp.domain.MendForm;

import java.io.Serializable;


/**
 * This is an object that contains data related to the out_form_details table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * TableComment : 出库单明细
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 出库单明细
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * Projectable : false
 *
 * @hibernate.class
 *  table="out_form_details"
 */

public abstract class BaseOutFormDetails  implements Serializable{

	public static String REF = "OutFormDetails";
	public static String PROP_PRODUCT = "product";
	public static String MEND_FORM = "mendForm";
	public static String PROP_ID = "id";
	public static String PROP_COUNT = "count";


	// constructors
	public BaseOutFormDetails () {
		initialize();
	}

	/**
	 * Constructor for primary key
	 */
	public BaseOutFormDetails (Long id) {
		this.setId(id);
		initialize();
	}

	protected void initialize () {}



	private int hashCode = Integer.MIN_VALUE;

	// primary key
	private Long id;

	// fields
    /*出库数量*/
    /*出库数量*/
	private Long count;
	

	private com.justonetech.lamp.domain.Product product;

    private MendForm mendForm;

    public MendForm getMendForm() {
        return mendForm;
    }

    public void setMendForm(MendForm mendForm) {
        this.mendForm = mendForm;
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
	public Long getCount () {
		return count;
	}

	/**
	 * Set the value related to the column: COUNT
	 * @param count the COUNT value
	 */
	public void setCount (Long count) {
		this.count = count;
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
		if (!(obj instanceof com.justonetech.lamp.domain.OutFormDetails)) return false;
		else {
			com.justonetech.lamp.domain.OutFormDetails outFormDetails = (com.justonetech.lamp.domain.OutFormDetails) obj;
			if (null == this.getId() || null == outFormDetails.getId()) return false;
			else return (this.getId().equals(outFormDetails.getId()));
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
		return builder.toString();
	}


}