package com.justonetech.lamp.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Condition;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.lamp.manager.MendFormManager;
import com.justonetech.lamp.daoservice.MendFormService;
import com.justonetech.lamp.domain.MendForm;
import com.justonetech.lamp.utils.Constants;
import com.justonetech.system.daoservice.SysCodeService;
import com.justonetech.system.daoservice.SysDeptService;
import com.justonetech.system.domain.SysCode;
import com.justonetech.system.domain.SysDept;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.commons.lang.StringUtils;
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
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class MendFormController extends BaseCRUDActionController<MendForm> {
    private static Log log = LogFactory.getLog(MendFormController.class);

    @Autowired
    private MendFormService mendFormService;

    @Autowired
    private MendFormManager mendFormManager;

    @Autowired
    private SysDeptService sysDeptService;

    @Autowired
    private SysCodeService sysCodeService;

    private String lessAndEq = "<=";
    private String moreAndEq = ">=";

    @RequestMapping
    @ResponseBody
    public Page<MendForm> grid(Page page, String condition) {
        try {
            page.setAutoCount(true);

            String hql = "from MendForm t where 1=1 order by id desc" ;

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = mendFormService.findByPage(page, queryTranslate.toString());
            List <MendForm>rows = page.getRows();
            for (MendForm row : rows) {
                row.setStatusName(Constants.mendStatus.get(row.getStatus()).toString());
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return page;
    }

    @RequestMapping
    public String init(Model model, MendForm entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = mendFormService.get(entity.getId());
            }else {
                entity.setRecordTime(new Timestamp(System.currentTimeMillis()));
            }
            model.addAttribute("bean", entity);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/men/mendFormEdit";
    }

    @RequestMapping
    public String check(Model model, MendForm entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = mendFormService.get(entity.getId());
            }
            model.addAttribute("bean", entity);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/men/mendFormCheck";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        MendForm mendForm = mendFormService.get(id);

        model.addAttribute("bean", mendForm);
        return "view/men/mendFormView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") MendForm entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "id",
                    "recordTime",
                    "firm",
                    "storeNo",
                    "storeName",
                    "area",
                    "troubleCaller",
                    "breakdownCount",
                    "description",
                    "isGuarantee",
                    "problemTypeOne",
                    "problemTypeSecond",
                    "isCurshopGuarant",
                    "mendRank",
                    "mendDueLimit"
//                    "material",
//                    "mendDate",
//                    "trafficFee",
//                    "materialFee",
//                    "lodgeFee",
//                    "lampFee",
//                    "storeFee",
//                    "total",
//                    "mender"
            };

            MendForm target;
            if (entity.getId() != null) {
                target = mendFormService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
                target.setStatus(Constants.MEND_RECORD);
            }
            mendFormManager.saveMendForm(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }

    @RequestMapping
    public void exportData(HttpServletResponse response,HttpServletRequest request,String condition) throws IOException {
        String hql = "from MendForm t where 1=1 ";

        QueryTranslate queryTranslate = new QueryTranslate(hql, condition);
        
        List<Condition> conditions = queryTranslate.getConditions();
        List<MendForm> mendForms = mendFormService.find(queryTranslate.toString());
        response.reset();
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-Disposition", "attachment;filename=" +new String("维修报销单.xls".getBytes("GB2312"),"ISO-8859-1"));

        
        OutputStream outp = null;
        try {
            outp = response.getOutputStream();
            XLSTransformer transformer = new XLSTransformer();
            String realPath = request.getSession(true).getServletContext().getRealPath("");
            HashMap hashMap = new HashMap();
            hashMap.put("mendForms",mendForms);

            for (Condition con : conditions) {
                if("mender".equals(con.getPropertyName())){
                    hashMap.put("mender",con.getFirstValue());
                }else if("mendDate".equals(con.getPropertyName())&&moreAndEq.equals(con.getOperator())){
                    hashMap.put("startDate",con.getFirstValue());
                }else if("mendDate".equals(con.getPropertyName())&&lessAndEq.equals(con.getOperator())){
                    hashMap.put("endDate", StringUtils.isEmpty(con.getFirstValue())?new Date(System.currentTimeMillis()).toString():con.getFirstValue());
                }
            }
            Workbook workbook = transformer.transformXLS(new FileInputStream(realPath+ File.separator+"template"+File.separator+"mendform.xls"), hashMap);
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

    @RequestMapping
    public void doCheck(HttpServletResponse response, Model model, @ModelAttribute("bean") MendForm entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "material",
                    "mendDate",
                    "trafficFee",
                    "materialFee",
                    "lodgeFee",
                    "lampFee",
                    "storeFee",
                    "otherFee",
                    "materialTransFee",
                    "inTrafficFee",
                    "total",
                    "mender"
            };

            MendForm target;
            if (entity.getId() != null) {
                target = mendFormService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }
            target.setStatus(Constants.MEND_OVER);
            mendFormManager.saveMendForm(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }
    /**
     * 取得代码详细列表信息
     *
     * @return
     */
    @RequestMapping
    @ResponseBody
    public List<SysDept> getDepts() {
        try {
            return sysDeptService.find("from SysDept");
        } catch (Exception e) {
            log.error("error", e);

            return new ArrayList<SysDept>();
        }
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        mendFormService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}