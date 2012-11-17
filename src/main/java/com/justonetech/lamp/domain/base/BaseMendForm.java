package com.justonetech.lamp.domain.base;

import com.justonetech.lamp.domain.OutStorage;
import com.justonetech.system.domain.SysCode;
import com.justonetech.system.domain.SysCodeDetail;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.io.Serializable;


/**
 * This is an object that contains data related to the mend_form table.
 * Do not modify this class because it will be overwritten if the configuration file
 * related to this class is modified.
 * TableComment : 维修单
 * SyncTemplatepatterns : list\w*
 * SyncDao : false
 * TableName : 维修单
 * SyncBoolean : get
 * SyncJsp : true
 * Treeable : false
 * Projectable : false
 *
 * @hibernate.class
 *  table="mend_form"
 */
@JsonIgnoreProperties(value={"hibernateLazyInitializer"})
public abstract class BaseMendForm  implements Serializable{

	public static String REF = "MendForm";
	public static String PROP_STATUS = "status";
	public static String PROP_RECORD_TIME = "recordTime";
	public static String PROP_STORE_FEE = "storeFee";
	public static String PROP_MEND_DATE = "mendDate";
	public static String PROP_IS_GUARANTEE = "isGuarantee";
	public static String PROP_STORE_NAME = "storeName";
	public static String PROP_LODGE_FEE = "lodgeFee";
	public static String PROP_TROUBLE_CALLER = "troubleCaller";
	public static String PROP_PROBLEM_TYPE_ONE = "problemTypeOne";
	public static String PROP_BREAKDOWN_COUNT = "breakdownCount";
	public static String PROP_MENDER = "mender";
	public static String PROP_DESCRIPTION = "description";
	public static String PROP_MATERIAL_FEE = "materialFee";
	public static String PROP_MEND_RANK = "mendRank";
	public static String PROP_STORE_NO = "storeNo";
	public static String PROP_MEND_NO = "mendNo";
	public static String PROP_FIRM = "firm";
	public static String PROP_TOTAL = "total";
	public static String PROP_IS_CURSHOP_GUARANT = "isCurshopGuarant";
	public static String PROP_PROBLEM_TYPE_SECOND = "problemTypeSecond";
	public static String PROP_TRAFFIC_FEE = "trafficFee";
	public static String PROP_MATERIAL = "material";
	public static String PROP_LAMP_FEE = "lampFee";
	public static String PROP_MEND_DUE_LIMIT = "mendDueLimit";
	public static String PROP_AREA = "area";
	public static String PROP_ID = "id";


	// constructors
	public BaseMendForm () {
		initialize();
	}

	/**
	 * Constructor for primary key
	 */
	public BaseMendForm (Long id) {
		this.setId(id);
		initialize();
	}

	protected void initialize () {}



	private int hashCode = Integer.MIN_VALUE;

	// primary key
	private Long id;

	// fields
    /*维修编号*/
    /*维修编号*/
	private String mendNo;
	
    /*记录日期*/
    /*记录日期*/
	private java.sql.Timestamp recordTime;
	
    /*店号*/
    /*店号*/
	private String storeNo;
	
    /*中文店名*/
    /*中文店名*/
	private String storeName;
	
    /*报修人*/
    /*报修人*/
	private String troubleCaller;
	
    /*保修损坏数量*/
    /*保修损坏数量*/
	private Long breakdownCount;
	
    /*问题描述*/
    /*问题描述*/
	private String description;
	
    /*是否保修*/
    /*是否保修*/
	private Long isGuarantee;
	
    /*是否当店保修*/
    /*是否当店保修*/
	private Long isCurshopGuarant;
	
    /*维修等级*/
    /*维修等级*/
	private SysCodeDetail mendRank;
	

    /*更换材料*/
    /*更换材料*/
	private String material;
	
    /*实际维修日期*/
    /*实际维修日期*/
	private java.sql.Date mendDate;
	
    /*交通费用*/
    /*交通费用*/
	private Double trafficFee;
	
    /*材料费用*/
    /*材料费用*/
	private Double materialFee;
	
    /*住宿费用*/
    /*住宿费用*/
	private Double lodgeFee;
	
    /*灯具费用*/
    /*灯具费用*/
	private Double lampFee;
	
    /*库存费用*/
    /*库存费用*/
	private Double storeFee;
	
    /*总计*/
    /*总计*/
	private Double total;
	
    /*维修人*/
    /*维修人*/
	private String mender;
	
    /*状态*/
    /*状态*/
	private String status;
	

	// many to one
	private com.justonetech.system.domain.SysDept firm;
	private com.justonetech.system.domain.SysCodeDetail area;
	private com.justonetech.system.domain.SysCodeDetail problemTypeSecond;
	private com.justonetech.system.domain.SysCode problemTypeOne;

    private SysCodeDetail mendDueLimit;
    private Double inTrafficFee;
    private Double materialTransFee;

    private Double otherFee;

    private OutStorage outForm;

    public OutStorage getOutForm() {
        return outForm;
    }

    public void setOutForm(OutStorage outForm) {
        this.outForm = outForm;
    }

    public Double getOtherFee() {
        return otherFee;
    }

    public void setOtherFee(Double otherFee) {
        this.otherFee = otherFee;
    }


    public Double getMaterialTransFee() {
        return materialTransFee;
    }

    public void setMaterialTransFee(Double materialTransFee) {
        this.materialTransFee = materialTransFee;
    }

    public Double getInTrafficFee() {
        return inTrafficFee;
    }

    public void setInTrafficFee(Double inTrafficFee) {
        this.inTrafficFee = inTrafficFee;
    }

    public SysCodeDetail getMendDueLimit() {
        return mendDueLimit;
    }

    public void setMendDueLimit(SysCodeDetail mendDueLimit) {
        this.mendDueLimit = mendDueLimit;
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
	 * Return the value associated with the column: MEND_NO
	 */
	public String getMendNo () {
		return mendNo;
	}

	/**
	 * Set the value related to the column: MEND_NO
	 * @param mendNo the MEND_NO value
	 */
	public void setMendNo (String mendNo) {
		this.mendNo = mendNo;
	}


	/**
	 * Return the value associated with the column: RECORD_TIME
	 */
	public java.sql.Timestamp getRecordTime () {
		return recordTime;
	}

	/**
	 * Set the value related to the column: RECORD_TIME
	 * @param recordTime the RECORD_TIME value
	 */
	public void setRecordTime (java.sql.Timestamp recordTime) {
		this.recordTime = recordTime;
	}


	/**
	 * Return the value associated with the column: STORE_NO
	 */
	public String getStoreNo () {
		return storeNo;
	}

	/**
	 * Set the value related to the column: STORE_NO
	 * @param storeNo the STORE_NO value
	 */
	public void setStoreNo (String storeNo) {
		this.storeNo = storeNo;
	}


	/**
	 * Return the value associated with the column: STORE_NAME
	 */
	public String getStoreName () {
		return storeName;
	}

	/**
	 * Set the value related to the column: STORE_NAME
	 * @param storeName the STORE_NAME value
	 */
	public void setStoreName (String storeName) {
		this.storeName = storeName;
	}


	/**
	 * Return the value associated with the column: TROUBLE_CALLER
	 */
	public String getTroubleCaller () {
		return troubleCaller;
	}

	/**
	 * Set the value related to the column: TROUBLE_CALLER
	 * @param troubleCaller the TROUBLE_CALLER value
	 */
	public void setTroubleCaller (String troubleCaller) {
		this.troubleCaller = troubleCaller;
	}


	/**
	 * Return the value associated with the column: BREAKDOWN_COUNT
	 */
	public Long getBreakdownCount () {
		return breakdownCount;
	}

	/**
	 * Set the value related to the column: BREAKDOWN_COUNT
	 * @param breakdownCount the BREAKDOWN_COUNT value
	 */
	public void setBreakdownCount (Long breakdownCount) {
		this.breakdownCount = breakdownCount;
	}


	/**
	 * Return the value associated with the column: DESCRIPTION
	 */
	public String getDescription () {
		return description;
	}

	/**
	 * Set the value related to the column: DESCRIPTION
	 * @param description the DESCRIPTION value
	 */
	public void setDescription (String description) {
		this.description = description;
	}


	/**
	 * Return the value associated with the column: IS_GUARANTEE
	 */
	public Long getIsGuarantee () {
		return isGuarantee;
	}

	/**
	 * Set the value related to the column: IS_GUARANTEE
	 * @param isGuarantee the IS_GUARANTEE value
	 */
	public void setIsGuarantee (Long isGuarantee) {
		this.isGuarantee = isGuarantee;
	}


	/**
	 * Return the value associated with the column: IS_CURSHOP_GUARANT
	 */
	public Long getIsCurshopGuarant () {
		return isCurshopGuarant;
	}

	/**
	 * Set the value related to the column: IS_CURSHOP_GUARANT
	 * @param isCurshopGuarant the IS_CURSHOP_GUARANT value
	 */
	public void setIsCurshopGuarant (Long isCurshopGuarant) {
		this.isCurshopGuarant = isCurshopGuarant;
	}


	/**
	 * Return the value associated with the column: MATERIAL
	 */
	public String getMaterial () {
		return material;
	}

	/**
	 * Set the value related to the column: MATERIAL
	 * @param material the MATERIAL value
	 */
	public void setMaterial (String material) {
		this.material = material;
	}


	/**
	 * Return the value associated with the column: MEND_DATE
	 */
	public java.sql.Date getMendDate () {
		return mendDate;
	}

	/**
	 * Set the value related to the column: MEND_DATE
	 * @param mendDate the MEND_DATE value
	 */
	public void setMendDate (java.sql.Date mendDate) {
		this.mendDate = mendDate;
	}


	/**
	 * Return the value associated with the column: TRAFFIC_FEE
	 */
	public Double getTrafficFee () {
		return trafficFee;
	}

	/**
	 * Set the value related to the column: TRAFFIC_FEE
	 * @param trafficFee the TRAFFIC_FEE value
	 */
	public void setTrafficFee (Double trafficFee) {
		this.trafficFee = trafficFee;
	}


	/**
	 * Return the value associated with the column: MATERIAL_FEE
	 */
	public Double getMaterialFee () {
		return materialFee;
	}

	/**
	 * Set the value related to the column: MATERIAL_FEE
	 * @param materialFee the MATERIAL_FEE value
	 */
	public void setMaterialFee (Double materialFee) {
		this.materialFee = materialFee;
	}


	/**
	 * Return the value associated with the column: LODGE_FEE
	 */
	public Double getLodgeFee () {
		return lodgeFee;
	}

	/**
	 * Set the value related to the column: LODGE_FEE
	 * @param lodgeFee the LODGE_FEE value
	 */
	public void setLodgeFee (Double lodgeFee) {
		this.lodgeFee = lodgeFee;
	}


	/**
	 * Return the value associated with the column: LAMP_FEE
	 */
	public Double getLampFee () {
		return lampFee;
	}

	/**
	 * Set the value related to the column: LAMP_FEE
	 * @param lampFee the LAMP_FEE value
	 */
	public void setLampFee (Double lampFee) {
		this.lampFee = lampFee;
	}


	/**
	 * Return the value associated with the column: STORE_FEE
	 */
	public Double getStoreFee () {
		return storeFee;
	}

	/**
	 * Set the value related to the column: STORE_FEE
	 * @param storeFee the STORE_FEE value
	 */
	public void setStoreFee (Double storeFee) {
		this.storeFee = storeFee;
	}


	/**
	 * Return the value associated with the column: TOTAL
	 */
	public Double getTotal () {
		return total;
	}

	/**
	 * Set the value related to the column: TOTAL
	 * @param total the TOTAL value
	 */
	public void setTotal (Double total) {
		this.total = total;
	}


	/**
	 * Return the value associated with the column: MENDER
	 */
	public String getMender () {
		return mender;
	}

	/**
	 * Set the value related to the column: MENDER
	 * @param mender the MENDER value
	 */
	public void setMender (String mender) {
		this.mender = mender;
	}


	/**
	 * Return the value associated with the column: STATUS
	 */
	public String getStatus () {
		return status;
	}

	/**
	 * Set the value related to the column: STATUS
	 * @param status the STATUS value
	 */
	public void setStatus (String status) {
		this.status = status;
	}


	/**
	 * Return the value associated with the column: FIRM_ID
	 */
	public com.justonetech.system.domain.SysDept getFirm () {
		return firm;
	}

	/**
	 * Set the value related to the column: FIRM_ID
	 * @param firm the FIRM_ID value
	 */
	public void setFirm (com.justonetech.system.domain.SysDept firm) {
		this.firm = firm;
	}


	/**
	 * Return the value associated with the column: AREA
	 */
	public com.justonetech.system.domain.SysCodeDetail getArea () {
		return area;
	}

	/**
	 * Set the value related to the column: AREA
	 * @param area the AREA value
	 */
	public void setArea (com.justonetech.system.domain.SysCodeDetail area) {
		this.area = area;
	}

    public SysCodeDetail getMendRank() {
        return mendRank;
    }

    public void setMendRank(SysCodeDetail mendRank) {
        this.mendRank = mendRank;
    }

    /**
	 * Return the value associated with the column: PROBLEM_TYPE_SECOND
	 */
	public com.justonetech.system.domain.SysCodeDetail getProblemTypeSecond () {
		return problemTypeSecond;
	}

	/**
	 * Set the value related to the column: PROBLEM_TYPE_SECOND
	 * @param problemTypeSecond the PROBLEM_TYPE_SECOND value
	 */
	public void setProblemTypeSecond (com.justonetech.system.domain.SysCodeDetail problemTypeSecond) {
		this.problemTypeSecond = problemTypeSecond;
	}


	/**
	 * Return the value associated with the column: PROBLEM_TYPE_ONE
	 */
	public com.justonetech.system.domain.SysCode getProblemTypeOne () {
		return problemTypeOne;
	}

	/**
	 * Set the value related to the column: PROBLEM_TYPE_ONE
	 * @param problemTypeOne the PROBLEM_TYPE_ONE value
	 */
	public void setProblemTypeOne (com.justonetech.system.domain.SysCode problemTypeOne) {
		this.problemTypeOne = problemTypeOne;
	}



	public boolean equals (Object obj) {
		if (null == obj) return false;
		if (!(obj instanceof com.justonetech.lamp.domain.MendForm)) return false;
		else {
			com.justonetech.lamp.domain.MendForm mendForm = (com.justonetech.lamp.domain.MendForm) obj;
			if (null == this.getId() || null == mendForm.getId()) return false;
			else return (this.getId().equals(mendForm.getId()));
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
		builder.append(mendNo);
		builder.append(recordTime);
		builder.append(storeNo);
		builder.append(storeName);
		builder.append(troubleCaller);
		builder.append(breakdownCount);
		builder.append(description);
		builder.append(isGuarantee);
		builder.append(isCurshopGuarant);
		builder.append(mendRank);
		builder.append(mendDueLimit);
		builder.append(material);
		builder.append(mendDate);
		builder.append(trafficFee);
		builder.append(materialFee);
		builder.append(lodgeFee);
		builder.append(lampFee);
		builder.append(storeFee);
		builder.append(total);
		builder.append(mender);
		builder.append(status);
		return builder.toString();
	}


}