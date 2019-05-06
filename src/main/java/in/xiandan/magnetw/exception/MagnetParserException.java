package in.xiandan.magnetw.exception;

/**
 * created 2019/5/5 13:40
 */
public class MagnetParserException extends Exception {

    public MagnetParserException(Throwable cause) {
        super("解析源站失败", cause);
    }
}
