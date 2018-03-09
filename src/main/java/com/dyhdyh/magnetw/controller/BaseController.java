package com.dyhdyh.magnetw.controller;

import org.springframework.ui.Model;
import org.springframework.util.StringUtils;

import java.net.SocketTimeoutException;

/**
 * author  dengyuhan
 * created 2018/3/7 14:19
 */
public class BaseController {

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
