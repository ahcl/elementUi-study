<template>
	<section>
		<el-row>
			<h3>表格+表单</h3>
			<p>1.新增表格内容</p>
			<p>2.删除表格内容</p>
			<el-table
				:data="tableData"
				style="width: 100%">
				<el-table-column
					prop="date"
					label="日期"
					>
					<template slot-scope="scope">
							<el-input v-model="scope.row.date" class="inputBox" @blur="check(scope.$index,scope.row)" v-show="!scope.row.sure"></el-input>
							<span class="errorBox" v-show="!scope.row.sure">{{error.date}}</span>
							<span v-show="scope.row.sure">{{scope.row.date}}</span>
					</template>
					
				</el-table-column>
				<el-table-column
					prop="name"
					label="姓名"
					>
					<template slot-scope="scope">
							<el-input v-model="scope.row.name" @blur="check(scope.$index,scope.row)" class="inputBox" v-show="!scope.row.sure"></el-input>
							<span class="errorBox" v-show="!scope.row.sure">{{error.name}}</span>
							<span v-show="scope.row.sure">{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="address"
					label="地址">
					<template slot-scope="scope">
							<el-input v-model="scope.row.address"  class="inputBox" @blur="check(scope.$index,scope.row)" v-show="!scope.row.sure"></el-input>
							<span class="errorBox" v-show="!scope.row.sure">{{error.address}}</span>
							<span v-show="scope.row.sure">{{scope.row.address}}</span>
					</template>
				</el-table-column>
				<el-table-column
					label="操作">
					   <template slot-scope="scope">
							<el-button @click="handleDelet(scope.$index)" type="text" size="small" >删除</el-button>
							<el-button type="text" size="small" @click="handleChange(scope.$index)" v-show="scope.row.edit">编辑</el-button>
							<!-- <el-button type="text" size="small">确定</el-button> -->
					   </template>
				</el-table-column>
			</el-table>
			<div class="optionBox">
				<div class="addBox" @click="addNewInfo">
					<i class="el-icon-plus plusBox"></i><p class="inlineBox">新增</p>
				</div>
			</div>
		</el-row>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				 tableData: [],
				 error:{
					 name:'',
					 date:'',
					 address:''
				 },
				isAdd:true,
			}
		},
		methods: {
			addNewInfo(){
				console.log("新增");
				if(!this.isAdd  ){
					this.$message({
						message: '请填写完整的信息',
						type: 'warning'
					});
				}else{
					var newInfo = {
					name:'',
					date:'',
					address:'',
					sure:false,
					edit:false
					};

					this.tableData.push(newInfo);
					this.isAdd = false;
			    }
				
			},
			handleDelet(i){
				console.log("删除");
				this.tableData.splice(i,1);
				if( this.tableData.length ==  0 ){
					this.isAdd = true;
				}
			},
			check(index,item){
				console.log("审核",item);
				if(!item.date){
					this.error={
					 name:'',
					 date:'请输入时间',
					 address:''
					 }
				 }else if(!item.name){
					this.error={
					 name:'请输入姓名',
					 date:'',
					 address:''
					 }
				 }else if(!item.address){
					this.error={
					 name:'',
					 date:'',
					 address:'请输入地址'
					 }
				 }else{
					 this.error={
					 name:'',
					 date:'',
					 address:''
					 }
					this.tableData[index] = item;
					this.tableData[index].sure = true;
					this.tableData[index].edit = true;
					this.isAdd = true;
				 }
				
			},
			handleChange(index){
				this.tableData[index].sure = false;
				this.tableData[index].edit = false;
			}
		
		},
		mounted() {
		
			
		}
	}

</script>

<style scoped lang="scss">
@import '~scss_vars';
.el-icon-plus{
	display: inline;
	padding-right: 10px;
}
.inlineBox{
	display: inline;
}
.optionBox{
	text-align: center;
	padding:15px;
	border: 1px dashed #DFE6EC;
}
.addBox:hover{
	cursor: pointer;
}
.inputBox{
	width: 50%;
}
.el-table th>.cell{
	text-align: center;
}
.errorBox{
	color:red;
}
</style>

