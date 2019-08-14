package in.xiandan.magnetw.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sqlite.SQLiteErrorCode;
import org.sqlite.SQLiteException;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import in.xiandan.magnetw.config.ApplicationConfig;
import in.xiandan.magnetw.response.ReportItem;

/**
 * 资源举报
 */
@Service
public class ReportService {
    private Logger logger = Logger.getLogger(getClass());

    @Autowired
    ApplicationConfig config;

    private List<String> mKeywords = new ArrayList<String>();
    private List<String> mUrls = new ArrayList<String>();

    private boolean completed = true;

    private Statement statement;
    private Connection connection;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @PostConstruct
    public void init() {
        if (!config.reportEnabled) {
            return;
        }
        try {
            Class.forName("org.sqlite.JDBC");
            File dbFile = new File(config.getExternalDataDir(), "report.db");
            connection = DriverManager.getConnection("jdbc:sqlite:" + dbFile.getAbsolutePath());
            statement = connection.createStatement();
            statement.setQueryTimeout(10);  // set timeout to 10 sec.

            //如果不存在就创建表
            statement.executeUpdate("create table if not exists report (id integer primary key, name string, value string not null unique, created_time timestamp not null default current_timestamp)");

            reload();
        } catch (Exception e) {
            logger.error("SQLite初始化失败", e);
        }
    }

    public void reload() throws SQLException {
        //初始化集合缓存
        mKeywords = queryReportTable("select value from report where value not like 'magnet%'", String.class);
        mUrls = queryReportTable("select value from report where value like 'magnet%'", String.class);
        logger.info(String.format("举报列表初始化成功，关键词%d条，磁力链%d条", mKeywords.size(), mUrls.size()));
    }

    /**
     * @param name  名称(可选)
     * @param value 关键词或磁力链
     * @return
     * @throws Exception
     */
    public void put(String name, String value) throws Exception {
        try {
            if (!completed) {
                throw new Exception("系统繁忙，请稍候再试");
            }
            //如果是占位符
            if (value.toLowerCase().equals(config.searchPlaceholder.toLowerCase())) {
                throw new Exception("暂不支持屏蔽占位搜索词");
            }
            completed = false;

            //插入到sqlite
            String sql = String.format("insert into report values(null, %s, %s, '%s')", getInsertValue(name), getInsertValue(value), new Timestamp(System.currentTimeMillis()));
            logger.info(sql);
            statement.executeUpdate(sql);

            //缓存到集合
            if (isMagnet(value)) {
                mUrls.add(value);
            } else {
                mKeywords.add(value);
            }

            completed = true;

            logger.info(String.format("举报成功--->%s--->%s", name, value));
        } catch (Exception e) {
            completed = true;
            //如果已经存在
            if (e instanceof SQLiteException && SQLiteErrorCode.SQLITE_CONSTRAINT_UNIQUE == ((SQLiteException) e).getResultCode()) {
                //忽略
            } else {
                logger.error("举报失败", e);
                throw e;
            }
        }
    }

    protected String getInsertValue(String value) {
        return value == null ? null : String.format("'%s'", value);
    }

    public boolean containsKeyword(String keyword) {
        return mKeywords.contains(keyword);
    }

    public boolean containsUrl(String url) {
        return mUrls.contains(url);
    }

    public boolean isMagnet(String value) {
        return value.startsWith("magnet");
    }

    /**
     * 关键词列表
     *
     * @return
     */
    public List<ReportItem> getKeywordList() throws SQLException {
        //不以magnet开头的
        return queryReportTable("select * from report where value not like 'magnet%'", ReportItem.class);
    }


    /**
     * 磁力链列表
     *
     * @return
     */
    public List<ReportItem> getUrlList() throws SQLException {
        //magnet开头的
        return queryReportTable("select * from report where value like 'magnet%'", ReportItem.class);
    }


    public <T> List<T> queryReportTable(String sql, Class<T> cls) throws SQLException {
        logger.info(sql);
        ResultSet rs = statement.executeQuery(sql);
        List<T> list = new ArrayList<T>();
        while (rs.next()) {
            if (cls.getName().equals(String.class.getName())) {
                list.add((T) rs.getString("value"));
            } else {
                ReportItem item = new ReportItem();
                item.setName(rs.getString("name"));
                item.setValue(rs.getString("value"));
                Timestamp timestamp = rs.getTimestamp("created_time");
                item.setCreated(dateFormat.format(timestamp.getTime()));
                list.add((T) item);
            }
        }
        rs.close();
        return list;
    }

    public void deleteReport(String value) throws SQLException {
        ResultSet rs = statement.executeQuery(String.format("select * from report where value = '%s'", value));
        if (rs.next()) {
            int id = rs.getInt("id");
            String sql = String.format("delete from report where id = %d", id);
            logger.info(sql);
            statement.execute(sql);
        } else {
            throw new SQLException("不存在: " + value);
        }
    }

    @PreDestroy
    public void onDestroy() {
        try {
            statement.close();
            connection.close();
        } catch (SQLException e) {
            logger.error("关闭SQLite失败", e);
        }

    }
}