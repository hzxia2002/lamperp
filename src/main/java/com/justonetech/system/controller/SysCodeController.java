package com.justonetech.system.controller;

import com.justonetech.core.controller.BaseCRUDActionController;
import com.justonetech.core.orm.hibernate.Page;
import com.justonetech.core.orm.hibernate.QueryTranslate;
import com.justonetech.core.utils.ReflectionUtils;
import com.justonetech.system.daoservice.SysCodeService;
import com.justonetech.system.domain.SysCode;
import com.justonetech.system.domain.SysCodeDetail;
import com.justonetech.system.manager.SysCodeManager;
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

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * @version 1.0
 * @author: System
 */
@Controller
public class SysCodeController extends BaseCRUDActionController<SysCode> {
    @Autowired
    private SysCodeService sysCodeService;

    @Autowired
    private SysCodeManager sysCodeManager;

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
            treeNode.setName("系统代码树");
            treeNode.setText("系统代码树");
            treeNode.setUid("root");
            treeBranch.addTreeNode(treeNode);
        } else {
            String hql = "from SysCode where parent.id is null order by treeId";

            if (!StringUtils.equals(uid, "root")) {
                hql = "from SysCode where parent.id = " + uid + " order by treeId";
            }

            List<SysCode> sysCodes = sysCodeService.findByQuery(hql);

            for (SysCode sysCode : sysCodes) {
                ZTreeNode treeNode = new ZTreeNode();
                treeNode.setId(sysCode.getClass().getSimpleName() + "_" + sysCode.getId());
                if(sysCode.getIsLeaf() != null && !sysCode.getIsLeaf()){
                    treeNode.setIsParent(true);
                    treeNode.setOpen(false);
                }else{
                    treeNode.setIsLeaf(true);
                }
                treeNode.setName(sysCode.getName());
                treeNode.setText(sysCode.getName());
                treeNode.setUid(sysCode.getId().toString());
                treeNode.setType(sysCode.getClass().getSimpleName());
                treeNode.setTreeId(sysCode.getTreeId());
                treeBranch.addTreeNode(treeNode);
            }
        }

        return treeBranch.getTreeNodeList();
    }

    /**
     * 取得代码详细列表信息
     *
     * @param code
     * @return
     */
    @RequestMapping
    @ResponseBody
    public List<SysCodeDetail> getCodeDetailList(String code) {
        try {
            return sysCodeManager.getCodeDetailListByCode(code);
        } catch (Exception e) {
            log.error("error", e);

            return null;
        }
    }


    @RequestMapping
    public String getCodeDetailListById(Model model,Long parentId,Long id) {
        try {
            if(parentId!=null){
                model.addAttribute("codeList",sysCodeManager.getCodeDetailListById(parentId));
                model.addAttribute("id",id);
            }

        } catch (Exception e) {
            log.error("error", e);
        }
        return "view/common/codeList";
    }
    /**
     * 取得代码详细列表信息
     *
     * @param code
     * @return
     */
    @RequestMapping
    public String getCodeList(Model model,String code,String id) {
        try {
            model.addAttribute("codeList",sysCodeManager.getCodeListByCode(code));
            model.addAttribute("id", StringUtils.isNotEmpty(id)?id:null);
        } catch (Exception e) {
            log.error("error", e);
        }
        return "view/common/codeList";
    }

    @RequestMapping
    @ResponseBody
    public Page<SysCode> grid(Page page, String condition) {
        try {
            page.setAutoCount(true);

            String hql = "from SysCode t where 1=1 " + page.getOrderByString("t.treeId asc");

            QueryTranslate queryTranslate = new QueryTranslate(hql, condition);

            // 查询
            page = sysCodeService.findByPage(page, queryTranslate.toString());
        } catch (Exception e) {
            log.error("error", e);
        }

        return page;
    }

    @RequestMapping
    public String initAdd(Model model, SysCode entity) throws Exception {
        try {
            if(entity == null) {
                entity = new SysCode();
            }

            model.addAttribute("bean", entity);
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysCodeEdit";
    }

    @RequestMapping
    public String init(Model model, SysCode entity) throws Exception {
        try {
            if(entity != null && entity.getId() != null) {
                entity = sysCodeService.get(entity.getId());

                model.addAttribute("bean", entity);
            }
        } catch (Exception e) {
            log.error("error", e);
        }

        return "view/sys/sysCodeEdit";
    }

    @RequestMapping
    public String view(Model model, Long id) {
        SysCode sysCode = sysCodeService.get(id);

        model.addAttribute("bean", sysCode);
        return "view/sys/sysCodeView";
    }

    @RequestMapping
    public void save(HttpServletResponse response, Model model, @ModelAttribute("bean") SysCode entity)
            throws Exception {
        try {
            String[] columns = new String[]{
//                    "id",
//                    "parent",
                    "code",
                    "name",
                    "isReserved",
//                    "isLeaf",
//                    "treeId",
                    "description"
            };

            SysCode target;
            if (entity.getId() != null) {
                target = sysCodeService.get(entity.getId());

                ReflectionUtils.copyBean(entity, target, columns);
            } else {
                target = entity;
            }

            sysCodeService.save(target);
            sendSuccessJSON(response, "保存成功");
        } catch (Exception e) {
            log.error("error", e);
            super.processException(response, e);
        }
    }

    @RequestMapping
    public void delete(HttpServletResponse response, Long id) throws Exception {
        sysCodeService.delete(id);

        sendSuccessJSON(response, "删除成功");
    }
}