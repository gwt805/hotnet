<template>
    <div class="container">
        <div class="header">
            <a-menu class="menu" mode="horizontal" :selected-keys="['hotnet']" :overflowedIndicator="vnode"
                :items="[{ 'label': '首页', key: '/' }, { 'label': '导航网', key: '/websites/' }, { 'label': '热搜榜', key: 'hotnet' }]"
                @click="onClick" />
            <div class="datetime">
                <p class="time">{{ time }}</p>
                <p class="date">{{ date }}</p>
            </div>
        </div>
        <div class="common-layout">
            <el-card class="el-card" :key="idx" v-for="(v, idx) in hotlist_data">
                <div class="div-head">
                    <h3>{{ v.name }}</h3>
                </div>
                <div class="inner">
                    <ul class="hot-list-article">
                        <li v-for="subItem in v.value" :key="subItem.id"> <a :href="subItem.url" target="_blank"
                                draggable="false" rel="noopener noreferrer">{{ subItem.title }}</a></li>
                    </ul>
                </div>
                <!-- <div class="updtime">
                    <p>更新时间: {{ v.updateTime }}</p>
                </div> -->
            </el-card>
        </div>
        <div class="footer">
            <el-tooltip content="Github" :hide-after="0"><span><a onclick="window.open('https://github.com/gwt805')"
                        target="_blank"><img src="./assets/github.svg"></a></span></el-tooltip>
            <el-tooltip content="GitCode" :hide-after="0"><span><a onclick="window.open('https://gitcode.com/gwt805')"
                        target="_blank"><img src="./assets/gitcode.svg"></a></span></el-tooltip>
            <el-tooltip content="Gitee" :hide-after="0"><span><a onclick="window.open('https://gitee.com/gwt805')"
                        target="_blank"><img src="./assets/gitee.svg"></a></span></el-tooltip>
            <el-tooltip content="<img src='./gzh.jpg' style='width:100px;' />" raw-content :hide-after="0"><span><img
                        src="./assets/gzh.svg"></span></el-tooltip>
            <span>Copyright © gwt805</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { MenuOutlined } from "@antdv-next/icons";
import { h, ref, onMounted, onUnmounted } from 'vue';
import { ElLoading, ElMessage } from "element-plus";

const cron = ref();
const date = ref('');
const time = ref('');
const lastTime = ref(performance.now());
const vnode = h(MenuOutlined, { class: 'hover-icon' });

const hotlist = ref([])
const hotlist_data: any = ref([])
const http = axios.create()

const onClick = (data: any) => {
    if (data.key !== "hotnet") {
        window.location.href = `https://gwt805.github.io/${data.key=='/'?'':data.key}`;
    }
}
const getCurrentDateTime = () => {
    const now_date = new Date();
    const year = now_date.getFullYear();
    const month = String(now_date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(now_date.getDate()).padStart(2, '0');
    const hours = String(now_date.getHours()).padStart(2, '0');
    const minutes = String(now_date.getMinutes()).padStart(2, '0');
    const seconds = String(now_date.getSeconds()).padStart(2, '0');
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const weekday = weekdays[now_date.getDay()]; // 获取星期几，注意星期天是0，星期一是1，依此类推
    date.value = `${year}年${month}月${day}日 星期${weekday}`;
    time.value = `${hours}:${minutes}:${seconds}`;
    const now_timestamp = performance.now();
    const dt = now_timestamp - lastTime.value;
    if (dt > 1000) {
        lastTime.value = now_timestamp;
    }
}

const dataFormat = (time: string) => {
    const formatted = new Date(time).toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\//g, '-');

    return formatted;
}
onMounted(() => {
    cron.value = setInterval(getCurrentDateTime);
    let loadingService = ElLoading.service({ fullscreen: true, text: "正在加载资源 ~" });
    http.get("https://api.pearktrue.cn/api/dailyhot/").then((res: any) => {
        hotlist.value = res.data.data.platforms;
        for (let i = 0; i < hotlist.value.length; i++) {
            http.get(`https://api.pearktrue.cn/api/dailyhot/?title=${hotlist.value[i]}`).then((res: any) => {
                if (res.data.data.length > 1) hotlist_data.value.push({ "name": hotlist.value[i], "value": res.data.data.slice(0, 99), "updateTime": dataFormat(res.data.updateTime) });
            })
        }
        loadingService.close();
    }).catch(() => {
        loadingService.close();
        ElMessage({ type: "error", message: "加载失败，请稍后再试 ~", duration: 1000 });
    })
})
onUnmounted(() => {
    clearInterval(cron.value)
})
</script>

<style scoped lang="less">
.container {
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    user-select: none;
    background-image: url("./assets/background.jpg"); //https://img.8845.top/good   https://img.8845.top/acg/loli2.php
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .header {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(255, 255, 255, 0.2);
        color: black;
        box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);

        ::v-deep(.menu) {
            background-color: transparent;
            border-bottom: none;

            .hover-icon {
                color: black;
            }

            .ant-menu-item,
            .ant-menu-overflow-item {
                color: black;
                font-size: 16px;

                &::after,
                &::before {
                    border-bottom: none;
                }

                &:hover {
                    color: white;
                }
            }

            .ant-menu-item-selected,
            .ant-menu-submenu-selected {
                color: white;
                border-bottom: none;
            }
        }

        .datetime {
            height: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            word-break: keep-all;
            white-space: nowrap;
            text-align: center;
            margin-right: 15px;

            .time {
                // margin: 0;
                // padding: 0;
                font-size: 16px;
                font-weight: bold;
            }

            .date {
                // margin: 0;
                // padding: 0;
                font-size: 14px;
            }
        }
    }

    .common-layout {
        
        width: 100%;
        height: calc(100dvh - 82px);
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        background-color: rgba(255, 255, 255, 0.2);
        gap: 15px;
        padding: 0 15px;
        box-sizing: border-box;
        @media screen and (max-width: 450px) {
            grid-template-columns: 1fr;
        }

        .el-card {
            height: 410px;
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.3);

            .div-head {
                margin-top: -10px;
                color: white;
                height: 30px;
                line-height: 30px;
                text-align: center;
            }

            .inner {
                height: 350px;
                width: inherit;
                overflow: hidden;
                // border: 1px solid red;

                .hot-list-article li {
                    display: block;
                    line-height: 32px;
                    position: relative;
                    counter-increment: nums;
                    padding-left: 80px;
                    width: inherit;
                    margin-left: 10px;
                }

                .hot-list-article li a {
                    position: relative;
                    left: -40px;
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                }

                // li 前面的圆圈
                .hot-list-article li:before {
                    color: #000;
                    width: 22px;
                    height: 22px;
                    line-height: 22px;
                    text-align: center;
                    content: counter(nums, decimal);
                    position: absolute;
                    left: 0;
                    top: 5px;
                    border-radius: 100%;
                    background-color: #edefee;
                    text-shadow: 0 1px 0 rgba(255, 255, 255, .5);
                    font-family: SourceCodeProRegular, Menlo, Monaco, Consolas, "Courier New", monospace, 'Helvetica Neue', Arial, sans-serif
                }

                .hot-list-article li:first-child:before,
                .hot-list-article li:nth-child(2):before,
                .hot-list-article li:nth-child(3):before {
                    color: #fff;
                    text-shadow: none
                }

                .hot-list-article li:first-child:before {
                    background-color: #e24d46
                }

                /*第1行的行号样式*/
                .hot-list-article li:nth-child(2):before {
                    background-color: #2ea7e0
                }

                /*第2行的行号样式*/
                .hot-list-article li:nth-child(3):before {
                    background-color: #6bc30d
                }

                /*第3行的行号样式*/
                .hot-list-article li:hover {
                    a {
                        text-decoration: underline;
                        font-size: large;
                        display: inline-block;
                        transition: transform 0.3s ease-in-out;
                        transform: translateX(5px);
                    }
                }
            }

            .inner:hover {
                overflow-y: auto;
                overflow-x: hidden;
            }

            .updtime {
                // border: 1px solid red;
                height: 45px;
                line-height: 45px;
                color: rgba(0, 0, 0, 0.5);
                text-align: center;
                // border: 1px solid red;
            }
        }
    }

    .footer {
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a0a4e5;
        background-color: rgba(255, 255, 255, 0.2);

        img {
            vertical-align: middle;
        }

        span:not(:first-child) {
            margin-left: 10px;
        }
    }
}
</style>