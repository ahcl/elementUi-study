<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :xs="3" :sm="3" :md="3" :lg="5" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<span>学习学习</span>
			</el-col>
		
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'" >
				<el-menu :default-active="$route.path" class="newMenu" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed"  id="sidebar-hook">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden &&child.pri">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu  submenu-scroll-hook" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
								<router-view></router-view>
						</transition>
					</el-col>
				</div>
				<div class="footer">
				</div>

			</section>
			
		</el-col>
	</el-row>
</template>

<script>

  import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';
  import vue from 'vue';
  import Home from '../views/Home.vue';
  import VueRouter from 'vue-router';
  import routes from '../routes'
  import App from '../App'
  import Mock from '../mock'
vue.use(VueRouter)

const router = new VueRouter({
  mode:'history',
  routes
})

	export default {
		data() {
			return{
				nowRoute:'',
				menuItemIsActive:{},
				iBoxObject:{
					"line-height":"2"
				},
				indexSpan:{},
				indeConFont:{},	
				isLarge:true,
				itemIsActive:false,
				hasChild:false,
				hasMenuChild:{},
				menuChild:'',
				menuChildChild:'',
				menuChileIndex:'',
			    isIndex:false,
                handelSelectIndex:'',
				sysName:'嘉兴交通运输行业能耗监测管理平台',
				collapsed:false,
				dialogVisible:false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}


			}
		},
		
		methods: {

			handleSelectChild(a,b){
				
				console.log('handleSelectChild',a);
                console.log('handleSelectChild index',b);
			},
			onSubmit() {
				console.log('submit!');
			},
			handleopen(key, keyPath) {
				console.log('key',key);
				console.log("keyPath",keyPath);
				//console.log('handleclose',this.menuChild);
				//this.menuChildChild = this.menuChild[key].children;				
			},
			handleclose() {
				console.log('handleclose',this.$route.path);
			},
			handleselect1:function(a,b){
				// console.log('handleselect321',a);
				// console.log('handleselect321 index',b);
				// var nowNum  = parseInt(this.nowRoute);
				//  console.log('nowNum',typeof nowNum);
				//   console.log('this.nowRoute',this.$router.options.routes[nowNum]);
				//   var nowR = this.$router.options.routes[nowNum]
				// 	nowR.children.forEach(function (item) {
				// 			item.activeStyle = {}
				// 	});
			},
			handleselect: function (a, b) {
				console.log('handleselect123',a);
				console.log('handleselec123t index',b);

				
			
				
			},

			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			scrollToTop(){
     			$('.content-container').animate({scrollTop: '0px'}, 500);   
			}

		},
		mounted() {
			var that = this;
			console.log($('123++++++++++++++++++++++++++++'));
            this.$router.push({path:'/index'});
			//console.log("用户：",this.$userInfo);
			console.log('屏幕高度',document.documentElement.clientWidth);
			
		
			}

	}



</script>

<style scoped lang="scss">
	@import '~scss_vars';

@font-face {
  font-family: 'iconfont';  /* project id 496480 */
  src: url('//at.alicdn.com/t/font_496480_1dj5ff9xk924vx6r.eot');
  src: url('//at.alicdn.com/t/font_496480_1dj5ff9xk924vx6r.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_496480_1dj5ff9xk924vx6r.woff') format('woff'),
  url('//at.alicdn.com/t/font_496480_1dj5ff9xk924vx6r.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_496480_1dj5ff9xk924vx6r.svg#iconfont') format('svg');
}

	.iconfont {
		font-family:"iconfont" !important;
		font-size:16px;
		font-style:normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}


	// .h-menu-item-other{
	// 	padding:0;
	// }
	// .newMenu{
	// 	overflow: auto;
	// 	width: 230px;
	// }
	// .el-menu-demo{
	// 	position: relative;
	// 	display: block;
	// 	background: none;
	// 	width:100%;
		
	// 	height: 60px;
	// 	min-height: 60px;
	// }
	

	// .h-menu-item{
	// 	width:7%;
	// 	text-align: center;
	
	// }
	// .h-menu-item>.menu-item{
	
	// 	text-align: center;
	// }
	// .h-menu-item>.menu-item>i{
	// 	margin:0 auto;
	// 	width:100%;
	// 	font-size:1.7em;
	// }
	
	// .h-menu-item>.h-menu-item-text{
	// 	display: block;
		
	// }
	
	// .h-menu-item.is-active{
	// 	width:7%;
	// }
	// .el-menu-item.is-active{

	// 	border-bottom: 5px solid #409EFF;
	// 	background:#EEF6F6;
	// }

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		overflow: auto;
		& .el-button--primary {
    		color: #fff;
   			background-color: red;
    		border-color: red;
		}
		.header {
			height: 60px;
			/*line-height: 25px;*/
			//background: $color-primary;
			background:#409EFF;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				color:#fff;
				.role{
					margin-right: 10px;
				}
				.userinfo-inner {
					cursor: pointer;
					color: #fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				/*text-align: center;*/
				width:230px;
				height:60px;
				line-height:60px;
				
				font-size: 20px;
				padding-left:20px;
				padding-right:10px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				/*background: #424f63;*/
				img {
					// width: 40px;
					float: left;
					// margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			/*.logo-width{*/
				/*width:230px;*/
			/*}*/
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;

				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}
					.submenu-scroll-hook{
						max-height: 600px;
					}
				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				display: flex;
				flex-direction: column;
				flex:1;
				position: relative;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.grid-content{
					flex: 1;
					.breadcrumb-container {
						//margin-bottom: 15px;
						.title {
							width: 200px;
							float: left;
							color: #475669;
						}
						.breadcrumb-inner {
							float: right;
						}
					}
					.content-wrapper {
						background-color: #fff;
						box-sizing: border-box;
					}
					
				}
				
				.footer{
					width: 100%;
					.page-footer-inner{
						margin-top: 20px;
						float: left;
					}
					.scroll-to-top{
						float: right;
						margin-top: 10px;
						padding: 0px 23px;
					    cursor: pointer;
						.fa-arrow-circle-up{
							font-size: 34px;
							line-height: 24px;
							color: #20a0ff;
						}
					}
				}
			}
			
		}

	}
	// .i-style{
	// 	display:block;
	// }
	// .logo-name-e{
	// 	font-size: 2px;
	// 	-webkit-text-size-adjust:none !important;
	// }
	// #name_span{
	// 	line-height: 60px;
	// }
	// .el-submenu .el-menu-item{
	// 	padding:0 !important;
	// 	text-align: center;
	// }
</style>

<style>

</style>
