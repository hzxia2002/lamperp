package com.justonetech.system.manager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

/**
 */
@Service
public class SequenceManager {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Long updateNextId(String code) {
        Calendar instance = Calendar.getInstance();
        String year = String.valueOf(instance.get(Calendar.YEAR));
        String month = String.valueOf(instance.get(Calendar.MONTH + 1));
        String day = String.valueOf(instance.get(Calendar.DAY_OF_MONTH));

        Long seq = 1L;
        List list =jdbcTemplate.queryForList("select flowId from ID_SEQUENCE where code = ? and year =? and month=?  and day=?", code, year, month, day);
        if(list.size()>0){
            Map map = (Map)list.get(0);
            seq = Long.valueOf(map.get("FLOWID").toString())+1L;
            jdbcTemplate.update("update ID_SEQUENCE set flowid=? where code=? and  year =? and month=?  and day=?",seq,code,year,month,day);
        }else{
            jdbcTemplate.update("insert into ID_SEQUENCE (code,year,month,day,flowid) values (?,?,?,?,?)", code, year, month, day, seq);
        }
        return seq;
    }

    public String getNextNo(String code){
        return code + getNoWithoutCode(code);
    }

    public String getNoWithoutCode(String code){
        Calendar instance = Calendar.getInstance();
        String year = String.valueOf(instance.get(Calendar.YEAR));
        String month = String.valueOf(instance.get(Calendar.MONTH )+ 1);
        String day = String.valueOf(instance.get(Calendar.DAY_OF_MONTH));

        return year+((month.length()==1)?("0"+month):month)+((day.length()==1)?("0"+day):day)+ String.format("%03d", updateNextId(code));
    }

}
