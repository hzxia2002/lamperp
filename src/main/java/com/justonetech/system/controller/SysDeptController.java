package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.export.excel.ExcelExporter;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.system.daoservice.SysDeptService;
import com.justonetech.system.domain.SysDept;
import com.justonetech.system.tree.Node;
import com.justonetech.system.tree.TreeBranch;
import com.justonetech.system.tree.ZTreeNode;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysDeptController extends BaseCRUDActionController<SysDept> {
    private static String [] companyTypeStr = {"管理公司","客户","翻译人员团体"};
    private static String [] companyType = {"0","1","2"};
    @Autowired
	private SysDeptService sysDeptService;


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
            treeNode.setName("单位部门树");
            treeNode.setText("单位部门树");
            treeNode.setUid("root");
            treeBranch.addTreeNode(treeNode);
        } else {
            String hql = "from SysDept where parent.id is null order by treeId";

            if (!StringUtils.equals(uid, "root")) {
                hql = "from SysDept where parent.id = " + uid + " order by treeId";
            }

            List<SysDept> sysDepts = sysDeptService.findByQuery(hql);

            for (SysDept sysDept : sysDepts) {
                ZTreeNode treeNode = new ZTreeNode();
                treeNode.setId(sysDept.getClass().getSimpleName() + "_" + sysDept.getId());
                if(sysDept.getIsLeaf() != null && !sysDept.getIsLeaf()){
                    treeNode.setIsParent(true);
                    treeNode.setOpen(false);
                }else{
                    treeNode.setIsLeaf(true);
                }
                treeNode.setName(sysDept.getName());
                treeNode.setText(sysDept.getName());
                treeNode.setUid(sysDept.getId().toString());
                treeNode.setType(sysDept.getClass().getSimpleName());
                treeNode.setTreeId(sysDept.getTreeId());
                treeBranch.addTreeNode(treeNode);
            }
        }

        return treeBranch.getTreeNodeList();
	}

	@RequestMapping
    @ResponseBody
	public Page<SysDept> grid(Page page, String condition, HttpServletRequest request) {
		try {
            page.setAutoCount(true);

            String hql = "from SysDept t where 1=1 " + page.getOrderByString("t.treeId asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysDeptService.findByPage(page, queryTranslate.toString());
		} catch (Exception e) {
            log.error("error", e);
		}

        return page;
	}

    @RequestMapping
    public String exportExcel(Page page, String condition, String colModel,
                                     Model model) {
        try {
            String hql = "from SysDept t where 1=1 " + page.getOrderByString("t.treeId asc");
            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            String filePath = "D://temp";
            String fileName = "test.xls";

            String filename = ExcelExporter.export(
                    colModel,
                    sysDeptService,filePath, fileName,
                    queryTranslate.toString());


            model.addAttribute("filePath", filePath);
            model.addAttribute("fileName", fileName);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "common/dataExport";
    }

    @RequestMapping
    public String init(Model model, SysDept entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = sysDeptService.get(entity.getId());

                LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
                for (int i=0;i<companyTypeStr.length;i++) {
                    map.put(companyType[i],companyTypeStr[i]);
                }
                model.addAttribute("bean", entity);
                model.addAttribute("companyTypeItems", map);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysDeptEdit";
    }

    @RequestMapping
    public String initAdd(Model model, SysDept entity) throws Exception {
        try {
            if(entity == null) {
                entity = new SysDept();
            }
            LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
            for (int i=0;i<companyTypeStr.length;i++) {
                 map.put(companyType[i],companyTypeStr[i]);
            }
            model.addAttribute("bean", entity);
            model.addAttribute("companyTypeItems", map);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysDeptEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysDept sysDept = sysDeptService.get(id);

        model.addAttribute("bean", sysDept);
        return "view/sys/sysDeptView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") SysDept entity)
            throws Exception {
        try {
            String[] columns = new String[]{
                    "code",
                    "name",
                    "shortName",
                    "cardNo",
                    "cityCode",
                    "cityName",
                    "provinceCode",
                    "provinceName",
                    "address",
                    "orderNo",
                    "isValid",
                    "type",
                    "linker",
                    "email",
                    "telephone",
                    "fax",
                    "netSite",
                    "memo"
            };

            SysDept target;
            if (entity.getId() != null) {
                target = sysDeptService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            sysDeptService.save(target);
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }

        sendSuccessJSON(response, "保存成功");
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysDeptService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}