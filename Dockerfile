FROM openjdk:8-jdk-alpine AS builder

# Install Maven
ENV MAVEN_VERSION 3.6.1
ENV MAVEN_HOME /usr/lib/mvn
ENV PATH $MAVEN_HOME/bin:$PATH
RUN wget http://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz && \
  tar -zxvf apache-maven-$MAVEN_VERSION-bin.tar.gz && \
  rm apache-maven-$MAVEN_VERSION-bin.tar.gz && \
  mv apache-maven-$MAVEN_VERSION /usr/lib/mvn

# Build app
WORKDIR /app
RUN apk update && apk add git \
    && git clone https://github.com/dengyuhan/magnetW.git
WORKDIR /app/magnetW
RUN ["mvn", "install"]



FROM tomcat:9
LABEL MAINTAINER azure https://baiyue.one 
# add context to /usr/local/tomcat/webapps
RUN apt-get install -y unzip

RUN rm -rf /usr/local/tomcat/webapps/*
# RUN rm -rf /usr/local/tomcat/webapps/ROOT/*

COPY --from=builder ./app/magnetW/target/magnetw.war /usr/local/tomcat/webapps/app.war

RUN mkdir /usr/local/tomcat/webapps/ROOT && \
	unzip /usr/local/tomcat/webapps/app.war -d /usr/local/tomcat/webapps/ROOT && \
	rm /usr/local/tomcat/webapps/app.war 

EXPOSE 8080
