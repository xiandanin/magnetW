package in.xiandan.magnetw.response;

/**
 * 规则
 */
public class MagnetRule {

    private String site;//源站名称
    private boolean proxy;//是否需要代理

    private String group;
    private String magnet;
    private String name;
    private String size;
    private String date;
    private String hot;

    private String host;//网站域名
    private String url;//网站首页url
    private MagnetRulePath paths;//搜索路径

    private MagnetRuleDetail detail;

    public MagnetRuleDetail getDetail() {
        return detail;
    }

    public void setDetail(MagnetRuleDetail detail) {
        this.detail = detail;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public boolean isProxy() {
        return proxy;
    }

    public void setProxy(boolean proxy) {
        this.proxy = proxy;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getMagnet() {
        return magnet;
    }

    public void setMagnet(String magnet) {
        this.magnet = magnet;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getHot() {
        return hot;
    }

    public void setHot(String hot) {
        this.hot = hot;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public MagnetRulePath getPaths() {
        return paths;
    }

    public void setPaths(MagnetRulePath paths) {
        this.paths = paths;
    }
}
