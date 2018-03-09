package com.dyhdyh.magnetw.model;

/**
 * author  dengyuhan
 * created 2018/3/7 11:52
 */
public class MagnetRule extends MagnetInfo{
    private String source;
    private String site;
    private String waiting;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getWaiting() {
        return waiting;
    }

    public void setWaiting(String waiting) {
        this.waiting = waiting;
    }
}
