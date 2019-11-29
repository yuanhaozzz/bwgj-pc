import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './classCard.less';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import { format } from '../../../../utils/common';

class ClassCard extends Component {

    static propTypes = {
        classData: PropTypes.any
    }

    static defaultProps = {
        classData: {}
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {

        this.drawCanvas();
    }

    drawCanvas = () => {
        let { classId, learnedLessonNum, totalLessonNum } = this.props.classData;
        var myChart = echarts.init(document.querySelector(`.canvas-${classId}`));
        let num = (learnedLessonNum / totalLessonNum) * 100;
        let result = num > 100 ? 100 : num.toFixed();
        var option = {
            // 标题组件，包含主标题和副标题
            color: ['#00E2FA', '#E8E8E8'],
            title: {
                show: true,
                text: "",
                x: "center",
                textStyle: {
                    fontSize: "15",
                    color: "green",
                    fontWeight: "bold",
                }


            },
            //  提示框组件
            tooltip: {
                //是否显示提示框组件，包括提示框浮层和 axisPointe
                show: false,
                // 触发类型: item:数据项触发，axis：坐标轴触发
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // // 图例
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data:['完成率']
            // },

            // 系列列表。每个系列通过 type 决定自己的图表类型
            series: [
                {
                    // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
                    name: '',
                    type: 'pie',
                    // 饼图的半径，数组的第一项是内半径，第二项是外半径
                    radius: ['50%', '70%'],
                    // 是否启用防止标签重叠策略，默认开启
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    // 标签的视觉引导线样式，在 label 位置 设置为'outside'的时候会显示视觉引导线
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {   // 数据值
                            value: learnedLessonNum,
                            // 数据项名称
                            name: '',
                            //该数据项是否被选中
                            selected: false,
                            // 单个扇区的标签配置
                            label: {
                                normal: {
                                    // 是显示标签
                                    show: true,
                                    position: 'center',
                                    fontSize: 13,
                                    // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
                                    formatter: result + '%'
                                }

                            },

                        },
                        {
                            value: totalLessonNum - learnedLessonNum > 0 ? totalLessonNum - learnedLessonNum : 0,
                            label: {
                                normal: {
                                    show: false,

                                }
                            }

                        },

                    ]
                }
            ]
        };
        myChart.setOption(option);
    }

    // componentDidMount () {
    //     var myChart = document.getElementById("main"),
    //         ctx = myChart.getContext('2d');
    //     const WIDTH = myChart.width,
    //         HEIGHT = myChart.height;

    //     this.drawCircleBg(ctx, WIDTH, HEIGHT);
    //     this.drawCircle(ctx, WIDTH, HEIGHT);
    // }
    drawCircleBg = (ctx, WIDTH, HEIGHT) => {
        ctx.beginPath();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#00E2FA';
        ctx.arc(WIDTH / 2, HEIGHT / 2, 30, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        console.log(ctx);
    }

    render () {
        let { classId, classNameCn, totalLessonNum, classStartDate, inClassStatus } = this.props.classData;
        return (
            <div className='home-card-wrapper flex-space-between'>
                <div className='home-card-left'>
                    <div className='home-card-left-title'>{classNameCn}</div>
                    <div className='home-card-left-lesson'>共{totalLessonNum}课次</div>
                    <div className='home-card-left-date'>日期：{format(classStartDate, 'yyyy-MM-dd')}</div>
                </div>
                <div className='home-card-right'>
                    <div className={`canvas canvas-${classId}`}></div>
                </div>
                {
                    inClassStatus === 4 && (
                        <div className='home-card-refund'>
                            <img src='/live/static/images/live-home/classRefund.png' />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default ClassCard;