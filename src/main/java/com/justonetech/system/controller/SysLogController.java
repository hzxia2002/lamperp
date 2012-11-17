package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.DateTimeHelper;
import com.justonetech.system.daoservice.SysLogService;
import com.justonetech.system.domain.SysLog;
import com.justonetech.system.domain.SysUser;
import com.justonetech.system.manager.SysCodeManager;
import com.justonetech.system.manager.SysLogManager;
import com.justonetech.system.utils.Constants;
import com.justonetech.system.utils.UserSessionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysLogController extends BaseCRUDActionController<SysLog> {
    @Autowired
	private SysLogService sysLogService;

    @Autowired
    private SysLogManager sysLogManager;

    @Autowired
    private SysCodeManager sysCodeManager;

	@RequestMapping
    @ResponseBody
	public Page<SysLog> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from SysLog t where 1=1 " + page.getOrderByString("t.id desc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysLogService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, SysLog entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = sysLogService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysDeptEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysLog sysLog = sysLogService.get(id);

        model.addAttribute("bean", sysLog);
        return "view/sys/sysLogView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, HttpServletRequest request,
                     @ModelAttribute("bean") SysLog entity)
            throws Exception {
        try {
            SysUser loginUser = UserSessionUtils.getInstance().getLoginedUser();

            entity.setIpAddress(request.getRemoteHost());
            entity.setUser(loginUser);
            entity.setSessionid(request.getRequestedSessionId());

            // 获取浏览器及其版本
            String agent = request.getHeader("User-Agent");
//            String[] agents = agent.split(";");
            entity.setIeVersion(agent);

            if (StringUtils.isEmpty(entity.getLogTypeCode())) {
                entity.setLogTypeCode(Constants.LOG_TYPE_NORMAL);
            }

            entity.setLogType(sysCodeManager.getCodeListByCode(
                    Constants.LOG_TYPE_CODE, entity.getLogTypeCode()));

            // 设置登入和登出时间
            if(entity.getLogTypeCode().equals(Constants.LOG_TYPE_LOGIN)) {
                entity.setEnterTime(DateTimeHelper.getTimestamp());
            } else if(entity.getLogTypeCode().equals(Constants.LOG_TYPE_LOGOUT)) {
                entity.setOutTime(DateTimeHelper.getTimestamp());
            }

            sysLogManager.save(entity);

            sendSuccessJSON(response, "保存成功");
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysLogService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}