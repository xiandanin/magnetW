package com.dyhdyh.magnetw.model;

import java.util.List;

/**
 * author  dengyuhan
 * created 2018/5/15 23:01
 */
public class MagnetPageResponse {
    private int currentPage;
    private String currentSourceName;
    private List<MagnetInfo> results;
    private List<String> sourceNames;//源站名称

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public String getCurrentSourceName() {
        return currentSourceName;
    }

    public void setCurrentSourceName(String currentSourceName) {
        this.currentSourceName = currentSourceName;
    }

    public List<MagnetInfo> getResults() {
        return results;
    }

    public void setResults(List<MagnetInfo> results) {
        this.results = results;
    }

    public List<String> getSourceNames() {
        return sourceNames;
    }

    public void setSourceNames(List<String> sourceNames) {
        this.sourceNames = sourceNames;
    }
}
