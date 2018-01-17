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
        <!-- <el-row >
            <el-col  class="chart-container">
                   <div id="engTypeAllChart" style="width:100%; height:400px;" class="chart-content"></div>
            </el-col>
        </el-row> -->
        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engTypeChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="engPsChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
         <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="timeChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
         <el-row >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" class="chart-container">
                <div id="carWeightChart" style="width:100%;height:400px;" class="chart-content"></div>
            </el-col>
        </el-row>
        
        <!-- <el-row>
             <el-col  class="chart-container">
                <div  class="chart-header">
                    <el-date-picker
                        v-model="year"
                        type="year"
                        placeholder="选择年"
                        @change="selectYearMonth"
                        :picker-options="pickerOptions2">
                    </el-date-picker>
                </div>
                <div id="perAllRelChart" style="width:100%; height:400px;" class="chart-content"></div>
             </el-col>
        </el-row> -->
    </section>  
</template>

<script>

import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';

var dataForMoth = [];//年度图表
var dataForEngPs = [];//排量车长
var dataForEngPer = [];//各能源类型单耗
var dataForEngAll = [];//各能源饼图
var k = 1;//标志

var perAllRelChart;
var engTypeAllChart;
var engTypeChart;
var engPsChart;
var timeChart;
var carWeightChart;

var _year = (new Date).getFullYear().toString();



var requestData = 
{
    /*username:'zwp',
    roleName:'enterprice',
    roleType:'R_TRA',
    place1:'杭州',
    place2:'江干',
    timeRange:'2017-01-01:2017-12-30'*/
}



var colors = ['#5793f3', '#d14a61'];
var optionCarWeight = {
    title: {
        text: '相同车辆不同空重车比单位能耗柱状图',
        subtext:'',
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
        data:['<1','1-1.5','1.5-2','>2'],
        // left:20,
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
            data : ['汽油','柴油','天然气','混合汽油'],
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
            name:'<1',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,33,22,11]
        },
         {
            name:'1-1.5',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,32,25,11]
        },
         {
            name:'1.5-2',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,38,12,11]
        },
         {
            name:'>2',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,33,42,11]
        }
    ]
};



var optionTime =  {
    title: {
        text: '相同燃料类型不同拥堵时间单位能耗柱状图',
        subtext:'',
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
        data:['<1.4h','1.4h-1.6h','1.6h-1.8h','>1.8h'],
        // left:20,
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
            data : ['汽油','柴油','天然气','混合汽油'],
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
            name:'<1.4h',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,33,22,11]
        },
         {
            name:'1.4h-1.6h',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,32,25,11]
        },
         {
            name:'1.6h-1.8h',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,38,12,11]
        }
        ,
         {
            name:'>1.8h',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,33,42,11]
        }
    ]
};



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
            name: '月使用能耗(吨标准煤)',
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
            name: '单位能耗(万吨标准煤/亿人公里)',
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
let optionPi={
    title:{
        text: '出租车能源结构图',
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
            center: ['50%', '60%'],
            data:[],
        }
    ]
};

var optionEng = {
    title: {
        text: '不同燃料类型单位能耗柱状图',
        left:'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer : {            
            type : 'shadow'        
        }
    },

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
        data: ['汽油','柴油','天然气','混合汽油'],
        name:'燃料类型',
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
            data:[12,33,222,11]
        }
    ]
};

let optionClsEng = {
    title: {
        text: '不同燃料类型不同排量车辆单位能耗柱状图',
        // subtext:'排量单位 : 升',
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
        data:['<1.4','1.4-1.6','1.6-1.8','>1.8'],
        // left:20,
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
            data : ['汽油','柴油','天然气','混合汽油'],
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
            name:'<1.4',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,33,22,11]
        },
         {
            name:'1.4-1.6',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,32,25,11]
        },
         {
            name:'1.6-1.8',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,38,12,11]
        }
        ,
         {
            name:'>1.8',
            type:'bar',
            barMaxWidth:'60%',
            data:[12,33,42,11]
        }
    ]
};

function  setData(res){
    console.log(res);

    var monthData = new Object();
    var psEngMap = {};
    var engerData = {};
    var month_all = new Array();//周转量
    var month_per = new Array();// eng_cl_e / eng_cl_l ;
    var eng_type_all = new Array();//能耗总和
    var eng_all_for_PI = [];
    var eng_per = [];

    var engClsSeries = [];

    var xAisMon = [_year+'-01',_year+'-02',_year+'-03',_year+'-04',_year+'-05',_year+'-06',
            _year+'-07',_year+'-08',_year+'-09',_year+'-10',_year+'-11',_year+'-12']

    //遍历计算
    res.engTypOther.forEach(function(element) {
        //month data
        element.engTypMo.forEach(function(e2){
            var t = monthData[e2.type];
            if(!t) t = [0,0];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            monthData[e2.type] = t;
        });

        //psEngMap
        element.engTypPs.forEach(function(e2){
            if(!psEngMap[e2.type])
                psEngMap[e2.type] = {};
            if(!psEngMap[e2.type][element.baseTyp])
                    psEngMap[e2.type][element.baseTyp] = [0,0];
            
            var t = psEngMap[e2.type][element.baseTyp];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            psEngMap[e2.type][element.baseTyp] = t;

            // cal engall
            var t = engerData[element.baseTyp];
            if(!t) t = [0,0];
            t[0] += e2.typDatOfAllEng;
            t[1] += e2.typDatOfAllLen;
            engerData[element.baseTyp] = t;                   
        });
    });



    //准备能源类型数据
    res.xs[1].forEach(function(e1){
        var t = engerData[e1];
        if(t)
        {
            eng_all_for_PI.push({name:e1,value:(t[0]).toFixed(2)})
            eng_per.push((t[0]/t[1]).toFixed(2))
        }else{
            //eng_all_for_PI.push({name:e1,value:0})
            eng_per.push(0)
        }
    });



    res.xs[2].forEach(function(i){
        var tmpEngDatas = [];
        console.log('psEngMap i = ');
        if(!psEngMap[i])
        {
            var tmpSeriseObj = {
                        name:i,
                        type:'bar',
                        data:[]
                };
            engClsSeries.push(tmpSeriseObj);
               
        }else
        {
            res.xs[1].forEach(function(e1){
                var t = psEngMap[i][e1];
                if(t)
                {
                    tmpEngDatas.push((t[0]/t[1]).toFixed(2))
                }else{
                    //eng_all_for_PI.push({name:e1,value:0})
                    tmpEngDatas.push(0);
                }
            });
            var tmpSeriseObj = {
                                    name:i,
                                    type:'bar',
                                    data:tmpEngDatas
                            };
            engClsSeries.push(tmpSeriseObj);
        }

    });







    

    if( k == 1 ||k==3 )
    {
        dataForEngAll.splice(0,dataForEngAll.length);
        dataForEngAll.push(res.xs[1]);
        dataForEngAll.push(eng_all_for_PI);

        dataForEngPer.splice(0,dataForEngPer.length);
        dataForEngPer.push(res.xs[1]);
        dataForEngPer.push(eng_per);

        dataForEngPs.splice(0,dataForEngPs.length);
        dataForEngPs.push(res.xs[2]);
        dataForEngPs.push(res.xs[1]);
        dataForEngPs.push(engClsSeries);
    }
    // engMonth
    xAisMon.forEach(function(e1){
        var t = monthData[e1];
        if(t) 
        {
            console.log(t);
            month_all.push((t[0]).toFixed(2));
            month_per.push((t[0]/t[1]).toFixed(2));
        }else
        {
            month_all.push(0);
            month_per.push(0);
        }
    });
    if( k == 2 )
    {
        dataForMoth.splice(0,dataForMoth.length);
        dataForMoth.push(res.xs[0]);
        dataForMoth.push(month_all);
        dataForMoth.push(month_per); 
    }

}  




import echarts from 'echarts'
export default {
    data(){
        return {
            year:'',
            countDate: '',
            beginDate:'',
            endDate:'',
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
                engTypeAllChart.showLoading({text:'加载中'});
                engPsChart.showLoading({text:'加载中'});
                engTypeChart.showLoading({text:'加载中'});
            }
            if(k==1||k==2){
                perAllRelChart.showLoading({text:'加载中'});
            }
            $.get(this.Constant.ajaxAddress+this.Constant.taxitranAjax,requestData).
            done(function (res){
                if(k==1||k==3){
                    engTypeAllChart.hideLoading();
                    engPsChart.hideLoading();
                    engTypeChart.hideLoading();
                }
                if(k==2){
                    perAllRelChart.hideLoading();
                }
                if(res.errCode==30){//data ok
                    setData(res);
                    if(k==1||k==3)
                    {  
                        //optionPi.legend.data = dataForEngAll[0];
                        optionPi.series[0].data = dataForEngAll[1];
                        engTypeAllChart.clear();
                        engTypeAllChart.setOption(optionPi);

                        optionClsEng.legend.data = dataForEngPs[0];
                        optionClsEng.xAxis[0].data = dataForEngPs[1];
                        optionClsEng.series = dataForEngPs[2];
                        engPsChart.clear();
                        engPsChart.setOption(optionClsEng);

                        //optionEng.legend.data = res.xs[1];
                        optionEng.xAxis.data =  dataForEngPer[0];
                        optionEng.series[0].data = dataForEngPer[1];
                        engTypeChart.clear();
                        engTypeChart.setOption(optionEng);
                    }
                    if(k ==2){
                        //option.xAxis[0].data =  dataForMoth[0];
                        option.series[1].data = dataForMoth[2];
                        option.series[0].data = dataForMoth[1];
                        perAllRelChart.clear();
                        perAllRelChart.setOption(option);
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
    mounted:function()
    {

        //perAllRelChart = echarts.init(document.getElementById('perAllRelChart'));
        //engTypeAllChart = echarts.init(document.getElementById('engTypeAllChart'));
        engTypeChart = echarts.init(document.getElementById('engTypeChart'));
        engPsChart =  echarts.init(document.getElementById('engPsChart'));
        timeChart = echarts.init(document.getElementById('timeChart'));
        carWeightChart = echarts.init(document.getElementById('carWeightChart'));

        //perAllRelChart.setOption(option);
        //engTypeAllChart.setOption(optionPi);
        engTypeChart.setOption(optionEng);
        engPsChart.setOption(optionClsEng);
        timeChart.setOption(optionTime);
        carWeightChart.setOption(optionCarWeight);

       window.addEventListener("resize",function(){
            //perAllRelChart.resize();
            //engTypeAllChart.resize();
            engTypeChart.resize();
            engPsChart.resize();
            timeChart.resize();
            carWeightChart.resize();
        });
	
        this.initRequestData(requestData);
        //this.getDataFromService(requestData);

        
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