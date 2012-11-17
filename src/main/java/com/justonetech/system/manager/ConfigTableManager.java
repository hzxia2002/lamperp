package com.justonetech.system.manager;

import com.justonetech.core.orm.log.ITableConfigService;
import com.justonetech.core.orm.log.TableLogConfig;
import com.justonetech.system.daoservice.ConfigTableService;
import com.justonetech.system.domain.ConfigTable;
import com.justonetech.system.menu.AttributeValueConveter;
import com.justonetech.system.menu.LiTag;
import com.justonetech.system.menu.Menu;
import com.justonetech.system.menu.UlTag;
import com.thoughtworks.xstream.XStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: tcg
 * Date: 2011-11-6
 * Time: 13:21:14
 */
@Service
public class ConfigTableManager implements ITableConfigService {
    @Autowired
    private ConfigTableService configTableService;

    /**
     * 通过类名获取表日志配置信息
     *
     * @param className
     * @return
     */
    public ConfigTable getByClassName(String className) {
        String hql = "from ConfigTable t where className ='" + className + "' ";

        List<ConfigTable> list = configTableService.find(hql);

        if(list != null) {
            return list.get(0);
        }

        return null;
    }

    /**
     * 通过表名获取表日志配置信息
     *
     * @param tableName
     * @return
     */
    public ConfigTable getByTableName(String tableName) {
        String hql = "from ConfigTable t where tableName ='" + tableName + "' ";

        List<ConfigTable> list = configTableService.find(hql);

        if(list != null) {
            return list.get(0);
        }

        return null;
    }

    @Override
    public Map<String, TableLogConfig> getAllConfig() {
        Map<String, TableLogConfig> map = new HashMap<String, TableLogConfig>();

        String hql = "from ConfigTable t where isLog = '1' order by tableName asc";

        List<ConfigTable> list = configTableService.find(hql);

        for(ConfigTable tmp : list) {
            map.put(tmp.getClassName(), tmp);
        }

        return map;
    }
}
