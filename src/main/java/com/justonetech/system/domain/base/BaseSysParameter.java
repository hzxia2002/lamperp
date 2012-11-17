package com.justonetech.system.domain.base;

import com.justonetech.core.entity.Auditable;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;


/**
 * This is an object that contains data related to the SYS_PARAMETER table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 系统参数表
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * SubSystem : system
 * Projectable : false
 *
 * @hibernate.class
 *  table="SYS_PARAMETER"
 */
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public abstract class BaseSysParameter  implements Serializable, Auditable {

	public static String REF = "SysParameter";
	public static String PROP_VALUE = "value";
	public static String PROP_UPDATE_TIME = "updateTime";
	public static String PROP_CREATE_USER = "createUser";
	public static String PROP_CREATE_TIME = "createTime";
	public static String PROP_CODE = "code";
	public static String PROP_CONSTRAINT = "constraint";
	public static String PROP_NAME = "name";
	public static String PROP_CLOBVALUE = "clobvalue";
	public static String PROP_ID = "id";
	public static String PROP_UPDATE_USER = "updateUser";


	// constructors
	public BaseSysParameter () {
		initialize();
	}

	/**
	 * Constructor for primary key
	 */
	public BaseSysParameter (Long id) {
		this.setId(id);
		initialize();
	}

	protected void initialize () {}



	private int hashCode = Integer.MIN_VALUE;

	// primary key
	private Long id;

	// fields
    /*参数代码*/
    /*参数代码*/
	private String code;
	
    /*参数名称*/
    /*参数名称*/
	private String name;
	
    /*参数值*/
    /*参数值*/
	private String value;
	
    /*约束*/
    /*约束（类型，可见、不可见）*/
	private String constraint;
	
    /*长参数*/
    /*长参数*/
	private String clobvalue;
	
    /*创建时间*/
    /*创建时间*/
	private java.sql.Timestamp createTime;
	
    /*更新时间*/
    /*更新时间*/
	private java.sql.Timestamp updateTime;
	
    /*创建人*/
    /*创建人(记录帐号）*/
	private String createUser;
	
    /*更新人*/
    /*更新人(记录帐号）*/
	private String updateUser;
	



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
	 * Return the value associated with the column: VALUE
	 */
	public String getValue () {
		return value;
	}

	/**
	 * Set the value related to the column: VALUE
	 * @param value the VALUE value
	 */
	public void setValue (String value) {
		this.value = value;
	}


	/**
	 * Return the value associated with the column: CONSTRAINT
	 */
	public String getConstraint () {
		return constraint;
	}

	/**
	 * Set the value related to the column: CONSTRAINT
	 * @param constraint the CONSTRAINT value
	 */
	public void setConstraint (String constraint) {
		this.constraint = constraint;
	}


	/**
	 * Return the value associated with the column: CLOBVALUE
	 */
	public String getClobvalue () {
		return clobvalue;
	}

	/**
	 * Set the value related to the column: CLOBVALUE
	 * @param clobvalue the CLOBVALUE value
	 */
	public void setClobvalue (String clobvalue) {
		this.clobvalue = clobvalue;
	}


	/**
	 * Return the value associated with the column: CREATE_TIME
	 */
	public java.sql.Timestamp getCreateTime () {
		return createTime;
	}

	/**
	 * Set the value related to the column: CREATE_TIME
	 * @param createTime the CREATE_TIME value
	 */
	public void setCreateTime (java.sql.Timestamp createTime) {
		this.createTime = createTime;
	}


	/**
	 * Return the value associated with the column: UPDATE_TIME
	 */
	public java.sql.Timestamp getUpdateTime () {
		return updateTime;
	}

	/**
	 * Set the value related to the column: UPDATE_TIME
	 * @param updateTime the UPDATE_TIME value
	 */
	public void setUpdateTime (java.sql.Timestamp updateTime) {
		this.updateTime = updateTime;
	}


	/**
	 * Return the value associated with the column: CREATE_USER
	 */
	public String getCreateUser () {
		return createUser;
	}

	/**
	 * Set the value related to the column: CREATE_USER
	 * @param createUser the CREATE_USER value
	 */
	public void setCreateUser (String createUser) {
		this.createUser = createUser;
	}


	/**
	 * Return the value associated with the column: UPDATE_USER
	 */
	public String getUpdateUser () {
		return updateUser;
	}

	/**
	 * Set the value related to the column: UPDATE_USER
	 * @param updateUser the UPDATE_USER value
	 */
	public void setUpdateUser (String updateUser) {
		this.updateUser = updateUser;
	}



	public boolean equals (Object obj) {
		if (null == obj) return false;
		if (!(obj instanceof com.justonetech.system.domain.SysParameter)) return false;
		else {
			com.justonetech.system.domain.SysParameter sysParameter = (com.justonetech.system.domain.SysParameter) obj;
			if (null == this.getId() || null == sysParameter.getId()) return false;
			else return (this.getId().equals(sysParameter.getId()));
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
		builder.append(code);
		builder.append(name);
		builder.append(value);
		builder.append(constraint);
		builder.append(clobvalue);
		builder.append(createTime);
		builder.append(updateTime);
		builder.append(createUser);
		builder.append(updateUser);
		return builder.toString();
	}


}