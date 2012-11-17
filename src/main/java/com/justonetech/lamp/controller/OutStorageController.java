package com.justonetech.lamp.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.lamp.daoservice.MendFormService;
import com.justonetech.lamp.daoservice.OutFormDetailsService;
import com.justonetech.lamp.daoservice.OutStorageService;
import com.justonetech.lamp.daoservice.ProductService;
import com.justonetech.lamp.domain.MendForm;
import com.justonetech.lamp.domain.OutFormDetails;
import com.justonetech.lamp.domain.OutStorage;
import com.justonetech.lamp.domain.Product;
import com.justonetech.lamp.manager.OutStorageManager;
import com.justonetech.lamp.utils.Constants;
import com.justonetech.lamp.utils.OrderCheck;
import com.justonetech.system.tree.Node;
import com.justonetech.system.tree.TreeBranch;
import com.justonetech.system.tree.ZTreeNode;
import net.sf.json.JSONObject;
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
import java.util.*;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class OutStorageController extends BaseCRUDActionController<OutStorage> {
    private static Log log = LogFactory.getLog(OutStorageController.class);

    @Autowired
    private OutStorageService outStorageService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OutFormDetailsService outFormDetailsService;

    @Autowired
    private MendFormService mendFormService;

    @Autowired
    private OutStorageManager outStorageManager;



    @RequestMapping
    @ResponseBody
    public Page<OutStorage> grid(Page page, String condition) {
        try {
            page.setAutoCount(true);

            String hql = "from OutStorage t where 1=1 " ;

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = outStorageService.findByPage(page, queryTranslate.toString());
        } catch (Exception e) {
            log.error("error", e);
        }

        return page;
    }

    @RequestMapping
    public String init(Model model, OutStorage entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = outStorageService.get(entity.getId());
            }
            JSONObject jsonObject = new JSONObject();
            if(entity.getId()!=null){
                String detailHql = "from OutFormDetails d left join fetch d.product where d.outStorage.id= "+entity.getId();
                List<OutFormDetails> outFormDetailses = outFormDetailsService.find(detailHql);
                for (OutFormDetails outFormDetail : outFormDetailses) {
                    Long id = outFormDetail.getProduct().getId();
                    jsonObject.put(id,outFormDetail.getCount());
                }
            }
            model.addAttribute("products", jsonObject.toString());
            model.addAttribute("bean", entity);

        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/out/outStorageEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        OutStorage outStorage = outStorageService.get(id);
        
        String hql = "from MendForm where outForm.id = " + id;
        List<MendForm> mendForms = mendFormService.find(hql);
        String mendFormIds = "";
        for (int i = 0, mendFormsSize = mendForms.size(); i < mendFormsSize; i++) {
            MendForm mendForm = mendForms.get(i);
            if(i==0){
                mendFormIds = mendForm.getId().toString();
            }else{
                mendFormIds += "," + mendForm.getId();
            }
        }
        model.addAttribute("bean", outStorage);

        model.addAttribute("mendFormIds", mendFormIds);
        model.addAttribute("mendForms", mendForms);
        return "view/out/outStorageView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") OutStorage entity,String mendFormIds)
            throws Exception {
        OrderCheck orderCheck = null;
        try {
            String[] columns = new String[]{
                    "id",
//                    "mendFormIds",
                    "drawer",
                    "hander",
                    "outDate"
            };

            OutStorage target;
            if (entity.getId() != null) {
                target = outStorageService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            orderCheck = outStorageManager.checkAndSave(target,mendFormIds);

        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response,  (orderCheck!=null&&orderCheck.isEnough())?"保存成功":orderCheck.getMsg());
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {

        outStorageManager.delete(id);
        sendSuccessJSON(response, "删除成功");
    }

    @RequestMapping
    public void deleteDetail(HttpServletResponse response, Long id) throws Exception {

        outStorageManager.deleteDetail(id);
        sendSuccessJSON(response, "删除成功");
    }

    @RequestMapping
    public void saveDetails(HttpServletResponse response, Long productId,Long mendFormId,Long count) throws Exception {

        Product product = productService.get(productId);
        MendForm mendForm = mendFormService.get(mendFormId);
        OutFormDetails outFormDetails = new OutFormDetails();
        List<OutFormDetails> outFormDetailses = outFormDetailsService.find("from OutFormDetails where mendForm.id=" + mendFormId + " and product.id=" + productId);
        if(outFormDetailses.size()>0){
            outFormDetails = outFormDetailses.get(0);
        }
        outFormDetails.setCount(count);
        outFormDetails.setMendForm(mendForm);
        outFormDetails.setProduct(product);
        outFormDetailsService.save(outFormDetails);
        sendSuccessJSON(response, "添加成功");
    }

    /**
     * 取得树数据
     *
     *            节点类型
     *            节点ID
     * @throws Exception
     *             异常
     */
    @RequestMapping
    @ResponseBody
    public List<Node> productTree() throws Exception {
        TreeBranch treeBranch = new TreeBranch();

        String hql = "from Product";

        List<Product> products = productService.findByQuery(hql);

        for (Product product : products) {
            ZTreeNode treeNode = new ZTreeNode();
            treeNode.setId(product.getClass().getSimpleName() + "_" + product.getId());

            treeNode.setIsLeaf(true);

            treeNode.setName(product.getCode() + "(" + product.getName() + ")");
            treeNode.setText(product.getCode() + "(" + product.getName() + ")");
            treeNode.setUid(product.getId().toString());
            treeNode.setType(product.getClass().getSimpleName());
            treeBranch.addTreeNode(treeNode);
        }

        return treeBranch.getTreeNodeList();
    }

    @RequestMapping
    @ResponseBody
    public List<Node> mendFormTree() throws Exception {
        TreeBranch treeBranch = new TreeBranch();

        String hql = "from MendForm m left join fetch m.firm where m.status="+ Constants.MEND_RECORD;

        List<MendForm> mendForms = mendFormService.findByQuery(hql);

        for (MendForm mendForm : mendForms) {
            ZTreeNode treeNode = new ZTreeNode();
            treeNode.setId(mendForm.getClass().getSimpleName() + "_" + mendForm.getId());

            treeNode.setIsLeaf(true);

            treeNode.setName(mendForm.getMendNo() + "(" + mendForm.getFirm().getName() + ")");
            treeNode.setUid(mendForm.getId().toString());
            treeNode.setType(mendForm.getId() + "_" + mendForm.getMendNo() + "_" + mendForm.getFirm().getName());
            treeBranch.addTreeNode(treeNode);
        }

        return treeBranch.getTreeNodeList();
    }


//    mendForm

    @RequestMapping
    @ResponseBody
    public HashMap getProducts(Page page, Long mendFormId,String mendFormIds,Boolean showAll){
        HashMap hashMap = new HashMap();
        ArrayList<Map> productsList = new ArrayList<Map>();
        hashMap.put("rows",productsList);
        try {
            page.setAutoCount(true);

            //添加单个零件
            String hql;
            if(StringUtils.isNotEmpty(mendFormIds)&&showAll!=null&&showAll){
                hql = "from OutFormDetails o left join fetch o.product where o.mendForm.id in(" + mendFormIds+")";
            }else if(mendFormId!=null){
                hql = "from OutFormDetails o left join fetch o.product where o.mendForm.id = " + mendFormId;
            }else{
                return hashMap;
            }
            List<OutFormDetails> outFormDetailses = outFormDetailsService.find(hql);
            HashMap productMap = new HashMap();
            for (OutFormDetails outFormDetails : outFormDetailses) {
                Map<String, Object> map = new HashMap<String, Object>();
                Object obj = productMap.get(outFormDetails.getProduct().getId().toString());
                if(productMap.get(outFormDetails.getProduct().getId().toString())!=null){
                    //产品数量汇总
                    map = (Map) obj;
                    long count = Long.valueOf(map.get("count").toString()) + outFormDetails.getCount();
                    map.put("count",count);
                }else{
                    productMap.put(outFormDetails.getProduct().getId().toString(),map);

                    map.put("productName",outFormDetails.getProduct().getName()) ;
                    map.put("code",outFormDetails.getProduct().getCode()) ;
                    map.put("id",outFormDetails.getId()) ;
                    map.put("count", outFormDetails.getCount()) ;

                    productsList.add(map);
                }
                if(showAll){
                    //不显示操作
                    map.put("status","1");
                }

            }

        } catch (Exception e) {
            log.error("error", e);
        }

        return hashMap;
    }

    public List<Product>  getProducts(JSONObject productMap) {
        Set<String> set = productMap.keySet();
        String productIds = "";
        for (String key : set) {
            productIds += key +",";
        }
        if(productIds.length()>0){
            productIds = productIds.substring(0,productIds.length()-1);
        }
        List<Product> productList = new ArrayList<Product>();
        if(StringUtils.isNotEmpty(productIds)){
            String perHql = "from Product where id in("+productIds+")";
            productList = productService.find(perHql);
        }
        return productList;
    }
}