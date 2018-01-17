<template>
	<div class="register-wrapper">
		<el-form :inline= "true":model="ruleForm" ref = "ruleForm" label-width="110px" class="demo-form-inline demo-ruleForm register-container">
    <!-- <h3 class="title">单位信息</h3> -->
			<p class="text-header">单位规模信息</p>
		  <el-form-item label="单位名称" prop="name">
		    <el-input v-model="ruleForm.name" class = "input-in"></el-input>
		  </el-form-item>
   
		  <el-form-item label="填报年份" prop="region">
		    <el-select v-model="ruleForm.region"  class = "input-in">
		      <el-option label="2017年" value="shanghai"></el-option>
		      <el-option label="2016年" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
      
      <div class="registration">
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" class="registerBtn">完成</el-button>
          <el-button @click="resetForm('ruleForm')">返回</el-button>
        </el-form-item>
      </div>
		  
		  
		  <div class="registration">
	        	已有账号?
	          <span class="signup"  @click="backToLogin">
	              点击登录
	          </span>
    	</div>
		</el-form>
		
	</div>
</template>
<script>
	export default {
    data() {
      return {
        ruleForm: {
          code:'',
          name: '',
          region: '',
          industry:'',
          RegisDate:'',
          RegisAccount:'',
          Boss:'',
          tel:'',
          RegisAddress:'',
          RegisPostCode:'',
          SellAddress:'', 
          SellPostCode:'', 
          SellTel:'', 
          website:'', 
          Fax:'', 
          SellRange:'', 
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
                  message: '注册成功',
                  type: 'success'
            }); 
            //将用户信息添加到数据库
            
            //跳转到登录页
            this.$router.push('/login');

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        // this.$refs[formName].resetFields();
        // this.$router.push('/register');
         this.$router.push({path:'/register'});
        // this.$router.push({ path: '/index' });
      },
      backToLogin(){
      	this.$router.go(-1);
      }
    }
  }
</script>
<style scoped lang="scss">
.register-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background-image: url(../assets/login-bg.jpg);
    background-size: cover;
    width: 100%;
    height: 100%;

    .register-container {
      position: relative;
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      margin: 180px auto;
      width: 630px;
      padding: 40px 20px 15px 0;
      background: #fff;
      border: 1px solid #eaeaea;
      .title {
        position: absolute;
        top: -60px;
        width: 100%;
        text-align: center;
        left: 0;
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
        font-size: 24px;
        color: #fff;
      }
      .text-header{
      	position: absolute;
        top: 0;
        width: 100%;
        margin-left: 15px;

      }
      .registerBtn{
        background: #6bc5a4;
        color: #fff;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        transition: all 0.3s;
        /*font-size: 30px;*/
        border: none;
      }
      .registerBtn:hover{
        background: #688ac2;
        /*background: #20A0FF;*/

        transition: all 0.3s;
      }
		.registration{
	        color: #c7c7c7;
	        text-align: center;
	        margin-top: 15px;
	        .signup{
	          color: #6bc5a4;
	          text-decoration: none;
	          cursor: pointer;
	        }
	        .signup:hover{
	          text-decoration: underline;
	        }
	    }
	    .el-radio__input.is-checked  {
	    	.el-radio__inner{
	    		border-color: #6bc5a4;
		   	 	background: #6bc5a4;
	    	}
		   
		}
	    .el-button:focus, .el-button:hover {
		    color: #6bc5a4;
		    border-color: #6bc5a4;
		}
   .input-in{
      width:190px;
    }
     }

    }
</style>