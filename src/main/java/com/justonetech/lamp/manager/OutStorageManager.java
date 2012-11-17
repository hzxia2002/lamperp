package com.justonetech.lamp.manager;

import com.justonetech.lamp.daoservice.*;
import com.justonetech.lamp.domain.*;
import com.justonetech.lamp.utils.Constants;
import com.justonetech.lamp.utils.OrderCheck;
import com.justonetech.system.manager.SequenceManager;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * Date: 12-10-28
 * Time: 下午10:10
 * To change this template use File | Settings | File Templates.
 */
@Service
public class OutStorageManager {
    @Autowired
    private ProductService productService;

    @Autowired
    private OutFormDetailsService outFormDetailsService;

    @Autowired
    private StockService stockService;

    @Autowired
    private MendFormService mendFormService;

    @Autowired
    private OutStorageService outStorageService;

    @Autowired
    private SequenceManager sequenceManager;


    /**
     *
     * @param outStorage
     * @return
     */
    public OrderCheck checkAndSave(OutStorage outStorage,String mendFormIds){
        if(outStorage.getOutNo()==null){
            outStorage.setOutNo(sequenceManager.getNextNo("OUT"));
        }

        OrderCheck orderCheck = new OrderCheck();
        Map countMap = new HashMap();
        StringBuffer ids = new StringBuffer();

        Set<Product> products = new HashSet<Product>();

        String mendFormHql = "from OutFormDetails o left join fetch o.product left join fetch o.mendForm where o.mendForm.id in(" + mendFormIds+")";
        List<OutFormDetails> outFormDetailses = outFormDetailsService.find(mendFormHql);

        //添加产品明细
        for (OutFormDetails outFormDetailse : outFormDetailses) {
            Product product = outFormDetailse.getProduct();
            Long id = product.getId();
            if(countMap.get(id)!=null){
                countMap.put(id, Long.valueOf(countMap.get(id).toString()) + outFormDetailse.getCount());
            }else{
                ids.append(id).append(",");
                countMap.put(id, outFormDetailse.getCount());
            }
            products.add(outFormDetailse.getProduct());
        }


        if(ids.length()>0){
            ids.deleteCharAt(ids.length()-1);
            String hql = "from Stock s left join fetch s.product where s.product.id in("+ids.toString()+") ";
            List<Stock> stocks = stockService.find(hql);

            for (Stock stock : stocks) {
                BigDecimal count = stock.getCount();
                Long id = stock.getProduct().getId();
                long leftCount =  Long.valueOf(count.toString())-Long.valueOf(countMap.get(id).toString());
                if(leftCount<0){
                    orderCheck.setEnough(false);
                    orderCheck.setMsg("编号为"+stock.getProduct().getCode()+"的产品库存不足");
                    return orderCheck;
                }
                products.remove(stock.getProduct());
            }

            if(products.size()>0){
                orderCheck.setEnough(false);
                String productCode = "";
                for (Product product : products) {
                    if(Long.valueOf(countMap.get(product.getId()).toString())>0){
                        productCode += product.getCode()+" ";
                    }
                }
                orderCheck.setEnough(false);
                orderCheck.setMsg("编号为"+productCode+"的产品库存不足");
                return orderCheck;
            }else {
                for (Stock stock : stocks) {
                    BigDecimal count = stock.getCount();
                    Long id = stock.getProduct().getId();
                    long leftCount =  Long.valueOf(count.toString()) - Long.valueOf(countMap.get(id).toString());
                    stock.setCount(new BigDecimal(leftCount));
                    stockService.save(stock);
                }

                //添加明细
                outStorageService.save(outStorage);
                for (OutFormDetails outFormDetailse : outFormDetailses) {
                    MendForm mendForm = outFormDetailse.getMendForm();
                    mendForm.setOutForm(outStorage);
                    mendFormService.save(mendForm);
                    mendForm.setStatus(Constants.MEND_PRODUCT_OUT);
                }

            }
        }


        return orderCheck;
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

    public void delete(Long outStorageId) {
        OutStorage outStorage = outStorageService.get(outStorageId);
        String detailHql = "from OutFormDetails d left join fetch d.product left join fetch d.mendForm where d.mendForm.outForm.id= " + outStorageId;
        List<OutFormDetails> outFormDetailses = outFormDetailsService.find(detailHql);

        StringBuffer ids = new StringBuffer();
        Map countMap = new HashMap();
        for (OutFormDetails outFormDetail : outFormDetailses) {
            Long id = outFormDetail.getProduct().getId();
            if(countMap.get(id)!=null){
                countMap.put(id, Long.valueOf(countMap.get(id).toString()) + outFormDetail.getCount());
            }else{
                ids.append(id).append(",");
                countMap.put(id, outFormDetail.getCount());
            }

            MendForm mendForm = outFormDetail.getMendForm();
            mendForm.setOutForm(null);
            mendFormService.save(mendForm);
            mendForm.setStatus(Constants.MEND_RECORD);
            outFormDetailsService.delete(outFormDetail);
        }

        if(ids.length()>0){
            ids.deleteCharAt(ids.length()-1);
            String hql = "from Stock s left join fetch s.product where s.product.id in("+ids.toString()+") ";
            List<Stock> stocks = stockService.find(hql);

            for (Stock stock : stocks) {
                BigDecimal count = stock.getCount();
                Long id = stock.getProduct().getId();
                long leftCount =  Long.valueOf(count.toString())+Long.valueOf(countMap.get(id).toString());
                stock.setCount(new BigDecimal(leftCount));

                stockService.save(stock);
            }

        }
        outStorageService.delete(outStorage);
    }

    public void deleteDetail(Long id) {
        outFormDetailsService.delete(id);
    }
}
