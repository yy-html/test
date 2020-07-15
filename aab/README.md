# 前端项目模板

参考：
> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template


## Build Setup


```bash
# clone the project
git clone http://gitlab.missfresh.net/56-frontend/mfb-valuedashboard

# enter the project directory
cd mfb-valuedashboard

# install dependency
npm install

# 启动本地开发环境
npm run dev
```

## 构建

```bash
# max上的测试环境部署
npm run stage

# max上预发环境部署
npm run pre

# max上生产环境部署
npm run build

# docker环境部署
npm run test

# 代码格式检查
npm run lint

# 代码格式修复
npm run fixed
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report
```