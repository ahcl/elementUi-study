<template>
    <section  class="chart">
        <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="endDate"
                        type="month"
                        placeholder="结束年月"
                        @change="selectOther"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div>
                <div class="chart-header">
                    <el-date-picker
                        v-model="beginDate"
                        type="month"
                        placeholder="起始年月"
                        @change="selectOther"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </div>
                
                <div class="chart-header2">
                    统计期：{{ countDate }}
                </div>
             </el-col>
        </el-row>
        <el-row >
            <el-col  class="chart-container">
                   <div id="engTypeAllChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>

        </el-row>


        <el-row>
           <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="carTypeChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
                <div id="distanceChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>  
        </el-row>


        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engTypeChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>


        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engClsChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>


    </section>  
</template>

<script>

import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';
var dataForMoth = [];//年度图表
var dataForEngCls = [];//能源车长
var dataForEngPer = [];//各能源类型单耗
var dataForEngAll = [];//各能源饼图
    var dataForCarPer = [];//车辆类型
    var dataForDisPer =[];//运距类型
var k = 3;//标志

var perAllRelChart;
var engTypeAllChart;
var engTypeChart;
var engClsChart;
var carTypeChart;
var distanceChart;


var _year = (new Date).getFullYear().toString();
var requestData = 
{
    /*username:this.$userInfo.username,
    roleName:'enterprice',
    roleType:'R_TRA',
    place1:'杭州',
    place2:'江干',
    timeRange:'2017-01-01:2017-12-30',
    token : this.$token*/
}




var colors = ['#5793f3', '#d14a61'];

let optionPi={
    title:{
        text: '公交车能源结构图',
        subtext:'单位：吨标准煤',
        x: 'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ["柴油","汽油","电","混合燃料","液化石油气","液化天然气","其他"]
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},                 
            dataView : {show: true, readOnly: false},
            saveAsImage : {show: true},
            // magicType : {show: true, type: ['line', 'bar']},
        },
      
        right:'4%'
    },
    series : [
        {
            name: '能耗',
            type: 'pie',
            radius : '80%',
            center: ['50%', '55%'],
            data:[
                {value:335, name:'柴油'},
                {value:310, name:'汽油'},
                {value:234, name:'电能'},
                {value:335, name:'混合燃料'},
                {value:310, name:'液化石油气'},
                {value:234, name:'液化天然气'},
                 {value:234, name:'其他'}
                ],
        }
    ]
};

var optionEng = {
    title: {
        text: '相同燃料类型不同长度车辆单位能耗柱状图',
        left:'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer : {            
            type : 'shadow'        
        }
    },
    color:["#61A0A8"],
    legend: {
        // orient: 'vertical',
        //y:'bottom',
        // x:'center',
        data:[]
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {readOnly:false},
            saveAsImage : {show: true}
                            
        },
        right:'3%'
    },
    xAxis: {
        data: ["<4","4-7","7-9","9-12","12-14","14-17",">17"],
        name:'车辆长度',
        nameGap:'5'
    },
    yAxis: {
        name:'单位能耗(万吨标煤/亿人公里)',
        nameLocation:'middle',
        nameGap:'40'
    },
    series : [
        
        {
            name:'单耗',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,46,35,64,77,66],
            itemStyle: { normal: {label : {show: true, position: 'top'}}},
        }
    ]
};

let optionClsEng = {
    title: {
        text: '不同燃料类型不同长度车长单位能耗柱状图',
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
        data:["<4","4-7","7-9","9-12","12-14","14-17",">17"],
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
            data : ["柴油","汽油","电","混合燃料","液化石油气","液化天然气","其他"],
            name:'燃料类型',
            nameGap:'5'
        }
    ],
    yAxis : [
        {
            type : 'value',
            nameLocation : 'middle',
            name : '单位能耗(单位：万吨标准煤/亿人公里)',
            nameGap : 35
        }
    ],
    series : [
         {
            name:'<4',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,46,35,64,77,66]
        },
         {
            name:'4-7',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,33,35,64,22,14]
        },
         {
            name:'7-9',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,44,35,33,44,66]
        },
         {
            name:'9-12',
            type:'bar',
            barMaxWidth:'60%',
            data:[55,36,52,35,64,77,66]
        },
         {
            name:'12-14',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,36,35,34,73,64]
        },
         {
            name:'14-17',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,56,35,34,77,66]
        },
         {
            name:'>17',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,56,55,64,37,66]
        }
    ]
};
var optionCarType={
        title:{
            text: '相同燃料类型不同停等时间单位能耗统计图',
            left:'center'
        },
        color:["#D48265"],
        grid:{
            left:55,
            right:50
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            
                type : 'shadow'        
            }
        },
        legend: {
            data:[]
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {readOnly:false},
                saveAsImage : {show: true}
                                
            },
            right:'4%'
        },
        xAxis: {
            data: [20,40,60,80,100],
            name:'停等时间',
            nameGap:'2',
            axisLabel: {
                interval: 0,
                rotate: 30
            },
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿人公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'单耗',
                type:'bar',
                barMaxWidth:'60%',
                data:[13,53,66,77,88],
                itemStyle: { normal: {label : {show: true, position: 'top'}}},
            }
        ]
    };
    var optionDistance={
        title:{
            text: '相同车辆不同运距车辆单位能耗统计图',
            left:'center'
        },
        grid:{
            left:55,
            right:50
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            
                type : 'shadow'        
            }
        },
        legend: {
            data:[]
        },
        toolbox: {
            show : true,
            feature : {
            mark : {show: true},
            dataView : {readOnly:false},
            saveAsImage : {show: true}
                                
            }
        },
        xAxis: {
            data: ["<40","40-80","80-120",">125"],
            name:'运输距离',
            nameGap:'2'
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿人公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'单耗',
                type:'bar',
                barMaxWidth:'60%',
                data:[110,223,442,532],
                 itemStyle: { normal: {label : {show: true, position: 'top'}}},
            }
        ]
    };


import echarts from 'echarts'
export default {
    data(){
        return {
            beginDate:'',
            endDate:'',
            countDate:'',
            year:'',
            pickerOptions0: {
                disabledDate(time) {
                    if(time.getFullYear()>(new Date()).getFullYear())
                        return true;
                    if(time.getFullYear()==(new Date()).getFullYear())
                        return time.getMonth() >= (new Date()).getMonth();
                    else
                        return false;        
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    if(time.getFullYear()>(new Date()).getFullYear())
                        return true;
                    if(time.getFullYear()==(new Date()).getFullYear())
                        return time.getMonth() >= (new Date()).getMonth();
                    else
                        return false;        
                }
            },
            pickerOptions2: {
                disabledDate(time) {
                    if((new Date()).getMonth==0)
                        return time.getFullYear()>=(new Date()).getFullYear();
                    else
                        return time.getFullYear()>(new Date()).getFullYear();
                }
            }
        }
    },
    methods: {

        initRequestData(requestData){
            var date = new Date;
            var year = date.getFullYear().toString();
            var month = date.getMonth();
            if(month==0){
                year = year -1;
                month = 12;
            }else{
                if(month>=1 && month<=9)
                    month = '0'+month;
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
            requestData.timeRange = year+'-'+month+'-01:'+year+'-'+month+'-31';
                requestData.beginDate = year+'-'+month ;//this.beginDate;
                requestData.endDate = year+'-'+month; //this.endDate;
            this.countDate = year+'年'+month+'月';
            //this.bus();
        },
        bus(){
                var _this = this;
                 // console.log('requestData1111:',requestData);
                 optionPi.series[0].data = [];
                // optionScale.series[0].data = [];
                // optionScale.yAxis[0].data = [];
                //optionPi.legend.data = [];
                //token:_this.$token,userId:_this.$userInfo.id,beginDate:'2017-07',endDate:'2017-11'
                console.log("0--0-0-0-0--0-----:",requestData);
                $.get(this.Constant.ajaxAddress+'/bus0.json',requestData).done(function(data){
                      console.log("--------000",data);
                    if(data.errCode == 30){
                        
                          var mrrptelist = data.mrrptelist;
                          if(mrrptelist.length >= 1){
                              for(var i=0;i<mrrptelist.length;i++){
                                    if('客运总量(万人次)' != mrrptelist[i].index_name){
                                        optionPi.series[0].data.push({
                                        value:mrrptelist[i].busTotalConsumption,
                                        name:mrrptelist[i].index_name
                                        });
                                    }
                                 // optionScale.series[0].data.push(mrrptelist[i].busTotalCount);
                                 // optionScale.yAxis[0].data.push(mrrptelist[i].index_name);
                                 //optionPi.legend.data.push(mrrptelist[i].index_name);
                            }
                        }
                            //_this.tableData=data.tableData;
            
                          //optionScale.yAxis[0].name = _this.countDate;
                          
                            engTypeAllChart.clear();
                            engTypeAllChart.setOption(optionPi);
                            engTypeChart.setOption(optionEng);
                            engClsChart.setOption(optionClsEng);
                            distanceChart.setOption(optionDistance);
                            carTypeChart.setOption(optionCarType);
                     }else if(data.errCode==31){
                                _this.$message.error('获取数据失败，未知错误！'); 
                            }else if(data.errCode==44)
                                _this.$router.push('/login');
                    });
                
            
            },
        selectOther(){
            k = 1;
            if(this.beginDate=='' && this.endDate==''){
                this.initRequestData(requestData);
            }
            if(this.beginDate!='' && this.endDate!=''){
                if(this.beginDate > this.endDate){
                    this.$message({
                        showClose: true,
                        message: '起始年月不能大于结束年月',
                        type: 'warning',
                        duration:2500
                    });
                    return;
                }
                var by = this.beginDate.getFullYear();
                var bm = this.beginDate.getMonth()+1;
                if(bm>=1 && bm <=9)
                    bm = '0'+bm;
                if(this.beginDate == this.endDate){
                    requestData['timeRange'] = by + '-' + bm +'-01:' + by + '-' +bm + '-31';
                    this.countDate = by+'年'+bm+'月';
                }else{
                    var ey = this.endDate.getFullYear();
                    var em = this.endDate.getMonth()+1;
                    if(em>=1 && em <=9)
                        em = '0'+em;
                    requestData['timeRange'] = by + '-' + bm +'-01:' + ey + '-' + em + '-31';
                    requestData.beginDate = by + '-' + bm ;//this.beginDate;
                    requestData.endDate = ey + '-' + em; //this.endDate;
                    this.countDate = by+'年'+bm+'月 至 '+ey+'年'+em+'月';
                }
                //this.getDataFromService(requestData);
                this.bus();
            }
        },
        selectYearMonth(y){
            k =2;

            if(!y||y=='')
                return ;
            
            _year = y;
            var date = new Date();
            var year = date.getFullYear();
            if(year==y){
                var month = date.getMonth().toString();
                y = y+'-01-01:'+y+'-'+month+'-31';
            }else{
                y = y +'-01-01:'+y+'-12-31';
            }
            requestData['timeRange']=y;
            
            //this.getDataFromService(requestData);
        }
    },
    mounted:function()
    {

      //  perAllRelChart = echarts.init(document.getElementById('perAllRelChart'));
        engTypeAllChart = echarts.init(document.getElementById('engTypeAllChart'));
        engTypeChart = echarts.init(document.getElementById('engTypeChart'));
        engClsChart =  echarts.init(document.getElementById('engClsChart'));
        distanceChart = echarts.init(document.getElementById('distanceChart'));
        carTypeChart = echarts.init(document.getElementById('carTypeChart'));


       // perAllRelChart.setOption(option);
        this.initRequestData(requestData);
        
        //this.getDataFromService(requestData);

       /* window.addEventListener("resize",function(){
            perAllRelChart.resize();
            engTypeAllChart.resize();
            engTypeChart.resize();
            engClsChart.resize();
                carTypeChart.resize();
                distanceChart.resize();
        });*/
    },
    updated: function () {
        console.log("update");
    }
  }
</script>


<style scoped lang="scss">
    .chart {
        width: 100%;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
             border-radius: 8px;
            .chart-header{
                float: right;
                margin-right: 20px;
                position: relative;
            }
            .chart-header2{
                float: left;
                font-weight:500;
                margin-left: 20px;
                top:10px;
                position: relative;
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }

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



