package com.justonetech.lamp.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.lamp.daoservice.ProductService;
import com.justonetech.lamp.domain.Product;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
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
public class ProductController extends BaseCRUDActionController<Product> {
    private static Log log = LogFactory.getLog(ProductController.class);

    @Autowired
    private ProductService productService;



    @RequestMapping
    @ResponseBody
    public Page<Product> grid(Page page, String condition) {
        try {
            page.setAutoCount(true);

            String hql = "from Product t where 1=1 ";

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = productService.findByPage(page, queryTranslate.toString());
        } catch (Exception e) {
            log.error("error", e);
        }

        return page;
    }

    @RequestMapping
    public String init(Model model, Product entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = productService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/pro/productEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        Product product = productService.get(id);

        model.addAttribute("bean", product);
        return "view/pro/productView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") Product entity)
            throws Exception {
        String msg = "保存成功";
        try {
            String[] columns = new String[]{
//                    "id",
                    "name",
                    "code",
                    "attr1",
                    "attr2",
                    "attr3",
                    "attr4"
            };

            Product target;
            if (entity.getId() != null) {
                target = productService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            if(target.getId()==null&&productService.find("from Product where code='"+target.getCode()+"'").size()>0){
                msg = "该编码已存在";
            } else{
                productService.save(target);
            }
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, msg);
    }

    /**
     * 取得代码详细列表信息
     *
     * @return
     */
    @RequestMapping
    @ResponseBody
    public List<Product> getProductList() {
        try {
            return productService.find("from Product");
        } catch (Exception e) {
            log.error("error", e);

            return null;
        }
    }



    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        try {
            productService.delete(id);
            sendSuccessJSON(response, "删除成功");
        } catch (Exception e) {
            sendErrorJSON(response, "该记录已被其他记录引用，无法删除!");
        }
    }
}