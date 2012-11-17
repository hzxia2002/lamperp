package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.system.daoservice.SysPrivilegeService;
import com.justonetech.system.daoservice.SysRolePrivilegeService;
import com.justonetech.system.daoservice.SysRoleService;
import com.justonetech.system.domain.SysPrivilege;
import com.justonetech.system.domain.SysRole;
import com.justonetech.system.domain.SysRolePrivilege;
import com.justonetech.system.manager.SysRoleManager;
import com.justonetech.system.tree.Node;
import com.justonetech.system.tree.TreeBranch;
import com.justonetech.system.tree.ZTreeNode;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysRolePrivilegeController extends BaseCRUDActionController<SysRolePrivilege> {
    @Autowired
	private SysRolePrivilegeService sysRolePrivilegeService;

    @Autowired
    private SysPrivilegeService sysPrivilegeService;

    @Autowired
    private SysRoleService sysRoleService;

    @Autowired
    private SysRoleManager sysRoleManager;

    /**
     * 取得树数据
     *
     * @throws Exception
     *             异常
     */
    @RequestMapping
    @ResponseBody
    public List<Map> tree(Long roleId) throws Exception {
        List<Map> ret = new ArrayList<Map>();

        // 取得角色权限
        Map<Long, SysPrivilege> rpMap = sysRoleManager.getRolePrivilegesAsMap(roleId);

        Map root = new HashMap();
        root.put("id", "-1");
        root.put("name", "授权资源");
        root.put("open", true);

        if(rpMap.size() > 0) {
            root.put("checked", true);
        }

        ret.add(root);

        // 生成权限节点
        String hql = "from SysPrivilege order by code asc";
        List<SysPrivilege> sysPrivileges = sysPrivilegeService.findByQuery(hql);

        for (SysPrivilege sysPrivilege : sysPrivileges) {
            Map map = new HashMap();

            map.put("id", sysPrivilege.getId());
            map.put("name", sysPrivilege.getName());
            map.put("open", true);

            if(sysPrivilege.getParent() != null) {
                map.put("pId", sysPrivilege.getParent().getId());
            } else {
                map.put("pId", -1);
            }

            if(rpMap.containsKey(sysPrivilege.getId())) {
                map.put("checked", true);
            }

            ret.add(map);
        }

        return ret;
    }

	@RequestMapping
    @ResponseBody
	public Page<SysRolePrivilege> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from SysRolePrivilege t where 1=1 " + page.getOrderByString("t.treeId asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysRolePrivilegeService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, String roleId) throws Exception {
        try {
            model.addAttribute("roleId", roleId);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysRolePrivilegeEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysRolePrivilege sysRolePrivilege = sysRolePrivilegeService.get(id);

        model.addAttribute("bean", sysRolePrivilege);
        return "view/sys/sysRolePrivilegeView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, String ids, Long roleId)
            throws Exception {
        try {
            sysRoleManager.saveRolePrivilege(ids, roleId);
            sendSuccessJSON(response, "保存成功");
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysRolePrivilegeService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}