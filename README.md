# OAuth Server

## Description

为 AMAZON 项目本地开发提供的一个 OAuth 服务

## Usage

- 直接从 gitlab 拉取构建好的镜像，容器启动运行即可使用

## Develop

- 安装依赖

  ```shell
  yarn && yarn start:dev
  ```

- 服务默认使用 `9509` 端口，浏览器打开 `localhost:9509`

- 根据网页内容进行操作

  - 系统内置了一个初始帐号 `alan:alan123`，你可用该帐号直接登录或者也可以自己注册帐号

  - 系统内置了一个初始的 OAuth 客户端，你可以创建自己的客户端
