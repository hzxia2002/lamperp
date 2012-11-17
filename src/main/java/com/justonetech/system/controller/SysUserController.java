package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.CryptUtil;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.system.daoservice.SysDeptService;
import com.justonetech.system.daoservice.SysPersonService;
import com.justonetech.system.daoservice.SysRoleService;
import com.justonetech.system.daoservice.SysUserService;
import com.justonetech.system.domain.SysDept;
import com.justonetech.system.domain.SysPerson;
import com.justonetech.system.domain.SysPersonDept;
import com.justonetech.system.domain.SysRole;
import com.justonetech.system.domain.SysUser;
import com.justonetech.system.manager.SysRoleManager;
import com.justonetech.system.manager.SysUserManager;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Set;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysUserController extends BaseCRUDActionController<SysUser> {
    @Autowired
	private SysUserService sysUserService;

    @Autowired
    private SysUserManager sysUserManager;

    @Autowired
    private SysRoleManager sysRoleManager;

    @Autowired
    private SysDeptService sysDeptService;

    @Autowired
    private SysPersonService sysPersonService;

    @RequestMapping
    @ResponseBody
	public Page<SysUser> grid(Page page, String condition) {
		try {
            page = sysUserManager.queryPage(page, condition);
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, SysUser entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = sysUserService.get(entity.getId());
                entity.setPassword("");

                // 取得用户已有的角色
                List<SysRole> roles = sysUserManager.getUserRoles(entity.getId());

                entity.setRoleNames(sysRoleManager.getRoleIdsAsString(roles));

                if(entity.getPerson() != null && entity.getPerson().getSysPersonDepts() != null) {
                    Set<SysPersonDept> set = entity.getPerson().getSysPersonDepts();

                    for(SysPersonDept spd : set) {
                        entity.setDeptId(spd.getDept().getId());
                        entity.setDeptName(spd.getDept().getName());
                    }
                }

                this.getAllRoles(model);
                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysUserEdit";
    }

    @RequestMapping
    public String initAdd(Model model, SysUser entity) throws Exception {
        try {
            if(entity == null) {
                entity = new SysUser();
            }

            Long deptId = entity.getDeptId();

            if(deptId != null) {
                SysDept dept = sysDeptService.get(deptId);
                entity.setDeptName(dept.getName());
            }

            model.addAttribute("bean", entity);
            this.getAllRoles(model);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysUserAdd";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysUser sysUser = sysUserService.get(id);

        List<SysRole> roles = sysUserManager.getUserRoles(id);

        sysUser.setRoleNames(sysRoleManager.getRoleNamesAsString(roles));

        if(sysUser.getPerson() != null && sysUser.getPerson().getSysPersonDepts() != null) {
            Set<SysPersonDept> set = sysUser.getPerson().getSysPersonDepts();

            for(SysPersonDept spd : set) {
                sysUser.setDeptId(spd.getDept().getId());
                sysUser.setDeptName(spd.getDept().getName());
            }
        }

        model.addAttribute("bean", sysUser);
        return "view/sys/sysUserView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") SysUser entity, String ids)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "person",
                    "loginName",
//                    "password",
                    "displayName",
                    "status",
                    "reasonDesc",
                    "openDate",
                    "closeDate"
            };

            String[] personColumns = new String[]{
                    "code",
                    "name",
                    "card",
                    "sex",
                    "mobile",
                    "officeTel",
                    "faxTel",
                    "email",
                    "zipcode",
                    "msnCode",
                    "qqCode",
                    "memo",
                    "workSiteId",
                    "deptId",
                    "isValid",
                    "isManager",
                    "position"
            };

            SysUser target;
            SysPerson targetPerson = null;

            if (entity.getId() != null) {
                target = sysUserService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);

                // 更新密码信息
                if(StringUtils.isNotBlank(entity.getPassword())) {
                    target.setPassword(CryptUtil.encrypt(entity.getPassword()));
                }

                SysPerson person = entity.getPerson();

                if(person != null && person.getId() != null) {
                    targetPerson = sysPersonService.get(person.getId());

                    person.setName(entity.getDisplayName());
                    person.setDeptId(entity.getDeptId());

                    ReflectionUtils.copyBean(person, targetPerson, personColumns);
                    targetPerson.setDeptId(person.getDeptId());

                    sysUserManager.update(targetPerson, target, ids);
                } else if(person != null) {
                    person.setName(entity.getDisplayName());
                    person.setDeptId(entity.getDeptId());

                    sysUserManager.update(person, target, ids);
                } else {
                    sysUserManager.update(target, ids);
                }
            } else {
                target = entity;

                if(StringUtils.isNotBlank(entity.getPassword())) {
                    target.setPassword(CryptUtil.encrypt(entity.getPassword()));
                }

                SysPerson person = entity.getPerson();
                person.setName(entity.getDisplayName());
                person.setDeptId(entity.getDeptId());

                sysUserManager.save(person, target, ids);
            }

            sendSuccessJSON(response, "保存成功");
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysUserManager.delete(id);

        sendSuccessJSON(response, "删除成功");
    }

    /**
     * 取得所有的角色
     *
     * @param model
     */
    protected void getAllRoles(Model model) {
        List<SysRole> list = sysRoleManager.getAllRoles();

        model.addAttribute("roleList", list);
    }
}