package in.xiandan.magnetw.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import in.xiandan.magnetw.config.ApplicationConfig;

/**
 * author  dengyuhan
 * created 2019/7/22 11:42
 */
@Service
public class FilterService {
    private Logger logger = Logger.getLogger(getClass());

    @Autowired
    ApplicationConfig config;

    private List<String> mFilterList;

    private Properties properties;
    private boolean completed = true;

    @PostConstruct
    public void init() {
        if (!config.resultFilterEnabled) {
            return;
        }
        mFilterList = new ArrayList<String>();
        File filterFile = getFilterPropertiesFile();
        try {
            properties = PropertiesLoaderUtils.loadProperties(new FileSystemResource(filterFile));
            Collection<Object> values = properties.values();
            for (Object value : values) {
                mFilterList.add((String) value);
            }
        } catch (IOException e) {
            properties = new Properties();
            try {
                String run = "chmod 777 " + filterFile.getAbsolutePath();
                logger.info(String.format("赋予文件权限--->%s", run));
                Runtime.getRuntime().exec(run);
            } catch (IOException e1) {
                logger.error("赋予文件权限失败", e1);
            }
        }
        logger.info(String.format("过滤词文件 %s--->%s--->加载%d个过滤词", filterFile.getAbsolutePath(), String.valueOf(filterFile.exists()), mFilterList.size()));
    }

    public boolean add(String input) throws Exception {
        if (!completed) {
            return false;
        }
        if (mFilterList.contains(input)) {
            return true;
        }
        completed = false;
        try {
            mFilterList.add(input);
            properties.setProperty(String.valueOf(System.currentTimeMillis()), input);
            properties.store(new FileOutputStream(getFilterPropertiesFile()), null);
            completed = true;
            logger.info(String.format("屏蔽词添加成功--->%s--->当前%d个屏蔽词", input, mFilterList.size()));
            return true;
        } catch (Exception e) {
            completed = true;
            logger.error("屏蔽词添加失败", e);
            throw e;
        }
    }

    public boolean contains(String keyword) {
        return mFilterList.contains(keyword);
    }

    public List<String> getFilterList() {
        return mFilterList;
    }

    private File getFilterPropertiesFile() {
        return new File(config.getFilterPropertiesDir(), "filter.properties");
    }

}