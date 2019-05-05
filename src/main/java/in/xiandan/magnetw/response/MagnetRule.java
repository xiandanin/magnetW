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

    private String url;//网站首页url
    private String path;//默认排序的路径
    private String path_size;//文件大小排序的路径

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPath_size() {
        return path_size;
    }

    public void setPath_size(String path_size) {
        this.path_size = path_size;
    }
}
