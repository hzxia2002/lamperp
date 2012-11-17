package com.justonetech.system.manager;

import com.justonetech.system.daoservice.SysCodeDetailService;
import com.justonetech.system.daoservice.SysCodeService;
import com.justonetech.system.domain.SysCode;
import com.justonetech.system.domain.SysCodeDetail;
import freemarker.template.utility.StringUtil;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 * Project:bcscmis
 *
 * <p>
 * 系统代码逻辑处理类
 * </p>
 *
 * Create On 2009-12-31 下午07:16:08
 *
 * @author <a href="mailto:hzxia2002@gmail.com">XiaHongzhong</a>
 * @version 1.0
 */
@Service
public class SysCodeManager {
	@Autowired
	private SysCodeDetailService sysCodeDetailService;

    @Autowired
    private SysCodeService sysCodeService;

	/**
	 * 根据代码类型和代码值取得详细代码
	 *
	 * @param mainCode
	 *            代码类型code
	 * @param detailCode
	 *            代码值
	 * @return 代码值
	 */
	public SysCodeDetail getCodeListByCode(String mainCode, String detailCode) {
		String hql = "from SysCodeDetail t where t.sysCode.code = '" + mainCode
				+ "' and t.code = '" + detailCode + "'";

		List<SysCodeDetail> list = sysCodeDetailService.find(hql);

		if (list != null && list.size() > 0) {
			return list.get(0);
		}

		return null;
	}

	/**
	 * 根据代码取得代码列表值
	 *
	 * @param code
	 *            代码类型Code
	 * @return SysCodeDetail列表
	 */
	public List<SysCodeDetail> getCodeDetailListByCode(String code) {
		String hql = "from SysCodeDetail t where lower(t.sysCode.code) = '" + StringUtils.lowerCase(code)
				+ "' order by t.treeId";

		return sysCodeDetailService.find(hql);
	}

    /**
     * 根据代码取得代码列表值
     *
     * @param code
     *            代码类型Code
     * @return SysCodeDetail列表
     */
    public List<SysCode> getCodeListByCode(String code) {
        String hql = "from SysCode t where lower(t.parent.code) = '" + StringUtils.lowerCase(code)
                + "' order by t.treeId";

        return sysCodeService.find(hql);
    }

    /**
     * 根据代码取得代码列表值
     *
     * @param id
     *            代码类型Code
     * @return SysCodeDetail列表
     */
    public List<SysCodeDetail> getCodeDetailListById(Long id) {
        String hql = "from SysCodeDetail t where t.sysCode.id = '" +id
                + "' order by t.treeId";

        return sysCodeDetailService.find(hql);
    }
}
