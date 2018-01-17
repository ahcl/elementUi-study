<template>
  <section class = "chart">
      <el-row>
            <el-col class = 'chart-container'>
                <div class="chart-header">
                    <el-date-picker
                        v-model="beginYear"
                        type="year"
                        placeholder="起始年份"
                        @change="selectBeginEndYear"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div>
                <div class="chart-header">
                    <el-date-picker
                        v-model="endYear"
                        type="year"
                        placeholder="结束年份"
                        @change="selectBeginEndYear"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </div>
                
            </el-col>
            
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div class = "chart-header2">
                    <el-select v-model="engerType" filterable placeholder="燃料类型" @change="selectEngType">
                        <el-option
                            v-for="item in optionSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div id="engYearChgChart"style="width:100%; height:400px;" class="chart-content"></div>   
            </el-col>
      </el-row>
      <el-row>
            <el-col class="chart-container">
                <div class = "chart-header2">
                    <el-select v-model="currentYear" filterable placeholder="选择年" @change="selectYear">
                        <el-option
                            v-for="item in optionSY"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div id="engYearSortChart"style="width:100%; height:400px;" class="chart-content"></div>   
            </el-col>
      </el-row>       
  </section>
</template>


<script>

    import {getCookie,delCookie,setCookie} from '../common/js/Cookie.js';

    var dataForEngAll=[];
    var dataForEngSort = [];
    var engYearChgChart;
    var engYearSortChart;


    var requestData = {};
    //var engType = '';
    var engYearMon3Map = {};

    var option = {
        title : {
            text: '能耗数据年度环比图'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data:[]
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                saveAsImage : {show: true},
            },
            right:'3%'
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap: false,
                name:'月份',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
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

    var optionSort = {
        title : {
            text: '各燃料分季度消耗对比'
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
                dataView : {show: true, readOnly: false},
                saveAsImage : {show: true},
            },
            right:'3%'
        },
        legend:{
            data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '6%',
            containLabel: true
        },
        xAxis:  {
            type: 'value',
            name:'能耗(单位：万吨标准煤)',
            nameLocation:'middle',
            nameGap:25
            
        },
        yAxis: {
            type: 'category',
            data: [],
            name:'燃料类型'
        },
        series:[]
    };

    
    var _endYear='';
    var _beginYear='';
    var _currentYear = '';
    var _engType='';
    var allEnergys = [];

    function setData(res){
        console.log(res)
        var allYearMon2Map = {};
        res.engTypOther.forEach(function(element){
            element.engTypMo.forEach(function(e2){
                if(!engYearMon3Map[element.baseTyp])
                    engYearMon3Map[element.baseTyp]={};
                var yearMon = new Array();
                yearMon = e2.type.split('-');
                if(!engYearMon3Map[element.baseTyp][yearMon[0]]){
                    engYearMon3Map[element.baseTyp][yearMon[0]] = {};
                }        
                if(!engYearMon3Map[element.baseTyp][yearMon[0]][yearMon[1]])
                    engYearMon3Map[element.baseTyp][yearMon[0]][yearMon[1]] =e2.typDatOfAllEng;
                /* --------所有燃料----------- */                    
                if(!allYearMon2Map[yearMon[0]])
                    allYearMon2Map[yearMon[0]] = {};
                if(!allYearMon2Map[yearMon[0]][yearMon[1]])
                    allYearMon2Map[yearMon[0]][yearMon[1]] = 0;
                var t = allYearMon2Map[yearMon[0]][yearMon[1]];
                t += allYearMon2Map[yearMon[0]][yearMon[1]] = e2.typDatOfAllEng;
                allYearMon2Map[yearMon[0]][yearMon[1]] = t;
            });     
        });
        engYearMon3Map['所有燃料'] = allYearMon2Map;
        allEnergys.forEach(function(element){
            if(!engYearMon3Map[element])
                engYearMon3Map[element] = {};   
        })
        console.log(engYearMon3Map)
        setDataByEngType();
        engYearSort();
    };

    function setDataByEngType(){
        var yearArr =[];
        var yearMonSeries=[];
        var monthArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        for(var t = _beginYear;t<=_endYear;t++)
            yearArr.push(t.toString());
        /*if(!engYearMon3Map[_engType])
            engYearMon3Map[_engType]={};*/
        yearArr.forEach(function(element){
            var tmpEngDatas = [];
            if(!engYearMon3Map[_engType][element]){
                var tmpSeriseObj = {
                    name:element,
                    type:'line',
                    data:[0,0,0,0,0,0,0,0,0,0,0,0]
                };
                yearMonSeries.push(tmpSeriseObj);
            }else{
                monthArr.forEach(function(e2){
                    var t = engYearMon3Map[_engType][element][e2];
                    if(t){
                        tmpEngDatas.push((t/10000).toFixed(2));
                    }else{
                        tmpEngDatas.push(0);
                    }
                });
                var tmpSeriseObj={
                    name:element,
                    type:'line',
                    data:tmpEngDatas
                };
                yearMonSeries.push(tmpSeriseObj);
            }
            
        });
      //  console.log(yearMonSeries)
        dataForEngAll.splice(0,dataForEngAll.length);
        dataForEngAll.push(yearArr);
        dataForEngAll.push(monthArr);
        dataForEngAll.push(yearMonSeries);   

        option.legend.data = dataForEngAll[0];
        option.title.text = '能耗数据年度环比图（'+_engType+'）';
        // option.xAxis[0].data = dataForEngAll[1];
        option.series = dataForEngAll[2];
        engYearChgChart.clear();
        engYearChgChart.setOption(option);
    };

    function chaEngType(){
        setDataByEngType();
    };
    
    function engYearSort(){
        var engYearSortSeries = [];
        var quarterName = ['一季度','二季度','三季度','四季度']
        var monthArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        var qrtcount = 1;
        quarterName.forEach(function(element){
            var quaters = monthArr.slice(qrtcount*3-3,qrtcount*3);
            var tmpEngDatas = [];
            allEnergys.forEach(function(e2){
                if(!engYearMon3Map[e2][_currentYear]){
                    tmpEngDatas.push(0);
                }else{
                    var quarterData = 0;
                    quaters.forEach(function(e3){                   
                        var t =engYearMon3Map[e2][_currentYear][e3];
                        if(t)
                            quarterData += t;
                        else
                            quarterData +=0; 
                    });
                    tmpEngDatas.push((quarterData/10000).toFixed(2));
                }                                             
            });
            var tmpSeriseObj = {
                name:element,
                type:'bar',
                stack:'总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideLeft'
                    }
                },
                data:tmpEngDatas
            };
            engYearSortSeries.push(tmpSeriseObj);
            qrtcount++;
        });
        console.log(engYearSortSeries);
        
        
        dataForEngSort.splice(0,dataForEngSort.length);
        dataForEngSort.push(quarterName);
        dataForEngSort.push(allEnergys);
        dataForEngSort.push(engYearSortSeries);

        optionSort.legend.data = dataForEngSort[0];
        optionSort.yAxis.data = dataForEngSort[1];
        optionSort.series = dataForEngSort[2];
        optionSort.title.text = '各燃料分季度消耗对比（'+_currentYear+'年）';

        engYearSortChart.clear();
        engYearSortChart.setOption(optionSort);
    }

    export default {
        data(){
            return {
                endYear:'',
                beginYear:'',
                optionSelect:[],
                optionSY:[],
                engerType : '',
                currentYear:'',
                pickerOptions0: {
                    disabledDate(time) {
                        if((new Date()).getMonth==0)
                            return time.getFullYear()>=(new Date()).getFullYear();
                        else
                            return time.getFullYear()>(new Date()).getFullYear();
                    }
                },
                pickerOptions1: {
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
                var month = date.getMonth();
                if((month-1)<=0){
                    year = year-1;
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
                requestData.timeRange = (year-1)+'-01-01:'+year+'-'+month+'-31';

                
                _engType = '所有燃料';
                _endYear = year;
                _currentYear = _endYear;
                _beginYear = year-1;
            },
             
            getDataFromService(requestData){
                var _this = this;
                engYearChgChart.showLoading({text:'加载中'});
                engYearSortChart.showLoading({text:'加载中'});
                $.get(this.Constant.ajaxAddress+this.Constant.yearcompareAjax,requestData).
                done(function (res){
                    engYearChgChart.hideLoading();
                    engYearSortChart.hideLoading();
                    console.log(res)
                    if(res.errCode==30){//data ok
                        console.log(res)
                        allEnergys = res.xs[1];
                        _this.optionSelect  = allEnergys.map(item => {
                            return { value: item, label: item };
                        });
                        _this.optionSelect.push({value:'所有燃料',label:'所有燃料'});
                        _this.optionSY.splice(0,_this.optionSY.length);
                        for(var crtyear = _beginYear;crtyear<=_endYear;crtyear++){
                            _this.optionSY.push({value:crtyear,label:crtyear});
                        }
                        setData(res);  
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

            selectBeginEndYear(){
                
                if(this.beginYear!=''&&this.endYear!=''){
                    _beginYear = this.beginYear.getFullYear();
                    _endYear = this.endYear.getFullYear();
                    if(_beginYear > _endYear){
                        _$message({
                            showClose: true,
                            message: '起始年份不能大于结束年份',
                            type: 'warning',
                            duration:2500
                        });
                        return;
                    }
                    var date = new Date();
                    var year = date.getFullYear();
                    if(_endYear==year){
                        var month = date.getMonth();
                        if(month>=1&&month<=9)
                            month='0'+month;
                        requestData.timeRange = _beginYear+'-01-01:'+_endYear+'-'+month+'-31';                        
                    }else{
                        requestData.timeRange = _beginYear+'-01-01:'+_endYear+'-12-31'; 
                    }
                    
                    _engType = '所有燃料';
                    _currentYear = _endYear;
                    this.getDataFromService(requestData);
                    
                }   
            },

            /*selectBeginYear(by){
                _beginYear = by;
                if(_endYear==''){    
                }else{
                    if(_endYear<_beginYear){
                        alert("起始年份应该小于结束年份");
                    }else{
                        var date = new Date();
                        var year = date.getFullYear();
                        requestData.timeRange = _beginYear+'-01-01:'+_endYear+'-12-31';
                        this.getDataFromService(requestData);
                    }         
                }    
            },
            selectEndYear(ey){
                _endYear = ey;
                if(_beginYear==''){
                }else{
                    if(_endYear<_beginYear){
                        alert("起始年份应该小于结束年份");
                    }else{
                        requestData.timeRange = _beginYear+'-01-01:'+_endYear+'-12-31';
                        this.getDataFromService(requestData);
                    }         
                }
            },*/
            selectEngType(et){
                _engType = et;
                 chaEngType();
            },
            selectYear(cy){
                _currentYear = cy;
                 engYearSort();
            }
        },
        mounted:function(){
            engYearChgChart = echarts.init(document.getElementById('engYearChgChart'));
            engYearSortChart = echarts.init(document.getElementById('engYearSortChart'));
            engYearChgChart.setOption(option);
            engYearSortChart.setOption(optionSort);

         /*   window.addEventListener("resize",function(){
                engYearChgChart.resize();
                engYearSortChart.resize();
            });
	    */
            this.initRequestData(requestData)
            this.getDataFromService(requestData);
            
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
                float: left;
                margin-left: 20px;
                position: relative;
            }
            .chart-header2{
                float: right;
                margin-bottom: 10px;
               
            }
            .chart-content{
                overflow: hidden;
            }
        }
        
    }
    .el-row {
        margin-bottom: 15px;
        &:last-child {
        margin-bottom: 0;
        }
    }

    .el-col {
        padding: 20px 20px;
    }
</style>



