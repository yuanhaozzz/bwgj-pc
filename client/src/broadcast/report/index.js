import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import { queryUrlParams } from '../../../utils/common';
import { CourseApi } from '../../../api/index';


import './report.less';
import { Rate, Button } from 'antd';
class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            report: null,
            courseTitle: '',
            liveRoomDetailId: '',
            token: '',
            userId: ''
        };
    }

    componentDidMount () {
        this.setState({
            courseTitle: queryUrlParams().courseTitle || '',
            liveRoomDetailId: queryUrlParams().liveRoomDetailId || '',
            token: queryUrlParams().token || '',
            userId: queryUrlParams().userId || ''
        }, () => {
            let { liveRoomDetailId, token, userId } = this.state;
            let params = {
                action: 'getAcademicReport',
                token,
                userId,
                liveRoomDetailId
            };
            CourseApi.sendLiveApi(params).then(res => {
                this.setState({
                    report: res.academicReport
                }, () => {
                    this.drawPie();
                });
            });
        });
    }

    drawPie = () => {
        console.log(this.state.report);
        let { classroomPerformance } = this.state.report,
            { rightQuestionNum, errorQuestionNum, missQuestionNum, totalQuestionNum } = classroomPerformance;
        if (!totalQuestionNum) return;
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('report-content-left-course-pie'));
        // 绘制图表
        let options = {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: [30, 50],
                    center: ['50%', '50%'],
                    color: ['#02BCEB', '#E16DD8', '#FFE403'],
                    data: [
                        { value: rightQuestionNum, name: `正确${rightQuestionNum}题` },
                        { value: errorQuestionNum, name: `错误${errorQuestionNum}题` },
                        { value: missQuestionNum, name: `未答${missQuestionNum}题` },
                    ],
                    roseType: 'radius',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#4D4D4D'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    label: {
                        color: 'auto'
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };
        options.series[0].data = options.series[0].data.map(item => {
            if (item.value) {
                return item;
            }
            return {};

        });
        myChart.setOption(options);
    }

    backCourse = () => {
        this.props.history.goBack();
    }

    jumpToCalendar = () => {
        history.back(-1);
    }

    render () {
        let { report, courseTitle } = this.state;
        if (!report) return <div></div>;
        let { classroomPerformance, teacherEvaluationList, praiseStatNum } = this.state.report,
            { questionCorrectRate, classAverageCorrectRate, totalQuestionNum } = classroomPerformance;
        return (
            <div className='flex-center report-layer'>
                <img onClick={this.jumpToCalendar} className='student-calendar-back' src='/live/static/images/live-home/btn_back.png' />
                <div className='report-wrapper flex-center'>
                    {/* 头标签 */}
                    <div className='report-header-img flex-center'>
                        {decodeURIComponent(courseTitle)}
                    </div>
                    <div className='student-calendar-content'>
                        <div className='report-content flex-center'>
                            <div className='report-content-left'>
                                {/* 课堂表现 */}
                                <div className='report-content-left-course flex-start maring-bottom-10'>
                                    <div className='rclc-pillar'></div>
                                    <div className='rclc-text'>课堂奖励</div>
                                </div>
                                {/* 点赞数 */}
                                <div className='report-content-left-reward flex-center'>
                                    <div className='report-content-left-reward-number'>{praiseStatNum}</div>
                                </div>
                                {
                                    totalQuestionNum && <div className='report-content-left-reward-box'>
                                        {/* 课堂表现 */}
                                        <div className='report-content-left-course flex-start maring-bottom-10'>
                                            <div className='rclc-pillar'></div>
                                            <div className='rclc-text'>课堂奖励</div>
                                        </div>
                                        {/* 课堂表现 */}
                                        <div className='report-content-left-course flex-start'>
                                            <div className='rclc-pillar'></div>
                                            <div className='rclc-text'>课堂表现</div>
                                        </div>
                                        {/* 饼状图 */}
                                        <div className='report-content-left-course--box'>
                                            <div id='report-content-left-course-pie'></div>
                                            <div className='report-content-left-course-count'>{totalQuestionNum}题</div>
                                        </div>
                                        {/* 答题正确率 */}
                                        <div className='report-content-left-course-text'>
                                            <div>答题正确率：<span className='color-blue'>{questionCorrectRate}%</span></div>
                                            <div>班级平均正确率：<span className='color-blue'>{classAverageCorrectRate}%</span></div>
                                        </div>
                                    </div>
                                }

                            </div>
                            <div className='report-content-right'>
                                {/* 课堂表现 */}
                                <div className='report-content-left-course flex-start'>
                                    <div className='rclc-pillar'></div>
                                    <div className='rclc-text'>老师评价</div>
                                </div>
                                {/* 星星 */}
                                <div className='report-content-right-star'>
                                    {
                                        teacherEvaluationList.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    {
                                                        item.dimensionType === 1
                                                            ? <div className='evaluation-star-report'>
                                                                <div className='evaluation-star-dimensionValue'>{item.dimensionNameCn}</div>
                                                                <Rate disabled onChange={(e) => this.handleChangeStar(e, item, index)} value={parseInt(item.evaluationContent)} />
                                                            </div>
                                                            : <div className='evaluation-other-suggestions'>
                                                                <p>{item.evaluationContent}</p>
                                                            </div>
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // <div className='report-wrapper flex-center' >
            //     <div>
            //         <div className='flex-between report-title'>
            //             <div>{decodeURIComponent(courseTitle)}</div>
            //             <Button type='primary' onClick={this.backCourse}>返回课表</Button>
            //         </div>

        //     </div>
        // </div>
        );
    }
}

export default Report;