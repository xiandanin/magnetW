package com.dyhdyh.magnetw.model;

import java.util.List;

/**
 * author  dengyuhan
 * created 2018/5/15 23:01
 */
public class MagnetPageResponse {
    private int currentPage;
    private List<MagnetInfo> results;

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public List<MagnetInfo> getResults() {
        return results;
    }

    public void setResults(List<MagnetInfo> results) {
        this.results = results;
    }
}
