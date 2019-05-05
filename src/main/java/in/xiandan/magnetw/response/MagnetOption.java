package in.xiandan.magnetw.response;

/**
 * author  dengyuhan
 * created 2019/5/5 13:31
 */
public class MagnetOption {

    private int page;
    private String keyword;
    private String site;
    private MagnetSortOption sort;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public MagnetSortOption getSort() {
        return sort;
    }

    public void setSort(MagnetSortOption sort) {
        this.sort = sort;
    }
}
