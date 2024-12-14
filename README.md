# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

要发布 Remix 项目，可以按照以下步骤进行：

1. 构建项目
首先，为生产环境构建你的应用：
``` shell
npm run build
```
2. 运行生产模式的应用
然后，以生产模式运行应用：
``` shell
npm start
```
3. 部署到服务器
将构建后的文件部署到你的服务器上。你可以选择使用以下几种常见的部署方式：

``` shell
# 使用 Vercel
## 安装 Vercel CLI：
npm install -g vercel

## 登录 Vercel：
vercel login

## 部署项目：
vercel


# 使用 Netlify
## 安装 Netlify CLI：
npm install -g netlify-cli

## 登录 Netlify：
netlify login

## 部署项目：
netlify deploy


# 使用 Docker
## 创建 Dockerfile：
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

## 构建 Docker 镜像：
docker build -t my-remix-app .

## 运行 Docker 容器：
docker run -p 3000:3000 my-remix-app


```
通过这些步骤，你可以将 Remix 项目部署到生产环境中。


## 数据迁移
确保所有数据库迁移已经应用：
``` shell
npx prisma migrate deploy
``` 


## Tips

``` shell
# 如何在 Remix 应用中使用数据库存储用户信息？
# 使用数据库客户端（如 Prisma、TypeORM 等）连接到数据库。
# 以下是一个使用 Prisma 作为数据库客户端的示例

# 首先，安装 Prisma 和 SQLite（或其他数据库）
npm install @prisma/client
npm install prisma --save-dev

# 初始化 Prisma
npx prisma init

#运行 Prisma 命令生成数据库和 Prisma 客户端：
npx prisma migrate dev --name update-role-to-user
npx prisma generate

```