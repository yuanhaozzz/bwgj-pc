import React, { Component, Fragment } from 'react';

import { CourseApi } from '../../../../api';
import { queryUrlParams } from '../../../../utils/common';
import Header from '../../../../components/page/broadcast/qa/common/Header';
import { Input } from 'antd';
import './search.less';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            question: ['abcd', 'abc', 'abcde', 'abdcqw'],
            searchTimer: null,
            pageIndex: 1,
            questionTypeList: {},
            scrollTimer: null
        };
    }

    componentDidMount () {
        this.bindScrollEvent();
    }

    /**
     * 匹配输入的值
     */
    renderValueList = () => {
        let { questionTypeList } = this.state;
        if (!questionTypeList.questionList) {
            return (
                <div></div>
            );
        }
        // if (value.length === 0) {
        //     return (
        //         <p>未找到相关问题</p>
        //     );
        // }
        return (
            <Fragment>
                {
                    questionTypeList.questionList.map((item, index) => (
                        <p className='search-list-item' key={index} onClick={() => this.jumpToH5(item)}>{item.questionDescription}</p>
                    ))
                }
                {
                    questionTypeList.haveNextPage === 1 ? <p className='loadmore-title'>正在加载更多数据</p> : <p className='loadmore-title'>没有更多数据</p>
                }

            </Fragment>
        );

    }

    /**
     * 请求数据
     * @param {boolean} isLoadmore   加载更多
     */
    getQuestionList = (isLoadmore = false) => {
        let { type } = queryUrlParams();
        let { questionTypeList, pageIndex } = this.state;
        if (isLoadmore) {
            pageIndex = ++pageIndex;
            this.setState({
                pageIndex
            });
        }
        if (questionTypeList.haveNextPage && questionTypeList.haveNextPage === 0) {
            return;
        }

        let params = {
            action: 'getQaQuestionList',
            keyword: this.state.searchValue,
            pageIndex: pageIndex,
            pageSize: 20,
            displayTerminal: type
        };
        CourseApi.sendBaseApi(params).then(res => {

            let qaQuestionList = res.qaQuestionList;
            // 加载更多
            if (isLoadmore) {
                qaQuestionList = res.qaQuestionList;
                qaQuestionList.questionList = [...questionTypeList.questionList, ...qaQuestionList.questionList];
            }
            this.setState({
                questionTypeList: qaQuestionList
            });
            console.log(questionTypeList);

        }).catch(err => {
            this.setState({
                questionTypeList: {}
            });
        });
    }

    /**
     * 跳转
     */
    jumpToH5 = item => {
        let { questionDescription, answerDescription } = item;
        localStorage.setItem('answerDescription', answerDescription);
        location.href = `/live/broadcast/qa/detail?title=${encodeURIComponent(questionDescription)}`;
    }

    /**
     * 加载更多
     */
    bindScrollEvent = () => {
        let scrollWrapper = document.querySelector('.search-list');
        let { scrollTimer } = this.state;
        scrollWrapper.addEventListener('scroll', e => {
            console.log(1);
            let { scrollHeight, clientHeight, scrollTop } = scrollWrapper;
            if (clientHeight + scrollTop >= scrollHeight) {
                clearTimeout(scrollTimer);
                this.setState({
                    scrollTimer: setTimeout(() => {
                        this.getQuestionList(true);
                    }, 1000)
                });
            }
        });
    }

    /**
     * 输入框输入字符
     */
    onChange = e => {

        let value = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
        let { searchTimer } = this.state;
        this.setState({
            searchValue: value,
            pageIndex: 1
        });


        clearTimeout(searchTimer);
        this.setState({
            searchTimer: setTimeout(() => {
                if (value === '') {
                    return;
                };
                let scrollWrapper = document.querySelector('.search-list');
                scrollWrapper.scrollTop = 0;
                this.getQuestionList();
            }, 1000)
        });
    }

    render () {
        let { searchValue } = this.state;
        return (
            <div className='qa-search-wrapper'>
                <Header title='用户帮助中心' ></Header>
                <section className='search-input'>
                    <Input
                        allowClear
                        value={searchValue}
                        placeholder='请输入问题名称'
                        onChange={this.onChange}
                    ></Input >
                </section>
                <section className='search-list' style={{ display: searchValue ? 'block' : 'none' }}>
                    {
                        this.renderValueList()
                    }
                </section>


            </div>
        );
    }
}

export default Search;