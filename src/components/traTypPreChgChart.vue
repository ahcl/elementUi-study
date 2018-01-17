<template>
  <section class = "chart">
      <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="year"
                        align="right"
                        type="year"
                        placeholder="选择年"
                        @change="selectYearMonth"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div> 
            </el-col>
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div id="allEngChgChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>  
      <el-row>
            <el-col class="chart-container">
                <div id="unitEngChgChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
      </el-row>    
  </section>
</template>


<script>

import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';
var dataForMonEngUnit =[];
var dataForMonEngAll = [];
var unitEngChgChart;
var allEngChgChart;

var beforeYear = '';
var requestData = {};
var _year = (new Date).getFullYear().toString();

var optionMonEngUnit = {
    title: {
        text: '单位能耗变化趋势',
        left:'center'
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    legend: {
        data:[],
        top : 30
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            magicType : {show: true, type: ['line', 'bar']},
            dataView : {readOnly:false},
            saveAsImage : {show: true}
        },
        right:'3%'
    },
    xAxis : [
        {
            type : 'category',
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            name :'月份',
            nameGap : 5
        }
    ],
    yAxis : [
        {
            type : 'value',
            name: '单位使用能耗(单位：万吨标准煤/亿人公里或万吨标准煤/亿吨公里)',
            nameLocation:'middle',
            nameGap:'40',
            axisLabel: {
                formatter: '{value}'
            },
            axisPointer: {
                snap: true
            }
        }
    ],
    series : []

};

var optionMonEngAll = {
    title: {
        text: '总能耗变化趋势',
        left:'center'
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    legend: {
        data:[],
        top : 30
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            magicType : {show: true, type: ['line', 'bar']},
            dataView : {readOnly:false},
            saveAsImage : {show: true}
        },
        right:'3%'
    },
    xAxis : [
        {
            type : 'category',
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
            name :'月份',
            nameGap : 5
        }
    ],
    yAxis : [
        {
            type : 'value',
            name: '能耗(单位：万吨标准煤)',
            axisLabel: {
                formatter: '{value}'
            },
            axisPointer: {
                snap: true
            }
        }
    ],
    series : []

};

function setData(res){
    var monEngMap ={};
    var monEngUnitSeries =[];
    var monEngAllSeries =[];

    var xAisMon = [_year+'-01',_year+'-02',_year+'-03',_year+'-04',_year+'-05',_year+'-06',
            _year+'-07',_year+'-08',_year+'-09',_year+'-10',_year+'-11',_year+'-12']
    
    res.traTypOther.forEach(function(element){ 
        element.traTypMo.forEach(function(e2){
            if(!monEngMap[element.baseTyp])
                monEngMap[element.baseTyp] ={};
            if(!monEngMap[element.baseTyp][e2.type])
                monEngMap[element.baseTyp][e2.type] =[0,0];
            var t = monEngMap[element.baseTyp][e2.type];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            monEngMap[element.baseTyp][e2.type] =t;
        });
    });
    res.xs[1].forEach(function(element){
        var tmpUnitEngDatas = [];
        var tmpAllEngDatas =[];
        if(!monEngMap[element]){
            var tmpSeriseObj = {
                name:element,
                type:'line',
                data:[]
            };
            monEngUnitSeries.push(tmpSeriseObj);
            monEngAllSeries.push(tmpSeriseObj);
        }else{
            xAisMon.forEach(function(e2){
                var t = monEngMap[element][e2];   
                if(t){
                    tmpUnitEngDatas.push((t[0]/t[1]).toFixed(2))
                    tmpAllEngDatas.push((t[0]/10000).toFixed(2));
                }else{
                    tmpUnitEngDatas.push(0);
                    tmpAllEngDatas.push(0);
                }
            });
            var tmpSeriseObj={
                name:element,
                type:'line',
                data:tmpUnitEngDatas
            };
            monEngUnitSeries.push(tmpSeriseObj);
            tmpSeriseObj={
                name:element,
                type:'line',
                data:tmpAllEngDatas
            };
            monEngAllSeries.push(tmpSeriseObj);

        }
    });

    dataForMonEngUnit.splice(0,dataForMonEngUnit.length);
    dataForMonEngUnit.push(res.xs[1]);
    dataForMonEngUnit.push(res.xs[0]);
    dataForMonEngUnit.push(monEngUnitSeries);

    dataForMonEngAll.splice(0,dataForMonEngAll.length);
    dataForMonEngAll.push(res.xs[1]);
    dataForMonEngAll.push(res.xs[0]);
    dataForMonEngAll.push(monEngAllSeries);
};



export default {
    data(){
        return {
            year:'',
            pickerOptions0: {
                disabledDate(time) {
                    if((new Date()).getMonth==0)
                        return time.getFullYear()>=(new Date()).getFullYear();
                    else
                        return time.getFullYear()>(new Date()).getFullYear();
                }
            }
        }
    },
    methods:{
        initRequestData(requestData){
            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth()-1;
            if(month<=0){
                year -= 1;
            }
            var token = getCookie('token');
            var userInfo = JSON.parse(getCookie('userInfo'));
            requestData.token = token;
            requestData.username = userInfo.name;
            if(userInfo.roleName!=null && userInfo.roleName!="")
                requestData.roleName = userInfo.roleName;
            requestData.roleType = userInfo.roleType;
            if(userInfo.place1!=null && userInfo.place1!="")
                requestData.place1 =userInfo.place1;
            if(userInfo.place2!=null && userInfo.place2!="")
                requestData.place2 = userInfo.place2;          
            this.selectYearMonth(year);
           
        },
        getDataFromService(requestData){
            console.log(requestData);
            var _this = this;
            unitEngChgChart.showLoading({text:'加载中'});
            allEngChgChart.showLoading({text:'加载中'});
            $.get(this.Constant.ajaxAddress+this.Constant.engchangeAjax,requestData).
            done(function (res){
                unitEngChgChart.hideLoading();
                allEngChgChart.hideLoading();
                if(res.errCode==30){//data ok
                    setData(res);
                    optionMonEngUnit.legend.data = dataForMonEngUnit[0];
                   // optionMonEngUnit.xAxis[0].data = dataForMonEngUnit[1];
                    optionMonEngUnit.series = dataForMonEngUnit[2];
                    unitEngChgChart.clear();
                    unitEngChgChart.setOption(optionMonEngUnit);

                    optionMonEngAll.legend.data = dataForMonEngAll[0];
                   // optionMonEngAll.xAxis[0].data = dataForMonEngAll[1];
                    optionMonEngAll.series = dataForMonEngAll[2];
                    allEngChgChart.clear();
                    allEngChgChart.setOption(optionMonEngAll);
                }else if(res.errCode==31){ // data err
                    _this.$message({
                        showClose: true,
                        message: '获取数据失败，请稍后再试',
                        type: 'error',
                        duration:2500
                    });
                }else if(res.errCode==44){ // auth 
                    _this.$router.push('/login');
                }

            });

        },
        selectYearMonth(y){

            if(!y||y=='')
                return ;
            optionMonEngAll.title.text= y+"年总能耗变化趋势";
            optionMonEngUnit.title.text = y+"年单位能耗变化趋势";
            _year = y;
            var date = new Date();
            var year = date.getFullYear();
            if(year==y){
                var month = date.getMonth().toString();
                y = y+'-01-01:'+y+'-'+month+'-31';
            }else{
                y = y +'-01-01:'+y+'-12-31';
            }
            requestData.timeRange=y;
            
            this.getDataFromService(requestData);
        }    
    },
    mounted:function(){
        unitEngChgChart = echarts.init(document.getElementById('unitEngChgChart'));
        unitEngChgChart.setOption(optionMonEngUnit);
        allEngChgChart = echarts.init(document.getElementById('allEngChgChart'));
        allEngChgChart.setOption(optionMonEngAll);

 /*       window.addEventListener("resize",function(){
            unitEngChgChart.resize();
            allEngChgChart.resize();
        });
*/
        this.initRequestData(requestData);
        //this.getDataFromService(requestData);
    },
    updated:function(){
        console.log("update");
    }
}
</script>



<style scoped lang="scss">
    .chart {
        width: 1100px;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
             border-radius: 8px;
            .chart-header{
                float: right;
                margin-right: 20px;
                position: relative;
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 20px 20px;
    }

    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>



