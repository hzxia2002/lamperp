package com.justonetech.lamp.controller.home;

import com.justonetech.core.security.user.BaseUser;
import com.justonetech.core.security.util.SpringSecurityUtils;
import com.justonetech.system.controller.SysLogController;
import com.justonetech.system.domain.SysLog;
import com.justonetech.system.domain.SysRole;
import com.justonetech.system.manager.SysUserManager;
import com.justonetech.system.utils.Constants;
import com.justonetech.system.utils.PrivilegeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * <p>
 * 登录后页面跳转处理处理类
 * </p>
 * User: Hzxia
 * Date: 2012-2-20
 * Time: 13:33:50
 */
@Controller
public class LoginController extends SysLogController {
    @Autowired
    private SysUserManager sysUserManager;

    /**
     * <p></p>
     * 登录后页面跳转处理;<br/>
     * 1、如果是系统管理员，直接跳转后台管理页面;<br/>
     * 2、如果是普通用户，直接跳转普通用户查看页面;<br/>
     * </p>
     * @param model
     * @return
     * @throws java.io.IOException
     */
    @RequestMapping
    public String dispatch(Model model, HttpSession session,
                           HttpServletRequest request, HttpServletResponse response) throws Exception {
        BaseUser loginUser = SpringSecurityUtils.getCurrentUser();
        String url = "/index.jsp";
        
        if(loginUser != null) {
            Map<String, SysRole> map = sysUserManager.getUserRolesAsMap(loginUser.getId());

            if(PrivilegeUtils.isSysAdmin()) {
                url = "/view/index.jsp";
            } else if(PrivilegeUtils.isUser()) {
            }
        }
        // 记录系统日志
        SysLog sysLog = new SysLog();
        sysLog.setPageUrl(url);
        sysLog.setLogTypeCode(Constants.LOG_TYPE_LOGIN);

        super.save(response, request, sysLog);
        
        model.addAttribute("url", url);
        session.setAttribute("defaultUrl", url);
        
        return "login_dispatch";
    }
}
