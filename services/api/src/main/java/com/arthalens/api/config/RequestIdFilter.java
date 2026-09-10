package com.arthalens.api.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.UUID;

/**
 * MDC (Mapped Diagnostic Context) request ID filter.
 * Attaches a unique request-id to every log line for the duration of the request.
 * Also adds X-Request-Id to the response for correlation.
 */
@Component
@Order(1)
public class RequestIdFilter implements Filter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String MDC_KEY = "requestId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String requestId = null;
        if (request instanceof HttpServletRequest httpReq) {
            requestId = httpReq.getHeader(REQUEST_ID_HEADER);
        }
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }

        MDC.put(MDC_KEY, requestId);
        try {
            if (response instanceof HttpServletResponse httpResp) {
                httpResp.setHeader(REQUEST_ID_HEADER, requestId);
            }
            chain.doFilter(request, response);
        } finally {
            MDC.remove(MDC_KEY);
        }
    }
}
