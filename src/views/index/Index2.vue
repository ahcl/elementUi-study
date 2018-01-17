<template>
    <section class="chart">
        <el-row> 
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="chart-container">                
               <div class="chart-header">
                    <el-select v-model="energyTypeSelectValue" placeholder="请选择" @change="energyTypeSelectChange"  >
                        <el-option key="本月" label="本月" value="本月"></el-option>
                        <el-option key="本季" label="本季" value="本季"></el-option>
                        <el-option key="本年" label="本年" value="本年"></el-option>
                    </el-select>
               </div>

                <div id="energyTypePie" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    const err_OK = 0;
    export default {
        data() {
            return {
                energyTypeSelectValue: '本月',
                energyTypeUrl : './api/energyTypeMonth'
            }
        },

        methods: {
            energyTypeSelectChange(){
                let value= this.energyTypeSelectValue;
                if(value === "本月"){
                    this.energyTypeUrl = './api/energyTypeMonth';
                }else if(value === "本季"){
                    this.energyTypeUrl = './api/energyTypeQuater';
                }else if(value === "本年"){
                    this.energyTypeUrl = './api/energyTypeYear';
                }
            },
            drawEnergyTypePie(){
                 this.energyTypePie = echarts.init(document.getElementById('energyTypePie'));
                 
                var option={
                    title : {
                        text: '能源类型图',
                        subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x : 'center',
                        y : 'bottom',
                        data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    series : [
                        {
                            name:'半径模式',
                            type:'pie',
                            radius : [20, 110],
                            center : ['25%', '50%'],
                            roseType : 'radius',
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:[]
                        },
                        {
                            name:'面积模式',
                            type:'pie',
                            radius : [30, 110],
                            center : ['75%', '50%'],
                            roseType : 'area',
                            data:[]
                        }
                    ]
                }
                this.energyTypePie.setOption(option);
                var _this = this;
                console.log(this.energyTypeUrl);
                $.get(this.energyTypeUrl).done(function (res) {
                    if(res.errno ===  err_OK){
                        console.log(res.data);
                        var data = res.data;
                        _this.energyTypePie.setOption({
                            series : [
                                {
                                    data: data,
                                    
                                },{
                                    data: data
                                }
                            ]
                        });
                    }
                })
            },
           
            drawCharts() {
                this.drawEnergyTypePie()
            }
        },
        mounted: function () {
            this.drawCharts();
        },
        updated: function () {
            this.drawCharts()
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
                 /*float: right; */
                margin-bottom: 10px;
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
