package com.justonetech.lamp.domain.base;

import com.justonetech.core.entity.Auditable;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * This is an object that contains data related to the out_storage table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * TableComment : 出库单
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 出库单
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * Projectable : false
 *
 * @hibernate.class
 *  table="out_storage"
 */
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public abstract class BaseOutStorage  implements Serializable, Auditable {

	public static String REF = "OutStorage";
	public static String PROP_OUT_DATE = "outDate";
	public static String PROP_DRAWER = "drawer";
	public static String PROP_MEND_FORM = "mendForm";
	public static String PROP_ID = "id";
    public static String PROP_CREATE_TIME = "createTime";
    public static String PROP_CREATE_USER = "createUser";
    public static String PROP_UPDATE_TIME = "updateTime";
    public static String PROP_UPDATE_USER = "updateUser";

	// constructors
	public BaseOutStorage () {
		initialize();
	}

	/**
	 * Constructor for primary key
	 */
	public BaseOutStorage (Long id) {
		this.setId(id);
		initialize();
	}

	protected void initialize () {}

	private int hashCode = Integer.MIN_VALUE;

	// primary key
	private Long id;

	// fields
    /*申领人*/
    /*申领人*/
	private String drawer;
	
    /*出库日期*/
    /*出库日期*/
	private java.sql.Date outDate;

	// many to one
    private String outNo;
    private String hander;

    private Timestamp createTime;

    private String createUser;

    private Timestamp updateTime;

    private String updateUser;

    public String getHander() {
        return hander;
    }

    public void setHander(String hander) {
        this.hander = hander;
    }

    public String getOutNo() {
        return outNo;
    }

    public void setOutNo(String outNo) {
        this.outNo = outNo;
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
	 * Return the value associated with the column: DRAWER
	 */
	public String getDrawer () {
		return drawer;
	}

	/**
	 * Set the value related to the column: DRAWER
	 * @param drawer the DRAWER value
	 */
	public void setDrawer (String drawer) {
		this.drawer = drawer;
	}

	/**
	 * Return the value associated with the column: OUT_DATE
	 */
	public java.sql.Date getOutDate () {
		return outDate;
	}

	/**
	 * Set the value related to the column: OUT_DATE
	 * @param outDate the OUT_DATE value
	 */
	public void setOutDate (java.sql.Date outDate) {
		this.outDate = outDate;
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
		if (!(obj instanceof com.justonetech.lamp.domain.OutStorage)) return false;
		else {
			com.justonetech.lamp.domain.OutStorage outStorage = (com.justonetech.lamp.domain.OutStorage) obj;
			if (null == this.getId() || null == outStorage.getId()) return false;
			else return (this.getId().equals(outStorage.getId()));
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
		builder.append(drawer);
		builder.append(outDate);
        builder.append(createTime);
        builder.append(createUser);
        builder.append(updateTime);
        builder.append(updateUser);

		return builder.toString();
	}
}