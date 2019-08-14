package in.xiandan.magnetw.filter;

import org.apache.log4j.Logger;
import org.springframework.http.HttpMethod;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.Map;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * created 2019/5/5 15:21
 */
public class RequestLoggerFilter extends OncePerRequestFilter {
    private Logger logger = Logger.getLogger(getClass());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        logger.info(buildRequestString(request));

        chain.doFilter(request, response);
    }

    public String buildRequestString(HttpServletRequest request) {
        StringBuffer sb = new StringBuffer();
        sb.append(request.getRequestURL());
        if (HttpMethod.GET.name().equals(request.getMethod())) {
            if (!StringUtils.isEmpty(request.getQueryString())) {
                sb.append("?" + URLDecoder.decode(request.getQueryString()));
            }
        } else {
            sb.append("\n[Request Params]");
            Set<Map.Entry<String, String[]>> entrySet = request.getParameterMap().entrySet();
            for (Map.Entry<String, String[]> entry : entrySet) {
                String[] values = entry.getValue();
                for (String value : values) {
                    sb.append(entry.getKey());
                    sb.append(":");
                    sb.append(URLDecoder.decode(value));
                    sb.append("\n");
                }
            }
        }
        sb.append("\n[Request Headers]\n");
        Enumeration<String> names = request.getHeaderNames();
        while (names.hasMoreElements()) {
            String header = names.nextElement();
            sb.append(header);
            sb.append(":");
            sb.append(request.getHeader(header));
            sb.append("\n");
        }
        return sb.toString();
    }
}
