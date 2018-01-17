<template>
    <section>
        <el-row v-loading="loading"
            element-loading-text="拼命加载中">
            <el-col class="top"> 
                <div class="grid-content" > 
                    <el-cascader
                        :options="options"
                        v-model="selectedOptions"
                        @active-item-change="handleItemChange"
                        @change="TimeRangeChange"
                        :show-all-levels="false"
                        >
                    </el-cascader>
                </div> 
            </el-col>
            <el-col :span="24">
                <div class="report-content" align="left">
                    <p>截止至{{myyear}}年{{mymonth}}月{{myday}}日的上报数据，{{mytimerange}}的{{myplace}}内交通行业的能源消耗总量为{{myalldata}}万吨标准煤。</p>
                    <h4>其中，各交通子行业的能源消耗情况如下：</h4>
                    <li v-for="list in items"  v-bind:key="list.text">
                        {{ list.text }}
                    </li>
                    <p>{{trfficresult}}</p>
                </div>
            </el-col>
            <el-col :span="24">
                <div id="trafficchart" class="chart-content" align = "center">
                </div>
            </el-col>
        
            <el-col :span="24">
                <div class="report-content" align="left">
                    <h4>各地级市的能源消耗情况如下：</h4>
                    <li v-for="citylist in cityitems"  v-bind:key="citylist.text">
                        {{ citylist.text }}
                    </li>
                </div>
            </el-col>
            <el-col :span="24">
                <div id="citychart" class="chart-content" align = "center">
                </div>
            </el-col>
        
            <el-col :span="24">
                <div class="report-content" align="left">
                    <h4>不同类型能源的消耗情况如下：</h4>
                    <li v-for="engerlist in engeritems"  v-bind:key="engerlist.text">
                        {{ engerlist.text }}
                    </li>
                </div>
            </el-col>
            <el-col :span="24">
                <div id="engerchart" class="chart-content" align = "center">
                </div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';
var requestData = {};

var _mytimerange = '上一季度';
var engerSortArr = [];
var citySortArr = [];
var trafficSortArr = [];
var total = [0,0,0];   //存储能耗总和，交通方式、地市、燃料类型

var trafficChart;
var cityChart;
var engerChart;

var optionTraffic = {
    title:{
        /*text:'交通子行业能源消耗情况图',
        left:'left'*/
    },
    tooltip : {

    },
    grid: {
        right:80,
        top: 80,
        bottom: 50,
    },
    tooltip: {},
    xAxis: [
        {

            name:'行业',       
            data:[]
        }
    ],
    yAxis: {
        name:'能耗(万吨标准煤)',
        type:'value'
    },
    series:[
        {
            name:'能耗',
            type:'bar',
            barMaxWidth:'50%',
            data:[]
        },
        {
            name:'行业能耗占比',
            type: 'pie',
            color: ['#A5DEE4', '#81C7D4', '#24936E', '#5DAC81','#A8D8B9',"#F596AA","#E87A90","#F4A7B9","#DB8E71","#FB9966","#E9A368","#58B2DC"],
            center: ['75%', '20%'],
            radius: [20, '28%'],
            roseType: 'area',
            data:[]
        }
    ]
}
var optionCity = {
    title:{
        /*text:'地级市能源消耗情况图',
        left:'left'*/
    },
    grid: {
        right:80,
        top: 80,
        bottom: 50,
    },
    tooltip: {},
    xAxis: [
        {
            
            name:'地级市',
            data:[]
        }
    ],
    yAxis: {
        name:'能耗(万吨标准煤)',
        type:'value'
    },
    series:[
        {
            name:'能耗',
            type:'bar',
            barMaxWidth:'50%',
            data:[]
        },
        {
            name:'地市能耗占比',
            type: 'pie',
            color: ['#A5DEE4', '#81C7D4', '#24936E', '#5DAC81','#A8D8B9',"#F596AA","#E87A90","#F4A7B9","#DB8E71","#FB9966","#E9A368","#58B2DC"],
            center: ['75%', '20%'],
            radius: [20, '28%'],
            roseType: 'area',
            data:[]
        }
    ]
}
var optionEnger = {
    title:{
        /*text:'不同类型能源消耗情况图',
        left:'left'*/
    },
    grid: {
        right:80,
        top: 80,
        bottom: 50,
    },
    tooltip: {},
    xAxis: [
        {
            name:'能源类型',
            data:[]
        }
    ],
    yAxis: {
        name:'能耗(万吨标准煤)',
        type:'value'
    },
    series:[
        {
            name:'能耗',
            type:'bar',
            barMaxWidth:'50%',
            data:[]
        },
        {
            name:'能耗占比',
            type: 'pie',
            color: ['#A5DEE4', '#81C7D4', '#24936E', '#5DAC81','#A8D8B9',"#F596AA","#E87A90","#F4A7B9","#DB8E71","#FB9966","#E9A368","#58B2DC"],
            center: ['75%', '20%'],
            radius: [20, '28%'],
            roseType: 'area',
            data:[]
        }
    ]
}

var compare = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}
export default {
    data(){
        return{
            loading:true,
            items:[],
            cityitems:[],
            engeritems:[],
            myyear:' ',
            mymonth:' ',
            myday:' ',
            myplace:" ",
            myalldata:" ",
            mytimerange:" ",
            trfficresult:"",
            selectedOptions:[],
            options:[{
                label:"季度",
                value:"季度",
                children:[]
            },{
                label:"半年度",
                value:"半年度",
                children:[]
            },{
                label:"年度",
                value:"年度",
                children:[]
            }/*{
                label:new Date().getFullYear().toString(),
                value:new Date().getFullYear().toString(),
                children:[]
            },{
                label:(new Date().getFullYear()-1).toString(),
                value:(new Date().getFullYear()-1).toString(),
                children:[]
            }*/],
            
            
        }   
    },
    methods:{
        handleItemChange(val){
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var quarterAble = [true,true,true,true];
            var monthRange = [year+'-01-01:'+year+'-03-31',year+'-04-01:'+year+'-06-31',
                            year+'-07-01:'+year+'-09-31',year+'-10-01:'+year+'-12-31'];
                            
            var flag = Math.ceil((month+1)/3);   //当前季度
            var judge = flag;
            if(month%3==0)
                judge=flag-1;
            for(var i=0;i<judge;i++){
                quarterAble[i] = false;
            }
            var beginmon = flag*3-2;
            if(beginmon>=1&&beginmon<=9){
                beginmon = '0'+beginmon;
            }
            if(month>=1&&month<=9)
                month = '0' + month;
            monthRange[flag-1] = year+'-'+beginmon+'-31:'+year+'-'+month+'-31';

            if(flag>2){
                var halfRange = [year+'-01-01:'+year+'-06-31',year+'-07-01:'+year+'-'+month+'-31'];
            }else{
                var halfRange = [year+'-01-01:'+year+'-'+month+'-31',year+'-07-01:'+year+'-12-31'];
            }

            var lastyear = year-1;
            if(val.indexOf("季度")>-1){
                this.options[0].children = [
                    {
                        label:lastyear+'年一季度',
                        value:lastyear+'-01-01:'+lastyear+'-03-31',
                    },
                    {
                        label:lastyear+'年二季度',
                        value:lastyear+'-04-01:'+lastyear+'-06-31',
                    },
                    {
                        label:lastyear+'年三季度',
                        value:lastyear+'-07-01:'+lastyear+'-09-31',
                    },
                    {
                        label:lastyear+'年四季度',
                        value:lastyear+'-10-01:'+lastyear+'-12-31',
                    },
                    {
                        label:year+'年一季度',
                        value:monthRange[0],
                        disabled:quarterAble[0]
                    },
                    {
                        label:year+'年二季度',
                        value:monthRange[1],
                        disabled:quarterAble[1]
                    },
                    {
                        label:year+'年三季度',
                        value:monthRange[2],
                        disabled:quarterAble[2]
                    },
                    {
                        label:year+'年四季度',
                        value:monthRange[3],
                        disabled:quarterAble[3]
                    }
                ]
            }
            if(val.indexOf("半年度")>-1){
                this.options[1].children = [
                    {
                        label:lastyear+'年上半年',
                        value:lastyear+'-01-01:'+lastyear+'-06-31',
                    },
                    {
                        label:lastyear+'年下半年',
                        value:lastyear+'-07-01:'+lastyear+'-12-31',
                    },
                    {
                        label:year+'年上半年',
                        value:halfRange[0],
                        disabled:quarterAble[0]
                    },
                    {
                        label:year+'年下半年',
                        value:halfRange[1],
                        disabled:quarterAble[2]
                    }
                ]
            }
            if(val.indexOf("年度")>-1){
                this.options[2].children = [
                    {
                        label:lastyear+'年',
                        value:lastyear+'-01-01:'+lastyear+'-12-31',
                    },
                    {
                        label:year+'年',
                        value:year+'-01-01:'+year+'-'+month+'-31',
                        disabled:quarterAble[0]
                    }
                ]
            }
            

           
            
        },
        TimeRangeChange(val){
            _mytimerange = '该'+val[0];
            requestData.timeRange = val[1];
            this.loading = true;
            this.getDataFromService(requestData);
        },
        initRequestData(requestData){
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
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var flag = Math.ceil((month+1)/3)-1;   //上一季度
            if(flag == 0){
                requestData.timeRange = (year-1)+'-10-01:'+ (year-1)+'-12-31';
            }else{
                var endmon = flag*3;
                var startmon =endmon-2;
                if(startmon>=1&&startmon<=9)
                    startmon = '0'+startmon;
                if(endmon>=1&&endmon<=9)
                    endmon = '0'+endmon;
                requestData.timeRange = year+'-'+startmon+'-01:'+ year+'-'+endmon+'-31';
            }
        },
        getDataFromService(requestData){
            var _this = this;
            
            $.get(this.Constant.ajaxAddress+this.Constant.analyzeReport,
            requestData)
            .done(function(data){
                _this.loading = false;
                if(data.errCode==30){//成功
                    _this.generateReportData(data);
                    _this.writeData();
                }else if(data.errCode==31){//未知错误
                    _this.$message.error('获取数据失败，请稍后再试'); 
                }else if(data.errCode==44){//
                    _this.$router.push('/login');
                }
            });
        },
        generateReportData(data){
            
            var engerData = {};
            var cityData = {};
            var trafficData = {};
            var ppengerData = {};
            total = [0,0,0];
            data.monTypOther.forEach(function(element){
                element.monTypEng.forEach(function(e2){
                    var t = engerData[e2.type];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    engerData[e2.type] = t;
                    total[2] += e2.typDatOfAllEng;
                })

                element.monTypCity.forEach(function(e2){
                    var t = cityData[e2.type];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    cityData[e2.type] = t;
                    total[1] += e2.typDatOfAllEng;
                })

                element.monTypTra.forEach(function(e2){
                    var t = trafficData[e2.type];
                    if(!t) t=[0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    trafficData[e2.type] = t;
                    total[0] += e2.typDatOfAllEng;
                })
            })

            data.monTypOtherPP.forEach(function(element){
                element.monTypEng.forEach(function(e2){
                    /*var t = ppengerData[e2.type];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    ppengerData[e2.type] = t;*/
                    var t = engerData[e2.type];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    engerData[e2.type] = t;
                    total[2] += e2.typDatOfAllEng;
                    
                })

                element.monTypCity.forEach(function(e2){
                    var t = cityData[e2.type];
                    if(!t) t = [0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    cityData[e2.type] = t;
                    total[1] += e2.typDatOfAllEng;
                })

                element.monTypTra.forEach(function(e2){
                    var t = trafficData[e2.type];
                    if(!t) t=[0,0];
                    t[0] += e2.typDatOfAllEng;
                    t[1] += e2.typDatOfAllLen;
                    trafficData[e2.type] = t;
                    total[0] += e2.typDatOfAllEng;
                })
            })
            engerSortArr.splice(0,engerSortArr.length);
            citySortArr.splice(0,citySortArr.length);
            trafficSortArr.splice(0,trafficSortArr.length);
            data.xs[1].forEach(function(element){
                var t = engerData[element];
                if(t)
                    engerSortArr.push({name:element,eng:t[0],len:t[1]});
            });

            data.xs[2].forEach(function(element){
                var t = cityData[element];
                if(t)
                    citySortArr.push({name:element,eng:t[0],len:t[1]});
            });

            data.xs[3].forEach(function(element){
                var t = trafficData[element];
                if(t)
                    trafficSortArr.push({name:element,eng:t[0],len:t[1]});            
            });

            engerSortArr.sort(compare("eng"));
            citySortArr.sort(compare("eng"));
            trafficSortArr.sort(compare("eng"));

        },

        writeData(){
            this.items.splice(0,this.items.length);
            var date = new Date();
            this.myyear = date.getFullYear();
            this.mymonth = date.getMonth()+1;
            this.myday = date.getDate();
            this.mytimerange = _mytimerange;
            if(requestData.place1 == null||requestData.place1 == ""){
                this.myplace = "浙江省";
            }else{
                this.myplace = this.place1; 
            }
            this.myalldata = (total[0]/10000).toFixed(2);

            var trafficPI = [];
            var trafficBar = [[],[]]; 
            var cityPI = [];
            var cityBar  = [[],[]];
            var engerPI = [];
            var engerBar = [[],[]];

            /*---- 交通行业部分填写----*/
            var countutil = {
                '道路客运':[1,'万吨标准煤/亿人公里'],
                '道路货运':[1,'万吨标准煤/亿吨公里'],
                '出租客运':[1,'万吨标准煤/亿人公里'],
                '公交客运':[1,'万吨标准煤/亿人公里'],
                '海洋货运':[1,'万吨标准煤/亿吨公里'],
                '海洋客运':[1,'万吨标准煤/亿人公里'],
                '内河运输':[1,'万吨标准煤/亿吨公里'],
                '港口生产':[10000,'亿吨标准煤/万吨生产量'],
            };           
            for(var i = 0;i<trafficSortArr.length;i++){
                //构造文字
                var name = trafficSortArr[i].name;
                var eng = trafficSortArr[i].eng;
                var len = trafficSortArr[i].len;
                var num = countutil[name][0];
                var textobj = name+'的总能耗为 '+(eng/10000).toFixed(2)+' 万吨标准煤'+'，单位能耗为 '+(eng/num/len).toFixed(2)+' '+countutil[name][1]+'；';
                this.items.push({text:textobj});

                //构造图表数据
                trafficPI.push({name:name,value:(eng/10000).toFixed(2)});
                trafficBar[0].push(name);
                trafficBar[1].push((eng/10000).toFixed(2));

            }
            this.trfficresult = '能源消耗量前三的交通子行业为'+trafficSortArr[0].name+',占'+(trafficSortArr[0].eng/total[0]*100).toFixed(2)+"%；"+
                                '其次是'+trafficSortArr[1].name+'，占'+(trafficSortArr[1].eng/total[0]*100).toFixed(2)+"%；"+
                                 '第三是'+trafficSortArr[2].name+'，占'+(trafficSortArr[2].eng/total[0]*100).toFixed(2)+"%。"
            
            /*---- 各地市部分填写----*/
            this.cityitems.splice(0,this.cityitems.length);
            for(var i = 0;i<citySortArr.length;i++){
                var name = citySortArr[i].name;
                var eng = citySortArr[i].eng;
                var textobj = name+'市的总能耗为 '+(eng/10000).toFixed(2)+' 万吨标准煤，占全部的'+(eng/total[1]*100).toFixed(2)+"%"
                if(i<citySortArr.length-1){
                    textobj = textobj+"；"
                }else
                    textobj = textobj + "。"
                this.cityitems.push({text:textobj});

                //构造图表数据
                cityPI.push({name:name,value:(eng/10000).toFixed(2)});
                cityBar[0].push(name);
                cityBar[1].push((eng/10000).toFixed(2));
            }

            /*---- 各能源部分填写----*/
            this.engeritems.splice(0,this.engeritems);
            for(var i = 0;i<engerSortArr.length;i++){
                var name = engerSortArr[i].name;
                var eng = engerSortArr[i].eng;
                var textobj = name+'的总消耗量为 '+(eng/10000).toFixed(2)+' 万吨标准煤，占全部的'+(eng/total[2]*100).toFixed(2)+"%"
                if(i<engerSortArr.length-1){
                    textobj = textobj+"；"
                }else
                    textobj = textobj + "。"
                this.engeritems.push({text:textobj});

                engerPI.push({name:name,value:(eng/10000).toFixed(2)});
                engerBar[0].push(name);
                engerBar[1].push((eng/10000).toFixed(2));
            }
            trafficChart.clear();
            cityChart.clear();
            engerChart.clear();
            if(trafficSortArr.length>1){
                optionTraffic.series[1].data = trafficPI;
                optionTraffic.xAxis[0].data = trafficBar[0];                
                optionTraffic.series[0].data = trafficBar[1];

                trafficChart.setOption(optionTraffic);
            }
            if(citySortArr.length>1){
                optionCity.series[1].data = cityPI;
                optionCity.xAxis[0].data = cityBar[0];
                optionCity.series[0].data = cityBar[1];

                cityChart.setOption(optionCity);
            }
            if(engerSortArr.length>1){
                optionEnger.series[1].data = engerPI;
                optionEnger.xAxis[0].data = engerBar[0];
                optionEnger.series[0].data = engerBar[1];

                engerChart.setOption(optionEnger);
            }
            



        }
    },
    mounted() {
       this.initRequestData(requestData);
       this.getDataFromService(requestData);
       trafficChart = echarts.init(document.getElementById('trafficchart'));
       cityChart = echarts.init(document.getElementById('citychart'));
       engerChart = echarts.init(document.getElementById('engerchart'));

    }
}
</script>


<style scoped lang="scss">
    .pdf{
        border:1px solid black;
    }
    .grid-content{
        border-radius: 8px;
        min-height: 50px;
        width: 160px;
    }
    .report-content{
        border-radius: 8px;
        font-size: 16px;
        line-height: 25px;
    }
    .chart-content{
        height: 400px;
        min-width: 500px;
        max-width: 800px;
    }

    .top{
        margin-top: 30px;
        float:left;
    }

    
</style>