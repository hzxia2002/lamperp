package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.system.daoservice.SysMenuService;
import com.justonetech.system.domain.SysMenu;
import com.justonetech.system.domain.SysPrivilege;
import com.justonetech.system.domain.SysUser;
import com.justonetech.system.manager.SysMenuManager;
import com.justonetech.system.manager.UserManager;
import com.justonetech.system.menu.LigerMenuGenerator;
import com.justonetech.system.menu.MenuGenerator;
import com.justonetech.system.tree.Node;
import com.justonetech.system.tree.TreeBranch;
import com.justonetech.system.tree.ZTreeNode;
import com.justonetech.system.utils.UserSessionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysMenuController extends BaseCRUDActionController<SysMenu> {
    @Autowired
	private SysMenuService sysMenuService;

    @Autowired
    private SysMenuManager sysMenuManager;


    @Autowired
    private UserManager userManager;

	/**
	 * 取得树数据
	 *
	 * @param type
	 *            节点类型
	 * @param uid
	 *            节点ID
	 * @throws Exception
	 *             异常
	 */
    @RequestMapping
    @ResponseBody
    public List<Node> tree(String type,String uid, String id) throws Exception {
        TreeBranch treeBranch = new TreeBranch();
        type = StringUtils.defaultString(type, "");

        if(StringUtils.isEmpty(uid)) {
            ZTreeNode treeNode = new ZTreeNode();
            treeNode.setId("root");
            treeNode.setIsParent(true);
            treeNode.setIsLeaf(false);
            treeNode.setOpen(true);
//            treeNode.setHasChildren(true);
            treeNode.setName("根节点");
            treeNode.setText("根节点");
            treeNode.setUid("root");
            treeBranch.addTreeNode(treeNode);
        } else {
            String hql = "from SysMenu where parent.id is null order by treeId";

            if (!StringUtils.equals(uid, "root")) {
                hql = "from SysMenu where parent.id = " + uid + " order by treeId";
            }

            List<SysMenu> sysMenus = sysMenuService.findByQuery(hql);

            for (SysMenu sysMenu : sysMenus) {
                ZTreeNode treeNode = new ZTreeNode();
                treeNode.setId(sysMenu.getClass().getSimpleName() + "_" + sysMenu.getId());
                if(!sysMenu.getIsLeaf()){
                    treeNode.setIsParent(true);
                    treeNode.setOpen(false);
                }else{
                    treeNode.setIsLeaf(true);
                }
                treeNode.setName(sysMenu.getName());
                treeNode.setText(sysMenu.getName());
                treeNode.setUid(sysMenu.getId().toString());
                treeNode.setType(sysMenu.getClass().getSimpleName());
                treeNode.setTreeId(sysMenu.getTreeId());
                treeBranch.addTreeNode(treeNode);
            }
        }

        return treeBranch.getTreeNodeList();
	}

	@RequestMapping
    @ResponseBody
	public Page<SysMenu> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from SysMenu t where 1=1 " + page.getOrderByString("t.treeId asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysMenuService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String initAdd(Model model, SysMenu entity) throws Exception {
        try {
            if(entity == null) {
                entity = new SysMenu();
            }

            model.addAttribute("bean", entity);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysMenuEdit";
    }

    @RequestMapping
    public String init(Model model, SysMenu entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = sysMenuService.get(entity.getId());
            } else {
                entity = new SysMenu();
            }

            model.addAttribute("bean", entity);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysMenuEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysMenu sysMenu = sysMenuService.get(id);

        model.addAttribute("bean", sysMenu);
        return "view/sys/sysMenuView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") SysMenu entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "name",
                    "privilege",
                    "menuLevel",
                    "url",
                    "jsEvent",
                    "parent",
                    "isValid",
                    "param",
                    "icon",
                    "target"
            };

            SysMenu target;
            if (entity.getId() != null) {
                target = sysMenuService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            sysMenuService.save(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysMenuService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }

    @RequestMapping
    @ResponseBody
    public String getMenu() throws Exception {
        SysUser loginedUser = UserSessionUtils.getInstance().getLoginedUser();
        // 查询所有的有效菜单
        List<SysMenu> list = sysMenuManager.getAllMenu(Boolean.TRUE);
        ArrayList<SysMenu> sysMenus = new ArrayList<SysMenu>();

        List<SysPrivilege> privileges = userManager.getUserRolePrivileges(loginedUser, "1");
        StringBuilder sb = new StringBuilder();
        for (SysPrivilege privilege : privileges) {
            sb.append(",").append(privilege.getCode());
        }
        String sbStr = sb.append(",").toString();

        for (SysMenu sysMenu : list) {
            if(sbStr.indexOf(sysMenu.getPrivilege())>=0){
                sysMenus.add(sysMenu);
            }
        }
        return LigerMenuGenerator.generateMenu(sysMenus);
    }

    @RequestMapping
    @ResponseBody
    public String getFgMenu() throws Exception {
        List<SysMenu> list = sysMenuManager.getAllMenu(Boolean.TRUE);

        return MenuGenerator.generateMenu(list);
    }
}