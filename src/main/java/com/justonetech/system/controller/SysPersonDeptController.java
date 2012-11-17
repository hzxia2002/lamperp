package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.system.daoservice.SysPersonDeptService;
import com.justonetech.system.domain.SysPersonDept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysPersonDeptController extends BaseCRUDActionController<SysPersonDept> {
    @Autowired
	private SysPersonDeptService sysPersonDeptService;

	@RequestMapping
    @ResponseBody
	public Page<SysPersonDept> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from SysPersonDept t where 1=1 " + page.getOrderByString("t.treeId asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysPersonDeptService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, SysPersonDept entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = sysPersonDeptService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysDeptEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysPersonDept sysPersonDept = sysPersonDeptService.get(id);

        model.addAttribute("bean", sysPersonDept);
        return "view/sys/sysPersonDeptView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") SysPersonDept entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "id",
                    "dept",
                    "person",
                    "position",
                    "orderNo",
                    "isValid",
                    "isManager"
            };

            SysPersonDept target;
            if (entity.getId() != null) {
                target = sysPersonDeptService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            sysPersonDeptService.save(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysPersonDeptService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}