FROM gcr.io/cloud-marketplace/google/nginx1:1.12

COPY ./backend/ngxinger.pex .
COPY ./nginx.conf /etc/nginx/conf.d/site.conf
COPY ./docker-entrypoint.sh .
RUN wget https://dgilman.xen.prgmr.com/ngxinger-omaha.sqlite3 \
    && mkdir -p /nginx-root

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
