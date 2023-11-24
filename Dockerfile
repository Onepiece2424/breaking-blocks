FROM almalinux:latest

RUN yum -y install wget

RUN curl -sL https://rpm.nodesource.com/setup_18.x | bash -
RUN yum install -y nodejs

RUN curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum install -y yarn

RUN yum install -y gcc-c++ make

RUN cd app/ & yarn install
