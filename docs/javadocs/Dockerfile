FROM httpd

COPY lib/target/site/apidocs/ /usr/local/apache2/htdocs/lib
COPY spigot/target/site/apidocs/ /usr/local/apache2/htdocs/spigot
COPY velocity/target/site/apidocs/ /usr/local/apache2/htdocs/velocity

COPY website/.htaccess /usr/local/apache2/htdocs/

RUN rm /usr/local/apache2/htdocs/index.html

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf

EXPOSE 80
