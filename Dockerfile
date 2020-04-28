FROM gcr.io/cloud-marketplace/google/nginx1:latest

COPY ./backend/ngxinger.pex .
COPY ./nginx.conf /etc/nginx/conf.d/site.conf
COPY ./docker-entrypoint.sh .
RUN wget -q https://dgilman.xen.prgmr.com/ngxinger-omaha.sqlite3 \
    && mkdir -p /nginx-root \
    && echo "deb http://httpredir.debian.org/debian unstable main" >> /etc/apt/sources.list \
    && apt update \
    && apt -t unstable install -y python3.8 python3-distutils

EXPOSE 80

ENTRYPOINT ["/usr/bin/env"]
CMD ["/docker-entrypoint.sh"]
