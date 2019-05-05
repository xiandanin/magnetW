package in.xiandan.magnetw.handler;

import org.apache.log4j.Logger;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import in.xiandan.magnetw.exception.MagnetParserException;
import in.xiandan.magnetw.response.BaseResponse;

/**
 * 全局异常处理
 * created 2019/5/5 13:35
 */
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {
    private Logger logger = Logger.getLogger(getClass());

    @ExceptionHandler(Exception.class)
    public BaseResponse handleException(Exception e) {
        logger.error(e.getMessage(), e);

        if (e instanceof SocketTimeoutException || e instanceof UnknownHostException || e instanceof ConnectException) {
            return BaseResponse.error("请求源站超时");
        }else if (e instanceof MissingServletRequestParameterException) {
            return BaseResponse.error("缺少参数");
        } else if (e instanceof MagnetParserException) {
            return BaseResponse.error("解析失败");
        }
        return BaseResponse.error(e.getMessage());
    }
}
