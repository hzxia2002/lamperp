package com.justonetech.lamp.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.lamp.daoservice.InStorageService;
import com.justonetech.lamp.daoservice.StockService;
import com.justonetech.lamp.domain.InStorage;
import com.justonetech.lamp.manager.InStorageManager;
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
public class InStorageController extends BaseCRUDActionController<InStorage> {
    private static Log log = LogFactory.getLog(InStorageController.class);

    @Autowired
	private InStorageService inStorageService;

    @Autowired
    private InStorageManager inStorageManager;



	@RequestMapping
    @ResponseBody
	public Page<InStorage> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from InStorage t where 1=1 " ;

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = inStorageService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, InStorage entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = inStorageService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/inS/inStorageEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        InStorage inStorage = inStorageService.get(id);

        model.addAttribute("bean", inStorage);
        return "view/inS/inStorageView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") InStorage entity,Long originCount)
            throws Exception {
        String msg = "保存成功";
        try {
            String[] columns = new String[]{
                    "id",
                    "product",
                    "count",
                    "price",
                    "code",
                    "description"
            };

            InStorage target;
            if (entity.getId() != null) {
                target = inStorageService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }
            msg = inStorageManager.saveInStorage(target,originCount);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, msg);
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        InStorage inStorage = inStorageService.get(id);
        String msg =  inStorageManager.delete(inStorage);

        sendSuccessJSON(response, msg);
    }
}