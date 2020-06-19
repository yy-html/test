
 ### App Gener 模版


 #### 使用 在你原有项目上建立新分支 把micro-app-gener中除了src文件夹 全拷贝到你原有的项目上去（覆盖）
 #### 使用编辑器的全局搜索功能，搜索“dms”，并且限制精确匹配到词，全局替换成你的新项目代码“xxx”

    ``` 
        1、请根据项目配置public/dependen/app.json文件(子项目不用看这条)
            主项目配置：
                - base: true
                - isBaseRoute: true

        2、新项目或迁移项目放置src目录下，入口文件src/main.js

        3、本地运行与打包:
            npm run dev 基本不用
            npm run build 基本不用
            npm run dev:mic micro 项目本地运行
            npm run build:mic micro 项目打包
        4、依赖：
            本地开发加载器 npm安装
            @mfb/micro-loader-local
    ```

 #### src/main.js变更

    ```
        - before:
            // new Vue({
            //   router,
            //   store,
            //   render: h => h(App)
            // }).$mount('#app')

        - after:

        import microAdaptor from '@mfb/micro-adapter-vue';
        import appConfig from 'public/dependen/app.json'

        const env = process.env.NODE_ENV
        
        // if (env === 'development') {
        //    new Vue({
        //        router,
        //        store,
        //        render: h => h(App)
        //    }).$mount('#root')
        // }

        const lifecycles = microAdaptor({
            Vue,
            appOptions: {
                el: '#app',
                ...appConfig,
                router,
                // routes,
                store,
                // modules,
                render: h => h(App)
            }
        });

        export const bootstrap = [
            lifecycles.bootstrap,
        ];

        export const mount = [
            lifecycles.mount,
        ];

        export const unmount = [
            lifecycles.unmount,
        ];

    ```

 #### src目录

    ```
        src目录大致规范:
        |- src
                |- assets
                |- common
                |- components
                        |- global
                        |- normalComps
                        |- index.js
                |- config
                        |- apis
                        |- router
                        |- service
                        |- store
                |- views
                main.js
                App.vue
                store.js
    ```
 #### app.vue
    <template>
        <div id="sms">
            <MfbMain> // 这里用MfbMain包裹keep-alive 
                <keep-alive> // 项目中所有页面级别的 router-view 都需要用keep-alive包裹
                    <router-view/>
                </keep-alive>
            </MfbMain>
        </div>
    </template>
    // 下面的引用和注册不要忘了
    <script>
      import { MfbMain } from '@mfb/pc-components-micro'
      export default {
        components: {
          MfbMain
        },
    
 ##改造必读&规范：
 
 + public/dependen/app.json 里替换所有sms为你的项目代码(项目代码取决于路由前缀，比如lbp其实代码是charging)
 + app.vue里的id=#app改成项目代码(项目代码取决于路由前缀，比如lbp其实代码是charging)
 + ！！！所有的 @mfb/pc-components2.0 请只把src内的文件全局替换成 @mfb/pc-components-micro
 + ！！！所有的 @mfb/pc-utils 请全局替换成 @mfb/pc-utils-micro
 + 所有三方框架/工具需要统一版本，目前包括vue、vue-router、iview、vuex、moment、axios
 + 所有style标签样式必须加scope
 + 项目里的全局对象/属性要排查，不允许出现全局变量，对已存在的加命名空间。如，原来的是 window.varA 则现在需要改成 window.SMS(你的系统代号)_varA
 + 所有router-view标签要用keep-alive包裹(包括多级router-view)，并按需把原有的created钩子内容转移到activated钩子里；按需把原有的destroy钩子内容转移到deactivated钩子里
 + 全局按键监听在离开页面时必须消除(比如enter键)、interval等计时器同理,在deactivated钩子里进行消除。
 + 不允许在body插入dom对象
 + 要注意，原有项目里的index.html注入的东西不再可用，入口在打包部署后统一由主加载器提供一个html
 + 路由不要再用mfbRouter生成，都合并为同级路由即可，全屏需求只需在路由后追加query : noBrainNav=true
 + 子项目的路由需要去掉原有的/home /error，并且不要写全局的redirect，公共路由(主页、错误页、登录页)交由主项目统一处理，并在根级添加以下两个路由(一定要加到所有路由最后面)：
    ```
        {
            path:'/error'  // 将error路由交给主项目处理，所以只写一个path就行
        },
        {
            path: '/sms/*',  // sms的位置替换成你的项目路由前缀。匹配不到页面的路由，重定向到error
            redirect: '/error' 
        },
    ```
    ```
    这样声明router
    const router = new Router({
      routes: [...viewRoutes, ...pageRoutes,
        {
          path: '/error'
        },
        {
          path: '/sms(你的项目代号)/*',
          redirect: '/error'
        }
      ]
    })
    ```
 + 项目中不需要再引入iview.css，由加载器统一引入，所以请在main.js中去掉iview.css
 + 如果你现在的路由没有统一的前缀，需要加上它，比如sms项目就要统一加/sms，相当于路由命名空间，比如sms项目所有路由的都应该是 #/sms/xxx 这样的
 + 有Vue.component、Vue.use等全局方法使用时，要加命名空间，比如Vue.component(name,xxx)要改成Vue.component(SMS_name,xxx) 这样的
 
 ### 全局主动调用方法
    关闭当前页签
    window.MICRO_CLOSE_TAB(this.$route)
    
 ## 性能相关必做
 
 ### 所有路由匹配到的页面级组件的name需要对应路由path改变名称，比如 /a/b/c 匹配到的组件，name需要设置成 a-b-c

 ### 所有的keep-alive所在页面需要这样加入动态exclude：
    <template>
        <div class="app-container">
            <keep-alive :exclude="exclude"> // 绑定exclude
                <router-view :key="$route.fullPath"/> // 详情页共用一个组件 需要加key
            </keep-alive>
        </div>
    </template>
    <script>
      export default {
        data(){
          return {
            exclude: [] // 声明exclude
          }
        },
        created(){
          window.MICRO_REGISTER_CLOSE_EVENT(({ excludes }) => { // 注册方法，关闭页签时通过设置exclude清理keep-alive缓存
            this.exclude = excludes
          })
        }
      }
    </script>
    
 ### 所有详情页(所有通过/xxx/xxx/:id这类的页面)有缓存缺陷，需要在deactivated钩子里手动调用$destroy
    deactivated(){
        this.$destroy()
    },
```
