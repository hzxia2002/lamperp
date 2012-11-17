package com.justonetech.system.manager;

import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.system.daoservice.SysDeptService;
import com.justonetech.system.daoservice.SysPersonService;
import com.justonetech.system.daoservice.SysPrivilegeService;
import com.justonetech.system.daoservice.SysRoleService;
import com.justonetech.system.daoservice.SysUserPrivilegeService;
import com.justonetech.system.daoservice.SysUserRoleService;
import com.justonetech.system.daoservice.SysUserService;
import com.justonetech.system.domain.SysDept;
import com.justonetech.system.domain.SysPerson;
import com.justonetech.system.domain.SysPersonDept;
import com.justonetech.system.domain.SysPrivilege;
import com.justonetech.system.domain.SysRole;
import com.justonetech.system.domain.SysUser;
import com.justonetech.system.domain.SysUserPrivilege;
import com.justonetech.system.domain.SysUserRole;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <p>
 * </p>
 * User: <a href="mailto:hzxia2002@gmail.com">Jackie</a> Date: 2009-11-23 Time:
 * 23:40:36 Version: 1.0
 */
@Service
public class SysUserManager {
    private static Logger log = LoggerFactory.getLogger(SysUserManager.class);

    @Autowired
    private SysUserService sysUserService;

    @Autowired
    private SysRoleService sysRoleService;

    @Autowired
    private SysRoleManager sysRoleManager;

    @Autowired
    private SysUserRoleService sysUserRoleService;

    @Autowired
    private SysUserPrivilegeService sysUserPrivilegeService;

    @Autowired
    private SysPrivilegeService sysPrivilegeService;

    @Autowired
    private SysPersonManager sysPersonManager;

    /**
     * 通过用户名取得用户
     *
     * @param userName
     * @return
     */
    public SysUser getByUsername(String userName) {
        List<SysUser> userList = sysUserService.findByProperty("loginName",
                userName);

        if(userList != null && userList.size() > 0) {
            return userList.get(0);
        }

        return null;
    }

    /**
     * 以Map形式返回用户拥有的角色
     *
     * @param userId
     * @return
     */
    public Map<String, SysRole> getUserRolesAsMap(Long userId) {
        Map<String, SysRole> map = new HashMap<String, SysRole>();
        List<SysRole> list = this.getUserRoles(userId);

        for(SysRole role : list) {
            map.put(role.getCode(), role);
        }

        return map;
    }

    /**
     * 保存用户信息
     *
     * @param bean  用户
     * @param roles 角色
     */
    public void save(SysUser bean, String roles) {
        boolean hasId = (bean.getId() != null);

        sysUserService.save(bean);

        if (roles != null && roles.length() > 0) {
            String[] roleId = StringUtils.split(roles, ",");

            if (roleId != null && roleId.length > 0) {
                for (int i = 0; i < roleId.length; i++) {
                    SysRole role = sysRoleService.get(new Long(roleId[i]));
                    SysUserRole userRole = new SysUserRole();

                    userRole.setUser(bean);
                    userRole.setRole(role);
                    sysUserRoleService.save(userRole);
                }
            }
        }
    }

    /**
     * 更新用户信息
     *
     * @param bean  用户
     * @param roles 角色
     */
    public void update(SysUser bean, String roles) {
        Iterator<SysUserRole> it = bean.getSysUserRoles().iterator();

        if (it.hasNext()) {
            while (it.hasNext()) {
                sysUserRoleService.delete((SysUserRole) it.next());
            }

            sysUserRoleService.getSession().flush();
        }

        this.save(bean, roles);
    }

    /**
     * 保存用户信息
     *
     * @param person 人员
     * @param bean  用户
     * @param roles 角色
     */
    public void save(SysPerson person, SysUser bean, String roles) {
        boolean hasId = (bean.getId() != null);

        // 保存人员信息
        sysPersonManager.save(person);

        // 保存用户信息
        bean.setPerson(person);
        sysUserService.save(bean);

        if (roles != null && roles.length() > 0) {
            String[] roleId = StringUtils.split(roles, ",");

            if (roleId != null && roleId.length > 0) {
                for (int i = 0; i < roleId.length; i++) {
                    SysRole role = sysRoleService.get(new Long(roleId[i]));
                    SysUserRole userRole = new SysUserRole();

                    userRole.setUser(bean);
                    userRole.setRole(role);
                    sysUserRoleService.save(userRole);
                }
            }
        }
    }

    /**
     * 更新用户信息
     *
     * @param bean  用户
     * @param roles 角色
     */
    public void update(SysPerson person, SysUser bean, String roles) {
        sysPersonManager.save(person);

        bean.setPerson(person);

        Iterator<SysUserRole> it = bean.getSysUserRoles().iterator();

        if (it.hasNext()) {
            while (it.hasNext()) {
                sysUserRoleService.delete((SysUserRole) it.next());
            }

            sysUserRoleService.getSession().flush();
        }

        this.save(bean, roles);
    }

    /**
     * 取得人员所在的部门
     *
     * @param id 用户id
     * @return 部门
     */
    public SysDept getUserDept(Long id) {
        SysUser user = sysUserService.get(id);

        SysPerson person = user.getPerson();

        if (person != null) {
            Set<SysPersonDept> depts = person.getSysPersonDepts();

            if (depts != null && depts.size() > 0) {
                Iterator<SysPersonDept> it = depts.iterator();

                return it.next().getDept();
            }
        }

        return null;
    }

    /**
     * 按照条件查询用户
     *
     * @param page
     * @param condition
     * @return
     */
    public Page<SysUser> queryPage(Page page, String condition) {
        try {
            page.setAutoCount(true);

            String hql = "select distinct t, t2.name from SysUser t left outer join t.person.sysPersonDepts t1 left join t1.dept t2 " +
                    " where 1=1 " +
                    page.getOrderByString("t.id asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysUserService.findByPage(page, queryTranslate.toString());

            List<Object[]> list = page.getRows();

            if(list != null && list.size() > 0) {
                List<SysUser> ret = new ArrayList<SysUser>();
                for(Object[] obj : list) {
                    SysUser user = (SysUser)obj[0];
                    String name = (String)obj[1];

                    user.setDeptName(name);

                    // 取得角色名称
                    List<SysRole> roles = getUserRoles(user.getId());

                    String roleNames = sysRoleManager.getRoleNamesAsString(roles);
                    user.setRoleNames(roleNames);

                    ret.add(user);
                }

                page.setRows(ret);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return  page;
    }

    /**
     * 删除用户信息 1) 删除用户的角色关联信息； 2)删除用户的权限信息；3) 删除用户信息。
     *
     * @param id 用户ID
     */
    public void delete(Long id) throws Exception {
        try {
            SysUser bean = sysUserService.get(id);
            Iterator<SysUserRole> it = bean.getSysUserRoles().iterator();
            Iterator<SysUserPrivilege> pit = bean.getSysUserPrivileges().iterator();

            // 删除用户角色
            while (it.hasNext()) {
                SysUserRole entity = it.next();

                sysUserRoleService.delete(entity);
            }

            // 删除用户权限
            while (pit.hasNext()) {
                SysUserPrivilege entity = pit.next();

                sysUserPrivilegeService.delete(entity);
            }

            sysUserService.delete(id);
        } catch (Exception e) {
            log.error("error", e);
            throw e;
        }
    }

    /**
     * 根据部门查询用户
     *
     * @return 人员列表
     */
    public List<SysUser> getUserByDept(Long deptId) {
        StringBuffer hql = new StringBuffer("from SysUser t where ");

        // 只查询未离职的用户
//        if (isOver != null && isOver) {
//            hql.append(" t.person.isOver = " + isOver);
//        } else {
//            hql.append(" (t.person.isOver = null or t.person.isOver = "
//                    + isOver + ") ");
//        }

        hql
                .append(" and t.person in (select person from SysPersonDept t2 where t2.dept = "
                        + deptId + " ) order by t.id ");

        return sysUserService.find(hql.toString());
    }

    /**
     * 部门下否有用户
     *
     * @param deptId 部门ID
     * @return 是否有该人员
     */
    public Boolean isDeptHasUser(Long deptId) {
        boolean ret = false;

        List<SysUser> list = this.getUserByDept(deptId);

        if (list != null && list.size() > 0) {
            ret = true;
        }

        return ret;
    }

    /**
     * 取得用户特殊授权数据
     *
     * @param id 用户ID
     * @return 权限列表
     */
    public List<SysPrivilege> getUserSpecialPrivileges(Long id) {
        String sql = "select t1 from SysUserPrivilege t, SysPrivilege t1"
                + " where t.privilege = t1.id and t.user = " + id;

        return sysPrivilegeService.find(sql);
    }

    /**
     * 取得用户特殊授权数据
     *
     * @param id 用户ID
     * @return 用户权限列表
     */
    public List<SysUserPrivilege> getSpecialPrivileges(Long id) {
        String sql = "from SysUserPrivilege t where t.user = " + id;

        return sysUserPrivilegeService.find(sql);
    }

    /**
     * 取得用户角色授权权限
     *
     * @param id 用户ID
     * @return 用户权限列表
     */
    public List<SysPrivilege> getUserRolePrivileges(Long id) {
        String sql = "select distinct(t2) from SysRolePrivilege t1, "
                + "SysPrivilege t2, SysUserRole t3";
        sql += " where t1.privilege = t2.id";
        sql += " and t1.role = t3.role and t3.user = " + id;

        return sysPrivilegeService.find(sql);
    }

    /**
     * 取得用户的所有角色
     *
     * @param id
     * @return
     */
    public List<SysRole> getUserRoles(Long id) {
        String sql = "select t.role from SysUserRole t ";
        sql += " where t.user.id = " + id;
        sql += " order by t.role.code asc";

        return sysRoleService.find(sql);
    }

    /**
     * 保存用户授权数据
     *
     * @param list   SysPrivilege List
     * @param userId userId
     */
    public void saveUserPrivilege(List<SysPrivilege> list, Long userId) {
        // 获取用户信息
        SysUser user = sysUserService.get(userId);

        for (SysPrivilege bean : list) {
            // 删除已经有的授权信息
            String hql = "from SysUserPrivilege where user = " + userId
                    + " and privilege=" + bean.getId();

            List<SysUserPrivilege> tmpList = sysUserPrivilegeService.find(hql);

            for (SysUserPrivilege tmp : tmpList) {
                sysUserPrivilegeService.delete(tmp);
            }
            sysUserPrivilegeService.getSession().flush();

            // 保存新的授权信息
            SysUserPrivilege userPrivilege = new SysUserPrivilege();
            userPrivilege.setUser(user);
            userPrivilege.setPrivilege(sysPrivilegeService.get(bean.getId()));

//            if (bean.getIsDeny() == 1) {
//                userPrivilege.setIsDeny(false);
//                sysUserPrivilegeService.save(userPrivilege);
//            } else if (bean.getIsDeny() == 2) {
//                userPrivilege.setIsDeny(true);
//                sysUserPrivilegeService.save(userPrivilege);
//            }
        }
    }
}
