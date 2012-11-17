package com.justonetech.lamp.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.lamp.daoservice.OutFormDetailsService;
import com.justonetech.lamp.domain.OutFormDetails;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class OutFormDetailsController extends BaseCRUDActionController<OutFormDetails> {
    private static Log log = LogFactory.getLog(OutFormDetailsController.class);

    @Autowired
	private OutFormDetailsService outFormDetailsService;



	@RequestMapping
    @ResponseBody
	public Page<OutFormDetails> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from OutFormDetails t where 1=1 " + page.getOrderByString("t.treeId asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = outFormDetailsService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, OutFormDetails entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = outFormDetailsService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/out/outFormDetailsEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        OutFormDetails outFormDetails = outFormDetailsService.get(id);

        model.addAttribute("bean", outFormDetails);
        return "view/out/outFormDetailsView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") OutFormDetails entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "id",
                    "product",
                    "outStorage",
                    "count"
            };

            OutFormDetails target;
            if (entity.getId() != null) {
                target = outFormDetailsService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            outFormDetailsService.save(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        outFormDetailsService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}