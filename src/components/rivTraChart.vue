<template>
    <section class="chart">
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
        <!-- <el-row> 
            <el-col :xs="24" :sm="24" :md="24" :lg="12" class="chart-container">                
                <div id="energyPieChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" class="chart-container">                
                <div id="companyChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>   
        </el-row> -->
        <el-row>
            <el-col :sapn="24" class="chart-container">                
                <div id="distanceShipChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>     
        </el-row>
          <el-row>
             
               <el-col :span="24"  class="chart-container">                
                <div id="passagerShipChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col> 
        </el-row>
          <el-row> 
            <el-col  class="chart-container">                
                <div id="shipTypeChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
              
        </el-row>
         <el-row> 
            <el-col class="chart-container">                
                <div id="enterChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row> 
            <el-col  class="chart-container">                
                <div id="energyTonnageChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
              
        </el-row>
        <el-row> 
            <el-col class="chart-container">                
                <div id="seaShipChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>   

        <!-- <el-row>
            <el-col class="chart-container">
                <div class="chart-header">
                    <el-date-picker
                        v-model="year"
                        align="right"
                        type="year"
                        placeholder="选择年"
                        @change="selectYearMonth"
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                </div>
                <div id="energyByYearChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>    -->
    </section>
</template>

<script>
    import echarts from 'echarts'
    import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';
    var dataForMoth = [];//年度图表
    var dataForScalePer = [];//各规模企业类型单耗
    var dataForEngTog = [];//能源吨位
    var dataforTogShip =[];//吨位船舶类型
    var dataForEngAll = [];//各能源饼图
    var k=3; //标志

    var shipTypeMap;

    var energyPieChart;
    var energyTonnageChart;
    var energyByYearChart;
    var companyChart;
    var seaShipChart;
    var distanceShipChart;
    var passagerShipChart;
    var shipTypeChart;
    var enterChart;

    var _year = (new Date).getFullYear().toString();
    
    var requestData = {};

    var colors = ['#5793f3', '#d14a61'];
    var option = {
        color:colors,
        title:{
            text:'年度单耗、使用能耗关系图',
            left:'center'

        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
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
        legend: {
            data:['月使用能耗','单位能耗'],
            top : 20
        },
        xAxis: [
            {
                type: 'category',
                axisPointer: {
                    type: 'shadow'
                },
                name:'月份',
                nameGap:'20',
                data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '月使用能耗(万吨标准煤)',
                axisLine: {
                    lineStyle: {
                        color: '#5793f3'
                    }
                },
                axisLabel: {
                    formatter: '{value} '
                }
            },
            {
                type: 'value',
                name: '单位能耗(万吨标准煤/亿吨公里)',
                nameGap : 35,
                nameLocation:'middle',
                axisLine: {
                    lineStyle: {
                        color: '#d14a61'
                    }
                },
                axisLabel: {
                    formatter: '{value} '
                }
            }
        ],
        series: [
            {
                name:'月使用能耗',
                type:'line'
            },
            {
                name:'单位能耗',
                type:'bar',
                yAxisIndex: 1
            }
        ]
    };
    var optionPi={
        title:{
            text: '内河运输能源结构图',
            subtext:'单位：万吨标准煤',
            x: 'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: []
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},                 
                dataView : {show: true, readOnly: false},
                saveAsImage : {show: true},
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
                    {value:335, name:'煤油'},
                    {value:234, name:'电能'},
                    {value:234, name:'其他'}
                    ],
            }
        ]

    };
    var optionScale={
        title:{
            text: '不同规模企业单位能耗柱状图',
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
                                    
            },
            right:'4%'
        
        },
        xAxis: {
            data: ["<5","5-10","10-15","15-20","20-25",">25"],
            name:'企业规模/船舶数（单位：艘）',
            nameLocation:'middle',
            nameGap:'25'
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿吨公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'单耗',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            }
        ]
    };
    var optionEngTog={
        title: {
            text: '不同燃料类型不同吨位船舶单位能耗柱状图',
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
            data:["柴油","汽油","电能","煤油","其他"],
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
                data :  ["柴油","汽油","电能","煤油","其他"],
                name:'燃料类型',
                nameGap:'2'
            }
        ],
        yAxis : [
            {
                type : 'value',
                nameLocation : 'middle',
                name : '单位能耗(单位：万吨标准煤/亿吨公里)',
                nameGap : 35
            }
        ],
        series : [
             {
            name:'柴油',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,46,35,64,77,66]
        },
         {
            name:'汽油',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,33,35,64,22,14]
        },
         {
            name:'电能',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,44,35,33,44,66]
        },
         {
            name:'煤油',
            type:'bar',
            barMaxWidth:'60%',
            data:[55,36,52,35,64,77,66]
        },
         {
            name:'其他',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,36,35,34,73,64]
        }
        ]
    };
    var optionTogShip={
        title: {
            text: '不同类型船舶不同吨位单位能耗柱状图',
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
            data:['<500','500-1000','1000-1500','1500-2000','2000-2500','>2500'],
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
                // data : ['<500','500-1000','1000-1500','1500-2000','2000-2500','>2500'],
                data:["普通客船","客货船","客渡船","车客渡船","旅游客船","高速客船"],
                name:'吨位',
                nameGap:'2'
            }
        ],
        yAxis : [
            {
                type : 'value',
                nameLocation : 'middle',
                name : '单位能耗(单位：万吨标准煤/亿吨公里)',
                nameGap : 35
            }
        ],
        series : [
               {
            name:'>500',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,46,35,64,77,66]
        },
         {
            name:'500-1000',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,33,35,64,22,14]
        },
         {
            name:'1000-1500',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,44,35,33,44,66]
        },
         {
            name:'1500-2000',
            type:'bar',
            barMaxWidth:'60%',
            data:[55,36,52,35,64,77,66]
        },
         {
            name:'2000-2500',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,66,36,35,34,73,64]
        },
        {
            name:'>2500',
            type:'bar',
            barMaxWidth:'60%',
            data:[15,33,36,25,34,73,64]
        }
        ]
    };

    var optionenter = {
        title:{
            text: '相同吨位不同企业规模单位能耗统计图',
            left:'center',
            top:-5
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
            top:20,
            data:['<1.5','1.5-2','2-2.5','>2.5'],
            name: '相同吨位不同运距单位能耗统计图',
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
            data: ["<5","5-10","10-15","15-20","20-25",">25"],
            name:'吨位',
            nameLocation:'middle',
            nameGap:'25'
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿吨公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'<1.5',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            },
              {
                name:'1.5-2',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            },
              {
                name:'2-2.5',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            },
              {
                name:'>2.5',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            }
        ]
    };
    
      var optionDis = {
        title:{
            text: '相同吨位不同企业规模单位能耗统计图',
            left:'center',
            top:-5
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
            top:20,
            data:['<10','10-20','20-30','>30'],
            // name: '相同吨位不同运距单位能耗统计图',
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
            data: ["<5","5-10","10-15","15-20","20-25",">25"],
            name:'吨位',
            nameLocation:'middle',
            nameGap:'25'
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿吨公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'<10',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            },
              {
                name:'10-20',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            },
              {
                name:'20-30',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            },
              {
                name:'>30',
                type:'bar',
                barMaxWidth:'60%',
                data:[23,22,11,22,3,22]
            }
        ]
    };

    var optionPassager = {
        title:{
            text: '不同燃料类型船舶单位能耗统计图',
            left:'center'
        },
        grid:{
            left:55,
            right:50
        },
        // color:["#91C7AE"],
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
            // data: ["<5","5-10","10-15","15-20","20-25",">25"],
            data:["柴油","汽油","电能","煤油","其他"],
            name:'燃料类型',
            nameLocation:'middle',
            nameGap:'25'
        },
        yAxis: {
            name:'单位能耗(万吨标煤/亿吨公里)',
            nameLocation:'middle',
            nameGap:'40'
        },
        series : [
            {
                name:'单耗',
                type:'bar',
                barMaxWidth:'45%',
                data:[23,22,11,22,15]
            }
        ]
    };

    var optionshipType = {
            title:{
                text: '相同燃料类型不同经营范围船舶单位能耗',
                left:'center'
            },
            grid:{
                left:55,
                right:50
            },
            // color:["#61A0A8"],
            tooltip: {
                trigger: 'axis',
                axisPointer : {            
                    type : 'shadow'        
                }
            },
            legend: {
                top:30,
                data:["普通客船","客货船","客渡船","车客渡船","旅游客船","高速客船"],
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
                data: ["柴油","汽油","电能","煤油","其他"],
                name:'燃料类型',
                nameLocation:'middle',
                nameGap:'25'
            },
            yAxis: {
                name:'单位能耗(万吨标煤/亿吨公里)',
                nameLocation:'middle',
                nameGap:'40'
            },
            series : [
                {
                    name:'普通客船',
                    type:'bar',
                    barMaxWidth:'60%',
                    data:[23,12,11,22,3,22]
                },
                {
                    name:'客货船',
                    type:'bar',
                    barMaxWidth:'60%',
                    data:[20,32,11,22,3,22]
                },
                {
                    name:'客渡船',
                    type:'bar',
                    barMaxWidth:'60%',
                    data:[13,26,11,22,3,22]
                },
                {
                    name:'车客渡船',
                    type:'bar',
                    barMaxWidth:'60%',
                    data:[33,22,11,22,3,22]
                },
                {
                    name:'旅游客船',
                    type:'bar',
                    barMaxWidth:'60%',
                    data:[23,21,11,22,3,22]
                },
                {
                    name:'高速客船',
                    type:'bar',
                    barMaxWidth:'60%',
                    data:[23,21,11,22,3,22]
                }
            ]
    };


    export default {
        data() {
            return {
                year:'',
                countDate: '',
                beginDate:'',
                endDate:'',
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },
                pickerOptions2: {
                    disabledDate(time) {
                        if(new Date().getMonth==0)
                            return time.getTime() > Date.now() - 8.64e7;
                        else
                            return time.getTime() > Date.now() + 8.64e7;
                    }
                }
            }
        },
        methods: {
            initRequestData(requestData){
                var date = new Date;
                var year = date.getFullYear();
                var month = date.getMonth()-1;
                if(month<=0){
                    year = year -1;
                    month += 12;
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

                this.countDate = year+'年'+month+'月';
            },
            getDataFromService(requestData){
                var _this = this;
                if(k==1||k==3){
                    energyPieChart.showLoading({text:'加载中'});
                    energyTonnageChart.showLoading({text:'加载中'});
                    companyChart.showLoading({text:'加载中'});
                    seaShipChart.showLoading({text:'加载中'});
                }
                if(k==1||k==2){
                    energyByYearChart.showLoading({text:'加载中'});
                }
                $.get(this.Constant.ajaxAddress+this.Constant.rivertranAjax,requestData).
                done(function (res){
                    if(res.errCode==30){//data ok
                        setData(res);
                        if(k==1||k==3)
                        {

                            energyPieChart.hideLoading();
                            energyTonnageChart.hideLoading();
                            companyChart.hideLoading();
                            seaShipChart.hideLoading();
                            
                            optionPi.series[0].data = dataForEngAll[1];
                            energyPieChart.clear();
                            energyPieChart.setOption(optionPi);

                            optionEngTog.legend.data = dataForEngTog[0];
                            optionEngTog.xAxis[0].data = dataForEngTog[1];
                            optionEngTog.series = dataForEngTog[2];
                            energyTonnageChart.clear();
                            energyTonnageChart.setOption(optionEngTog);

                            optionScale.xAxis.data = dataForScalePer[0];
                            optionScale.series[0].data = dataForScalePer[1];
                            companyChart.clear();
                            companyChart.setOption(optionScale);

                            optionTogShip.legend.data = dataforTogShip[0];
                            optionTogShip.xAxis[0].data = dataforTogShip[1];
                            optionTogShip.series = dataforTogShip[2];
                            seaShipChart.clear();
                            seaShipChart.setOption(optionTogShip);

                            

                        }
                        if(k ==2){
                            energyByYearChart.hideLoading();

                            //option.xAxis[0].data =  dataForMoth[0];
                            option.series[1].data = dataForMoth[2];
                            option.series[0].data = dataForMoth[1];
                            energyByYearChart.clear();
                            energyByYearChart.setOption(option);
                        }
                        if(k==1){
                            var date = new Date;
                            var year = date.getFullYear();
                            var month = date.getMonth()-1;
                            if(month<=0){
                                year -= 1;
                            }
                            _this.selectYearMonth(year);
                        }   
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
            selectOther(){
                k = 1;
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
                        this.countDate = by+'年'+bm+'月 至 '+ey+'年'+em+'月';
                    }
                    this.getDataFromService(requestData);
                }
            },
            selectYearMonth(y){
                k =2;

                if(!y||y=='')
                    return ;
                option.title.text = y +'年度单耗、使用能耗关系图';
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
                
                this.getDataFromService(requestData);
            }     
        },
        mounted: function () {
            

           // energyPieChart = echarts.init(document.getElementById('energyPieChart'));
           // companyChart = echarts.init(document.getElementById('companyChart'));
            energyTonnageChart = echarts.init(document.getElementById('energyTonnageChart'));
            seaShipChart = echarts.init(document.getElementById('seaShipChart'));
           // energyByYearChart = echarts.init(document.getElementById('energyByYearChart'));
            distanceShipChart = echarts.init(document.getElementById('distanceShipChart'));
            passagerShipChart = echarts.init(document.getElementById('passagerShipChart'));
            shipTypeChart= echarts.init(document.getElementById('shipTypeChart'));
            enterChart = echarts.init(document.getElementById('enterChart'));


           // energyPieChart.setOption(optionPi);
            //companyChart.setOption(optionScale);
            energyTonnageChart.setOption(optionEngTog);
            seaShipChart.setOption(optionTogShip);
           // energyByYearChart.setOption(option);
            distanceShipChart.setOption(optionDis);
            passagerShipChart.setOption(optionPassager);
            shipTypeChart.setOption(optionshipType);
            enterChart.setOption(optionenter);
          window.addEventListener("resize",function(){
              //  energyPieChart.resize();
              //  companyChart.resize();
              energyTonnageChart.resize();
              seaShipChart.resize();
              //  energyByYearChart.resize();
              distanceShipChart.resize();
              passagerShipChart.resize();
              shipTypeChart.resize();
              enterChart.resize();
            });

           this.initRequestData(requestData);
          // this.getDataFromService(requestData);
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
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 15px 15px;
    }

    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }
</style>