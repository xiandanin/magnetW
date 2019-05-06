package in.xiandan.magnetw.response;

/**
 * 网站的排序
 * created 2019/5/6 23:58
 */
public class MagnetPageSiteSort {
    public static final String SORT_OPTION_DEFAULT = "default";//默认排序
    public static final String SORT_OPTION_SIZE = "size";//大小排序
    public static final String SORT_OPTION_TIME = "time";//时间排序
    public static final String SORT_OPTION_HOT = "hot";//热度排序

    private String sort;
    private String sortName;

    public MagnetPageSiteSort(String sort) {
        this.sort = sort;
        if (SORT_OPTION_SIZE.equals(this.sort)) {
            this.sortName = "文件大小";
        } else if (SORT_OPTION_HOT.equals(this.sort)) {
            this.sortName = "下载人气";
        } else if (SORT_OPTION_TIME.equals(this.sort)) {
            this.sortName = "创建时间";
        } else if (SORT_OPTION_DEFAULT.equals(this.sort)) {
            this.sortName = "默认排序";
        }
    }

    public String getSort() {
        return sort;
    }

    public String getSortName() {
        return sortName;
    }

}
