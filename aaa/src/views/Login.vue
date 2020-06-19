<template>
    <div class="login-container">
        <MfbLogin @input-valid="loginSuccess" :verify-code-url="`${verifyCodeUrl}/${timeStamp}`" class="login-content"></MfbLogin>
    </div>
</template>

<script>
// @ is an alias to /src
import { MfbLogin } from "@mfb/pc-components-micro";
import { MfbRequest, MfbCookie } from "@mfb/pc-utils-micro";
console.log('1111', MfbCookie)
export default {
  name: "login",
  components: {
    MfbLogin
  },
  created() {},
  data() {
    const domain = 'http://10.2.4.17:8040/'
    // const domain = 'http://10.2.4.200:8040/'
    return {
      timeStamp: Date.parse(new Date()),
      // verifyCodeUrl: `${domain}admin/code`,
      verifyCodeUrl: `${domain}captcha`,
    };
  },
  methods: {
    async loginSuccess(loginFormData) {
      // 默认设置登录token
      MfbCookie.setCookie({
        accessToken: "Basic cGlnOnBpZw==",
        domain: ""
      });
      let data = {
        ...loginFormData,
        randomStr: this.timeStamp
      };
      try {
        let res = await MfbRequest({
          // url: '/auth/authentication/login',
          url: '/login/',
          method: "POST",
          data
        });
        if (res.code == 200) {
          const { token_type, access_token, expires_in } = res.result;
          // 设置token
          MfbCookie.setCookie({
            accessToken: `${"Bearer"} ${access_token}`,
            domain: ""
          });
          this.$router.push("/");
        }
      } catch (error) {
        this.$router.replace("/login");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: fixed;
  width: 100%;
  height: 100%;
  .login-content {
    width: 100%;
    height: 100%;
  }
}
</style>
