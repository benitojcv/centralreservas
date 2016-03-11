#
# Build:
#   docker build -t benitojcv/citaprevia .
#
FROM ubuntu:14.04
MAINTAINER benitojcv@gmail.com

# Install nodejs (not from repository)
RUN apt-get install -y wget tar
RUN cd /opt; wget https://nodejs.org/dist/v4.2.2/node-v4.2.2-linux-x64.tar.gz
RUN cd /opt; tar xvf node-v4.2.2-linux-x64.tar.gz
ENV PATH $PATH:/opt/node-v4.2.2-linux-x64/bin

ENV APPDIR /opt/citaprevia

RUN mkdir -p $APPDIR
WORKDIR $APPDIR
COPY ./*.json $APPDIR/
COPY ./*.js $APPDIR/
COPY views $APPDIR/views
COPY routes $APPDIR/routes
COPY services $APPDIR/services
COPY public $APPDIR/public
COPY bin $APPDIR/bin
COPY node_modules $APPDIR/node_modules

EXPOSE 3000
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
