<template>
  <v-card light class="login-card" elevation="20">
    <span v-if="showLogin">
      <v-card-title>Sign in</v-card-title>
      <v-card-subtitle>Log in to Library</v-card-subtitle>
      <v-form class="ma-2 pa-3" ref="loginForm" v-model="isLoginFormValid" lazy-validation>
        <v-text-field required color="accent" outlined label="Email" placeholder="Email" :rules="rules.email" v-model="email"></v-text-field>
        <v-text-field
          required
          color="accent"
          v-model="password"
          outlined
          label="Password"
          placeholder="Password"
          :rules="rules.password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-card-actions>
          <v-btn
            outlined
            width="50%"
            @click="
              showSignUp = true;
              showLogin = false;
            "
          >
            <span>Create account</span>
          </v-btn>
          <v-btn class="accent" width="50%" @click="login" :disabled="!isLoginFormValid">
            <span>Login</span>
          </v-btn>
        </v-card-actions>
        <a
          href="#"
          class="ma-2 grey--text d-flex justify-center"
          @click="
            showForgotPassword = true;
            showLogin = false;
          "
          >Forgot password?</a
        >
      </v-form>
    </span>
    <span v-if="showForgotPassword">
      <v-card-title>Forgot your password?</v-card-title>
      <v-card-subtitle>No issues, enter your library Id.</v-card-subtitle>
      <v-form class="ma-2 pa-3">
        <v-text-field color="accent" outlined label="ID" placeholder="ID" required></v-text-field>

        <v-card-actions>
          <a
            class="text-transform-none font-weight-regular align-start d-flex accent--text"
            style="width: 50%"
            @click="
              showLogin = true;
              showForgotPassword = false;
            "
            >Sign in instead</a
          >

          <v-btn class="accent" width="50%" @click="forgotPassword()">
            <span>Send password</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </span>
    <span v-if="showSignUp">
      <v-card-title>Sign up</v-card-title>
      <v-card-subtitle>Make a new account.</v-card-subtitle>
      <v-form class="ma-2 pa-3" ref="registerForm" v-model="isRegisterFormValid" lazy-validation>
        <v-text-field color="accent" v-model="name" :rules="rules.name" outlined label="Name" placeholder="Name" required></v-text-field>
        <v-row>
          <v-col>
            <v-text-field color="accent" v-model="email" :rules="rules.email" outlined label="Email" placeholder="Email" required></v-text-field>
          </v-col>
          <v-col>
            <v-overflow-btn v-model="role" solo :items="roles" :rules="rules.role" label="Role" color="white" light background-color="white" required></v-overflow-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              color="accent"
              v-model="password"
              :rules="rules.password"
              outlined
              label="Password"
              placeholder="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              color="accent"
              v-model="confirmPassword"
              :rules="rules.confirmPassword.concat(passwordConfirmationRule)"
              outlined
              label="Confirm password"
              placeholder="Confirm password"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-card-actions>
          <a
            class="text-transform-none font-weight-regular align-start d-flex accent--text"
            style="width: 50%"
            @click="
              showLogin = true;
              showSignUp = false;
            "
            >Sign in instead</a
          >

          <v-btn class="accent" width="50%" @click="createAccount" :disabled="!isRegisterFormValid">
            <span>Create account</span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </span>
    <span></span>
  </v-card>
</template>

<script>
export default {
  name: 'login',
  data: () => {
    return {
      name: '',
      id: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      isLoginFormValid: true,
      isRegisterFormValid: true,
      showPassword: false,
      showLogin: true,
      showForgotPassword: false,
      showSignUp: false,
      hasForgottenPassword: false,
      isCreatingAccount: false,
      roles: ['Student', 'Employee'],
      rules: {
        name: [(n) => !!n || 'Name is required.'],
        email: [(v) => !!v || 'E-mail is required.', (v) => /.+@.+/.test(v) || 'E-mail must be valid.'],
        role: [(r) => !!r || 'Role is required.'],
        password: [
          (p) => !!p || 'Password is required',
          // (p) => /.+@.+/.test(p) || "Please enter valid password.",
          (p) => p.length <= 10 || 'Password should be less then 10 characters.',
        ],
        confirmPassword: [(c) => !!c || 'Password is required'],
      },
    };
  },
  methods: {
    clearInput() {
      this.name = '';
      this.id = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    },
    login() {
      if (this.$refs.loginForm.validate()) {
        this.$emit('showLogin', false);
        const { email, password } = this;
        this.$store
          .dispatch('login', { email, password })
          .then((status) => {
            if (status === 200) {
              this.$router.push({ name: 'dashboard' });
            }
          })
          .catch((err) => {
            this.$store.commit('setStatus', err.response.data);
          });
        this.clearInput();
      }
    },
    forgotPassword() {
      this.$emit('showLogin', false);
    },
    createAccount() {
      if (this.$refs.registerForm.validate()) {
        this.$emit('showLogin', false);
        this.showSignUp = false;
        const userInfo = {
          name: this.name,
          id: this.id,
          email: this.email,
          password: this.password,
          type: this.role,
        };
        this.$store.dispatch('register', userInfo);
        this.clearInput();
      }
    },
  },
  computed: {
    passwordConfirmationRule() {
      return () => this.password === this.confirmPassword || 'Password must match.';
    },
  },
};
</script>

<style scoped></style>
