<template>
<section class ="chart">
    <el-row>
        <el-col >
            <div >
                <el-date-picker
                v-model="datTimRange"
                type="date"
                placeholder="选择查询时间"
                @change="selectDate"
                >
                </el-date-picker>
            </div>
        </el-col>
        <el-col >
            <div >
                <el-select v-model="cityType" placeholder="请选择地市"  @change="selectCity" >
                    <el-option key="所有地市" label="所有地市" value="所有地市"></el-option>
                    <el-option key="杭州" label="杭州" value="杭州"></el-option>
                    <el-option key="宁波" label="宁波" value="宁波"></el-option>
                    <el-option key="温州" label="温州" value="温州"></el-option>
                    <el-option key="嘉兴" label="嘉兴" value="嘉兴"></el-option>
                    <el-option key="湖州" label="湖州" value="湖州"></el-option>
                    <el-option key="绍兴" label="绍兴" value="绍兴"></el-option>
                    <el-option key="金华" label="金华" value="金华"></el-option>
                    <el-option key="衢州" label="衢州" value="衢州"></el-option>
                    <el-option key="舟山" label="舟山" value="舟山"></el-option>
                    <el-option key="台州" label="台州" value="台州"></el-option>
                    <el-option key="丽水" label="丽水" value="丽水"></el-option>
                </el-select>
            </div>
        </el-col>
        <el-col >
            <div>
               <el-input v-model="tId" placeholder="车牌号，留空为所有车"></el-input>
            </div>
        </el-col>
        <el-col >
            <div>
               <el-input v-model="companyId" placeholder="公司编号号，留空为所有公司"></el-input>
            </div>
        </el-col>
        <el-col >
            <div>
              <el-button type="primary" @click="getData">查询</el-button>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col class = "chart-container"> 
            <div div id="relTimeChart"style="width:100%; height:400px;" class="chart-content"></div>
        </el-col>
    </el-row>

    <el-row>
        <el-col class = "chart-container"> 
            <div div id="relTimeChartCo"style="width:100%; height:400px;" class="chart-content"></div>
        </el-col>
    </el-row>

</section>  
</template>

<script>

var titleName = '数据监测'
var titleNameCo = '数据监测2'
var tranTypeA = '公交客运';

var relTimeData = [];//油气柱状图数据
var relTimeDataCo = [];//标煤曲线图数据

var relTimeChart;//油气柱状图
var relTimeChartCo;//标煤曲线图

var selectDs = [];


var requestData = 
{
    // username:'zwp',
    // roleName:'enterprice',
    // roleType:'R_TRA',
    // place1:'杭州',
    // place2:'江干区',
    // timeRange:'2017-01-01 00:01:01&2017-01-01 23:59:59',

    // tranType:tranTypeA,
    // // carId:null,
    // // shipId:null,
    // // cityType:null,
    // // companyId:null,

    // token:null

}


var option = {
    title: {
        text: titleName
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: [],
        align: 'left'
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            magicType: {
                type: ['bar', 'line']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    xAxis: {
        name:'时间',
        data: [],
        silent: false,
        splitLine: {
            show: false
        }
    },
    yAxis: {
    },
    
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0
        }
    ],
    
    series: [],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx ;
    }
};

var optionCo = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'left',
        text: titleNameCo,
    },
    legend: {
        data: [],
        align: 'left'
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        // type: 'value',
        // boundaryGap: [0, '100%']
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0
        }
    ],
    series: [
        {
            name:'模拟数据',
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            data: []
        }
    ]
};

export default {
    data(){
            return {
                datTimRange:'',
                tId:'',
                cityType:'',
                companyId:''
            }
    },
    methods:{
        setData(res){
            var dataFulCa = [];
            var dataFulCo = [];

            var engTMuMap = {};
            res.engTypOther.forEach(function(eng) {
                eng.engTypTMu.forEach(function(TMu) {
                    if(!engTMuMap[eng.baseTyp]) 
                        engTMuMap[eng.baseTyp] = {};
                    if(!engTMuMap[eng.baseTyp][TMu.type]) 
                            engTMuMap[eng.baseTyp][TMu.type] = [0,0];
                    var t = engTMuMap[eng.baseTyp][TMu.type];
                    t[0] = (TMu.typDatOfAllEng / TMu.typDatOfAllLen).toFixed(2);
                    t[1] = (TMu.typDatOfAllCo / TMu.typDatOfAllLen).toFixed(2);
                    engTMuMap[eng.baseTyp][TMu.type] = t;              
                });
            });

            console.log(engTMuMap);
            var relTimeSerise = [];
            var relTimeCoSerise = [];
            res.xs[1].forEach(function(e){
                var t = engTMuMap[e];
                var tmpS = {
                    name: e,
                    type: 'bar',
                    data: []
                };
                var tmpSCo = {
                    name: e,
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    data: []
                };

                if(!t){
                    // for(var i =0;i<res.xs[0].length;i++)
                    //     tmpS.data.push(0);
                }
                else{
                    res.xs[0].forEach(function(mu){
                        var t1 = t[mu];
                        if(!t1) {
                            tmpS.data.push(0);
                            tmpSCo.data.push(0);
                        }
                        else {
                            tmpS.data.push(t1[0]);
                            tmpSCo.data.push(t1[1]);
                        }
                    });
                }
                relTimeSerise.push(tmpS);
                relTimeCoSerise.push(tmpSCo);
            });
            
            relTimeData.splice(0,relTimeData.length);
            relTimeData.push(res.xs[1]);
            relTimeData.push(res.xs[0]);
            relTimeData.push(relTimeSerise);

            relTimeDataCo.splice(0,relTimeDataCo.length);
            relTimeDataCo.push(res.xs[1]);
            relTimeDataCo.push(res.xs[0]);
            relTimeDataCo.push(relTimeCoSerise);


        },

        selectDate(tr){
            console.log('timeRange r ='+tr);
            if(!tr||tr==='')
                requestData['timeRange'] = '';
            else
                requestData['timeRange']=tr+' 00:00:00&' +tr +' 23:59:59';   
        },
        selectCity(ct){
            console.log('cityType ct ='+ct);
            if(ct==null||ct===''||ct==='所有地市')
                delete requestData.cityType;
            else
               requestData['cityType']=ct;

        },
        getData(){

            if(!requestData.timeRange||requestData.timeRange===''){
                window.alert('请输入查询时间');
                return ;
            }

            if(this.tId==='') {
                delete requestData.carId;
                delete requestData.shipId;
            }else
            {
                    requestData.carId = this.tId;
                    requestData.shipId = this.tId;
            }
            if(this.companyId === '')
                delete requestData.companyId;
            else
                requestData.companyId = this.companyId;
            this.getDataFromService(requestData);
        },


        getDataFromService(requestData){
            console.log(requestData);
            var _this = this;
            $.get(this.Constant.ajaxAddress+this.Constant.relTimeAjax,requestData).
            done(function (res){
                console.log(res);
                _this.setData(res);

                var c = res.cityType;
                if(!c) c = '所有地市'
                
                option.title.text = c +' '+ res.timeRange.substring(0,10)+' '+res.tranType+'实时油电百公里消耗';
                option.legend.data = relTimeData[0];
                option.xAxis.data = relTimeData[1];
                option.series = relTimeData[2];
                relTimeChart.clear();
                relTimeChart.setOption(option);

                optionCo.title.text = c +' '+ res.timeRange.substring(0,10)+' '+res.tranType+' 实时标煤百公里消耗';
                optionCo.legend.data = relTimeDataCo[0];
                optionCo.xAxis.data = relTimeDataCo[1];
                optionCo.series = relTimeDataCo[2];
                relTimeChartCo.clear();
                relTimeChartCo.setOption(optionCo);

            });
        }
    },
    mounted:function(){
        relTimeChart =  echarts.init(document.getElementById('relTimeChart'));
        relTimeChartCo = echarts.init(document.getElementById('relTimeChartCo'));
        relTimeChart.setOption(option);
        relTimeChartCo.setOption(optionCo);



        var ui = this.$userInfo;
        var token  =this.$token;

        requestData.username = ui.username;
        requestData.roleType = ui.roleType;
        requestData.tranType = tranTypeA;
        requestData.token = token;

        if(!ui.roleName) 
            delete requestData.roleName;
        else
            requestData.roleName = ui.roleName;

        if(!ui.place1) 
            delete requestData.place1;
        else
            requestData.place1 = ui.place1;
        
        if(!ui.place2) 
            delete requestData.place2;
        else
            requestData.place2 = ui.place2;
        

        var d = new Date();
        var tm = d.getMonth()+1;
        var td = d.getDate();
        if(tm>=1 && tm <= 9)
            tm = '0' + tm;
        if(td>=1 && td<=9)
            td = '0'+td;

        var t = d.getFullYear()+'-'+tm+'-'+td;
        requestData.timeRange = t+' 00:00:00&'+t+' 23:59:59';
        this.timeRange =  t;
        this.getDataFromService(requestData);
    },
    updated:function(){

    }

}

</script>


<style scoped lang="scss">
    .chart {
        width: 100%;
        float: left;
        .chart-container{
             background-color: #F2F2F2; 
            .chart-header{
                float: right;
                margin-bottom: 20px;
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
</style>


