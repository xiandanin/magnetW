package com.dyhdyh.magnetw.controller;

import org.apache.log4j.Logger;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;

import java.net.SocketTimeoutException;
import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;

/**
 * author  dengyuhan
 * created 2018/3/7 14:19
 */
public class BaseController {
    private Logger logger = Logger.getLogger(getClass());

    protected void logger(HttpServletRequest request) {
        String queryString = request.getQueryString();
        if (!StringUtils.isEmpty(queryString)) {
            logger.info(request.getRequestURL() + "?" + URLDecoder.decode(queryString));
        }
    }

    protected String error(Model model, Throwable e) {
        return error(model, null, e);
    }

    protected String error(Model model, String message, Throwable e) {
        String defaultMessage = "未知错误";
        if (e != null) {
            e.printStackTrace();
            if (e instanceof SocketTimeoutException) {
                defaultMessage = "请求超时";
            }
        }
        if (StringUtils.isEmpty(message)) {
            message = defaultMessage;
        }
        model.addAttribute("error_message", message);
        return "error";
    }
}
