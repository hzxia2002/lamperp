package com.justonetech.system.manager;

import com.justonetech.core.orm.log.ITableLogger;
import com.justonetech.core.orm.log.TableLog;
import com.justonetech.core.orm.log.TableLogConfig;
import com.justonetech.core.orm.log.TableLogUtils;
import com.justonetech.core.security.user.BaseUser;
import com.justonetech.core.security.util.SpringSecurityUtils;
import com.justonetech.core.utils.DateTimeHelper;
import com.justonetech.system.daoservice.ConfigTableService;
import com.justonetech.system.daoservice.SysOperationTableLogService;
import com.justonetech.system.domain.ConfigTable;
import com.justonetech.system.domain.SysOperationTableLog;
import com.justonetech.system.utils.UserSessionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: tcg
 * Date: 2011-11-6
 * Time: 13:21:14
 */
@Service
public class SysOperationTableLogManager implements ITableLogger {
    @Autowired
    private SysOperationTableLogService sysOperationTableLogService;

    @Autowired
    private ConfigTableManager configTableManager;

    @Override
    public Boolean isLog(String tableName) {
        Map map = TableLogUtils.getTableConfigMap();

        if(map != null && map.containsKey(tableName)) {
            return true;
        }

        return false;
    }

    @Override
    public void log(TableLog bean) {
        SysOperationTableLog logBean = new SysOperationTableLog();
        logBean.setLogType(bean.getChangeType());
        logBean.setLogXml(TableLogUtils.toXml(bean));
        logBean.setCreateTime(DateTimeHelper.getTimestamp());

        Map<String, TableLogConfig> map = TableLogUtils.getTableConfigMap();

        if(map != null && map.containsKey(bean.getEntityName())) {
            logBean.setTable((ConfigTable)map.get(bean.getEntityName()));
        }

        BaseUser loginUser = SpringSecurityUtils.getCurrentUser();

        if(loginUser != null) {
            logBean.setCreateUser(loginUser.getLoginName());

            // 记录ip地址
            SecurityContext context = SecurityContextHolder.getContext();
            Authentication auth = context.getAuthentication();
            WebAuthenticationDetails webDetail = null;

            if (auth != null) {
                webDetail = (WebAuthenticationDetails) auth.getDetails();
                logBean.setIpAddress(webDetail.getRemoteAddress());
            }
        }

        sysOperationTableLogService.save(logBean);
    }
}
