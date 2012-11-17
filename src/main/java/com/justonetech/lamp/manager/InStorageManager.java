package com.justonetech.lamp.manager;

import com.justonetech.lamp.daoservice.InStorageService;
import com.justonetech.lamp.daoservice.StockService;
import com.justonetech.lamp.domain.InStorage;
import com.justonetech.lamp.domain.Product;
import com.justonetech.lamp.domain.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Date: 12-10-28
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
@Service
public class InStorageManager {
    @Autowired
    private InStorageService inStorageService;

    @Autowired
    private StockService stockService;

    public String saveInStorage(InStorage inStorage,Long originCount){
        String msg ="保存成功";
        Product product = inStorage.getProduct();
        String hql = "from Stock where product.id="+product.getId();
        List<Stock> stocks = stockService.find(hql);
        Stock  stock;
        if(stocks.size()>0){
            stock = stocks.get(0);
//            stock.setProduct(product);
            long val = Long.valueOf(inStorage.getCount().toString()) + Long.valueOf(stock.getCount().toString()) - (originCount==null?0:originCount);
            if(val<0){
                msg = "该产品已被使用,请重新调整数据";
            }else{
                stock.setCount(new BigDecimal(val));
            }
        }else{
            stock = new Stock();
            stock.setProduct(product);
            stock.setCount(new BigDecimal(Long.valueOf(inStorage.getCount().toString())));
        }
        inStorageService.save(inStorage);
        stockService.save(stock);
        return msg;
    }

    public String delete(InStorage inStorage) {
        String msg = "删除成功";
        String hql = "from Stock where product.id="+inStorage.getProduct().getId();
        List<Stock> stocks = stockService.find(hql);
        Stock  stock;
        if(stocks.size()>0){
            stock = stocks.get(0);
//            stock.setProduct(product);
            long val = Long.valueOf(stock.getCount().toString()) - Long.valueOf(inStorage.getCount().toString());
            if(val<0){
                msg = "该产品已被使用,请重新调整数据";
            }else{
                stock.setCount(new BigDecimal(val));
                inStorageService.delete(inStorage);
            }
        }
        return msg;
    }
}
