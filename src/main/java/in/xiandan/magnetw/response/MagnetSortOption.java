package in.xiandan.magnetw.response;

import org.springframework.util.StringUtils;

/**
 * author  dengyuhan
 * created 2019/5/5 18:00
 */
public class MagnetSortOption {
    public static final String SORT_OPTION_DEFAULT = "default";
    public static final String SORT_OPTION_SIZE = "size";

    private String sort;
    private String sortName;

    public MagnetSortOption(String sort) {
        this.sort = sortValue(sort);
        this.sortName = this.sort.equals(SORT_OPTION_SIZE) ? "文件大小" : "默认排序";
    }

    public static String sortValue(String sort) {
        if (StringUtils.isEmpty(sort) || (!sort.equals(SORT_OPTION_DEFAULT) && !sort.equals(SORT_OPTION_SIZE))) {
            return SORT_OPTION_DEFAULT;
        }
        return sort;
    }

    public String getSort() {
        return sort;
    }

    public String getSortName() {
        return sortName;
    }
}
