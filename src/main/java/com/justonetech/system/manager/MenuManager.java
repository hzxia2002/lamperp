package com.justonetech.system.manager;

import com.justonetech.system.menu.AttributeValueConveter;
import com.justonetech.system.menu.LiTag;
import com.justonetech.system.menu.Menu;
import com.justonetech.system.menu.UlTag;
import com.thoughtworks.xstream.XStream;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: tcg
 * Date: 2011-11-6
 * Time: 13:21:14
 * To change this template use File | Settings | File Templates.
 */
public class MenuManager {
    public static String MENUTAG = "menu";
    public static String ULLIST = "ulList";
    public static String LITAG = "li";
    public static String ULTAG = "ul";
    public static String LILIST = "liList";

    private XStream xStream;
    private List<UlTag> ulTagList ;
    private UlTag selectUlTag;
    private String ulStr;
    private String filePath;

    public MenuManager() {
        xStream = new XStream();
        xStream.addImplicitCollection(UlTag.class,MenuManager.LILIST);
        xStream.addImplicitCollection(Menu.class,MenuManager.ULLIST);
        xStream.alias(MenuManager.ULTAG, UlTag.class);
        xStream.alias(MenuManager.LITAG, LiTag.class);
        xStream.alias(MenuManager.MENUTAG, Menu.class);
        xStream.aliasAttribute(LiTag.class,"id","id");
        xStream.aliasAttribute(UlTag.class,"id","id");
        xStream.aliasAttribute(UlTag.class,"text","text");
        xStream.registerConverter(new AttributeValueConveter(xStream.getMapper()));
    }

    public void  parse(String xml){
        Menu menu =(Menu) xStream.fromXML(xml);
        ulTagList = menu.getUlList();
    }

    public void  parse() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource rs = resolver.getResource(getFilePath());
        Menu menu =(Menu) xStream.fromXML( new FileInputStream(rs.getFile()));
        ulTagList = menu.getUlList();
    }

    /**
     * 根据指定的id,生成子菜单
     * @param id
     */
    public void generateChildMenu(String id){
        for (UlTag ulTag : ulTagList) {
            if(id.equals(ulTag.getId())){
                selectUlTag = ulTag;
                ulStr = xStream.toXML(selectUlTag);
                break;
            }
        }
    }

    public String tag2String(UlTag ulTag){
        return xStream.toXML(ulTag);
    }

    public List<UlTag> getUlTagList() {
        return ulTagList;
    }

    public void setUlTagList(List<UlTag> ulTagList) {
        this.ulTagList = ulTagList;
    }

    public UlTag getSelectUlTag(String id) {
        generateChildMenu(id);
        return selectUlTag;
    }

    public void setSelectUlTag(UlTag selectUlTag) {
        this.selectUlTag = selectUlTag;
    }

    public String getUlStr(String id) {
        generateChildMenu(id);
        return ulStr;
    }

    public void setUlStr(String ulStr) {
        this.ulStr = ulStr;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFilePath() {
        return filePath;
    }
}
