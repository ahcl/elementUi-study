<template>
    <section class="chart-container">
        <el-row>
            
            
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div id="myHeatMap" style="width:100%; height:400px;"></div>
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
                heatMap: null
            }
        },

        methods: {
            drawHeatMap(){           
                  var myChart = echarts.init(document.getElementById("myHeatMap"));
                  var app = {};
                  var option = null;
                  app.title = '热力图与百度地图扩展';
                  console.log("lalalal");
                  $.get('./api/hangzhouTrack', function (res) {
                     var data =res.data;
                     console.log(data);
                      var points = [].concat.apply([], data.map(function (track) {
                          return track.map(function (seg) {
                              return seg.coord.concat([1]);
                          });
                      }));
                      myChart.setOption(option = {
                            animation: false,
                            bmap: {
                                center: [120.13066322374, 30.240018034923],
                                zoom: 14,
                                roam: true
                            },
                            visualMap: {
                                show: false,
                                top: 'top',
                                min: 0,
                                max: 5,
                                seriesIndex: 0,
                                calculable: true,
                                inRange: {
                                    color: ['blue', 'blue', 'green', 'yellow', 'red']
                                }
                            },
                            series: [{
                                type: 'heatmap',
                                coordinateSystem: 'bmap',
                                data: points,
                                pointSize: 5,
                                blurSize: 6
                            }]
                        });
                      if (!app.inNode) {
                          // 添加百度地图插件
                          var bmap = myChart.getModel().getComponent('bmap').getBMap();
                          bmap.addControl(new BMap.MapTypeControl());
                      }
                  });

                  if (option && typeof option === "object") {
                      myChart.setOption(option, true);
                  }
            },
            drawCharts() {
                this.drawHeatMap()
            },
        },
        created(){
            console.log("created!!!");
           
            console.log("created!!!22222");
        },
        mounted: function () {
            this.drawCharts();
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }

    .el-col {
        padding: 30px 20px;
    }
</style>
