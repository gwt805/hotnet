<template>
    <div class="common-layout">
        <div class="div-f">
            <el-card :key="idx" style="max-width: 480px" v-for="(v, idx) in card_data">
                <div class="div-head">
                    <h3>{{ v.name }}</h3>
                </div>
                <div class="inner">
                    <ul class="hot-list-article">
                        <li v-for="subItem in v.data" :key="subItem.index"> <a :href="subItem.url" target="_blank" draggable="false">{{subItem.title }}</a></li>
                    </ul>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ElLoading } from "element-plus";
import { ref, onMounted, onUnmounted } from 'vue';

const card_data: any = ref([])
const http = axios.create()
onMounted(() => {
    const loadingService = ElLoading.service({fullscreen: true, text: "正在加载资源 ~"});
    http.get("https://api.vvhan.com/api/hotlist/all").then((res: any) => {
        card_data.value = res.data.data;
        loadingService.close();
    }).catch(() => {
        loadingService.close();
    })
    document.getElementsByTagName("html")[0].classList.add("dark");
})
onUnmounted(() => {
    document.getElementsByTagName("html")[0].classList.remove("dark");
    window.history.pushState(null, "", window.location.href =  "/index");
})
</script>

<style scoped lang="less">
.common-layout {
    height: 100%;
    width: 100%;
    user-select: none;
    .div-f {
        display: grid;
        grid-template-columns: repeat(auto-fit, 360px);
        grid-auto-flow: row;
        grid-auto-columns: minmax(0, 1fr);
        grid-gap: 20px;
        justify-content: center;

        .el-card {
            .div-head {
                margin-top: -40px;
                text-align: center;
            }

            width: 360px;
            border-radius: 20px;
            
            .inner {
                height: 420px;
                overflow: hidden;
                margin: -20px 0 0 -40px;

                .hot-list-article li {
                    display: block;
                    line-height: 32px;
                    position: relative;
                    counter-increment: nums;
                    padding-left: 80px;
                    max-width: 260px;
                }
                .hot-list-article li a:hover {
                    cursor: url("./assets/mouse.png"), default !important;;
                }
                .hot-list-article li a {
                    position: relative;
                    left: -40px;
                    color: #787977;
                    text-decoration: none;
                }

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
                overflow: auto;
            }
        }
    }
}
</style>