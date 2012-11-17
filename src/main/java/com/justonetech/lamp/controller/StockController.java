package com.justonetech.lamp.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.lamp.daoservice.StockService;
import com.justonetech.lamp.domain.Stock;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class StockController extends BaseCRUDActionController<Stock> {
    private static Log log = LogFactory.getLog(StockController.class);

    @Autowired
	private StockService stockService;



	@RequestMapping
    @ResponseBody
	public Page<Stock> grid(Page page, String condition) {
		try {
            page.setAutoCount(true);

            String hql = "from Stock t where 1=1 ";

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = stockService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String init(Model model, Stock entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = stockService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sto/stockEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        Stock stock = stockService.get(id);

        model.addAttribute("bean", stock);
        return "view/sto/stockView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") Stock entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "id",
                    "product",
                    "count",
                    "warehouse"
            };

            Stock target;
            if (entity.getId() != null) {
                target = stockService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            stockService.save(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        stockService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }

    @RequestMapping
    public void exportData(HttpServletResponse response,HttpServletRequest request,String condition) throws IOException {
        String hql = "from Stock t left join fetch t.product where 1=1 ";

        QueryTranslate queryTranslate = new QueryTranslate(hql, condition);
        List<Stock> stocks = stockService.find(queryTranslate.toString());
        System.out.println("stocks = " + stocks.size());
        response.reset();
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-Disposition", "attachment;filename=" +new String("库存.xls".getBytes("GB2312"),"ISO-8859-1"));

        OutputStream outp = null;
        try {
            outp = response.getOutputStream();
            XLSTransformer transformer = new XLSTransformer();
            String realPath = request.getSession(true).getServletContext().getRealPath("");
            HashMap hashMap = new HashMap();
            hashMap.put("stocks",stocks);
            Workbook workbook = transformer.transformXLS(new FileInputStream(realPath+File.separator+"template"+File.separator+"stock.xls"), hashMap);
            workbook.write(outp);
        }
        catch (Exception e) {
            System.err.println("下载文件在服务器中不存在,程序终止！");
            //e.printStackTrace();
        }
        finally {
            if (outp != null) {
                outp.close();
            }
        }
    }
}